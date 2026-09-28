/**
 * Virtuous recurring-gift webhook -> GA4 Measurement Protocol.
 *
 * Why server-side: /donate/monthly embeds a Virtuous-hosted iframe
 * (see src/components/VirtuousGiveForm.jsx). It is cross-origin and there is
 * no post-payment redirect back to this site, so the browser has no way to
 * observe a completed monthly gift — the URL-parameter mechanism in
 * src/lib/analytics.js physically cannot see it. Virtuous is the only party
 * that knows the gift happened.
 *
 * `client_id` is a synthetic per-gift id, not the donor's GA client id, which
 * we never see. GA4 therefore attributes these as new sessions rather than
 * joining them to the on-site journey; that is a known and accepted limit of
 * measuring an iframed processor.
 */
import { verifyAutomationSecret } from '../../shared/security.ts';

const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!verifyAutomationSecret(body)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const measurementId = Deno.env.get('GA4_MEASUREMENT_ID');
  const apiSecret = Deno.env.get('GA4_API_SECRET');
  if (!measurementId || !apiSecret) {
    console.error('GA4 credentials missing; monthly gift not reported');
    return Response.json({ error: 'Not configured' }, { status: 500 });
  }

  const giftId = String(body.giftId ?? body.id ?? crypto.randomUUID());
  const amount = Number(body.amount ?? 0);

  const res = await fetch(
    `${GA4_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: `virtuous.${giftId}`,
        events: [
          {
            name: 'monthly_gift_complete',
            params: {
              currency: 'USD',
              value: amount,
              transaction_id: giftId,
              checkout_type: 'monthly',
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    console.error('GA4 Measurement Protocol rejected the event', res.status, await res.text());
    return Response.json({ error: 'Upstream error' }, { status: 502 });
  }

  return Response.json({ ok: true, giftId });
});
