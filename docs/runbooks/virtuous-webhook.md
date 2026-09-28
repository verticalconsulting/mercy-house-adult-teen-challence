# Runbook: Virtuous monthly-gift webhook

**What this solves:** `/donate/monthly` embeds a Virtuous-hosted giving form
in a cross-origin iframe (`src/components/VirtuousGiveForm.jsx`). There is no
redirect back to this site after payment, so the browser cannot observe a
completed monthly gift — the URL-parameter mechanism that captures one-time
donations and sponsorships physically cannot see it. Virtuous is the only
party that knows the gift happened, so the conversion is reported server-side.

Handler: `base44/functions/virtuousGiftWebhook/entry.ts`.

## Required environment variables

Set these in the Base44 function environment:

| Variable | Where it comes from |
|---|---|
| `GA4_MEASUREMENT_ID` | GA4 → Admin → Data streams → your web stream (`G-XXXXXXX`) |
| `GA4_API_SECRET` | Same screen → Measurement Protocol API secrets → Create |
| `AUTOMATION_SECRET` | Already used by other functions; the webhook must send it as `automation_secret` in the POST body |

## Verify the payload BEFORE wiring Virtuous

GA4's Measurement Protocol returns **204 for a malformed event exactly as it
does for a valid one**. The normal endpoint cannot tell you whether anything
worked. Use the debug endpoint, which is the only way to see validation
errors:

```bash
curl -s -X POST \
  "https://www.google-analytics.com/debug/mp/collect?measurement_id=$GA4_MEASUREMENT_ID&api_secret=$GA4_API_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"client_id":"virtuous.test-1","events":[{"name":"monthly_gift_complete","params":{"currency":"USD","value":50,"transaction_id":"test-1","checkout_type":"monthly"}}]}'
```

Expected: `{"validationMessages":[]}`. A non-empty array means the event would
be **silently dropped** in production.

Then confirm it lands: add `"debug_mode": true` to the event params, resend,
and watch GA4 → Admin → DebugView. The event should appear within ~30s.

This step was **not** performed during implementation — there was no network
access or credentials in that environment. It is genuinely unverified until
someone runs it.

## Wire up Virtuous

1. Virtuous → Settings → Integrations → Webhooks (or Automation).
2. Trigger: recurring gift created, or first successful recurring payment.
3. URL: the deployed `virtuousGiftWebhook` function URL.
4. The body must include `automation_secret` matching `AUTOMATION_SECRET`,
   plus `giftId` (or `id`) and `amount`. Without a matching secret the handler
   returns 401 — deliberate, because the function URL is public.

## Replay a test gift

Make a test recurring gift through `/donate/monthly`, then check in order:
Virtuous shows the schedule → Base44 function logs show a 200 → GA4 DebugView
shows `monthly_gift_complete`. If the function logged "GA4 credentials
missing", the env vars are not set on the deployed function.

## Known limitation

`client_id` is synthesised per gift (`virtuous.<giftId>`) because the donor's
real GA client id lives inside the iframe and is never exposed to the parent
page. GA4 therefore counts these as new sessions rather than joining them to
the donor's on-site journey, so monthly gifts will not carry a channel
attribution path. That is inherent to measuring an iframed processor, not a
bug to be fixed.
