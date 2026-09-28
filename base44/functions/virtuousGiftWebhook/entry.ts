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
 * Retry policy: this handler answers 200 for everything except a bad request
 * or a bad secret. That is deliberate. `monthly_gift_complete` is a custom
 * event, so GA4's `transaction_id` dedupe — which only applies to `purchase`
 * — does not protect us, and there is no store here to dedupe against. A
 * retryable status would therefore let one gift be counted two or three
 * times, inflating reported revenue and training Ads' bidding model on the
 * inflated figure. Losing a conversion is recoverable; silently doubling
 * donation revenue is not. Failures are logged for manual replay.
 */
import { verifyAutomationSecret } from '../../shared/security.ts';
import { buildGa4MonthlyGiftPayload } from './payload.js';

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

  const giftId = String(body.giftId ?? body.id ?? crypto.randomUUID());

  if (!measurementId || !apiSecret) {
    // 200, not 500: see the retry policy above. Logged loudly instead.
    console.error(
      `GA4 credentials missing; monthly gift ${giftId} NOT reported. Set GA4_MEASUREMENT_ID and GA4_API_SECRET.`
    );
    return Response.json({ ok: false, reported: false, reason: 'not_configured', giftId });
  }

  const payload = buildGa4MonthlyGiftPayload({ giftId, amount: body.amount });

  let res;
  try {
    res = await fetch(
      `${GA4_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  } catch (err) {
    console.error(`GA4 request failed for monthly gift ${giftId}; NOT reported.`, err);
    return Response.json({ ok: false, reported: false, reason: 'network_error', giftId });
  }

  if (!res.ok) {
    console.error(
      `GA4 rejected monthly gift ${giftId} with ${res.status}; NOT reported.`,
      await res.text()
    );
    return Response.json({ ok: false, reported: false, reason: 'upstream_error', giftId });
  }

  return Response.json({ ok: true, reported: true, giftId });
});
