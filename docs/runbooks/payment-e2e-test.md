# Runbook: End-to-end payment and notification test

**Who runs this:** someone with the Stripe dashboard, the Virtuous dashboard,
the Base44 Employee Portal, and access to the inboxes that receive
notifications.

**Run against:** the deployed build, not `npm run dev`. `shouldTrack()` in
`src/lib/analytics.js` gates on hostname, so analytics events do not fire on
localhost by design — a local run cannot verify any conversion.

**Before starting:** put Stripe in **test mode** and confirm the test keys are
what the deployed functions are using. Use card `4242 4242 4242 4242`, any
future expiry, any CVC.

## The matrix

Work top to bottom. A failure in an early row invalidates later ones.

| # | Flow | Steps | Expected |
|---|---|---|---|
| 1 | One-time donation | `/donate`, card `4242…`, complete | Stripe success; return to `/?donation=success`; `donation_complete` in `window.dataLayer`; charge visible in Stripe; donor receipt email received |
| 2 | Declined card | `/donate`, card `4000 0000 0000 0002` | Decline shown in-form; **no** `donation_complete` event; no charge in Stripe |
| 3 | Monthly gift | `/donate/monthly`, complete the Virtuous form | Recurring schedule appears in Virtuous; webhook fires; `monthly_gift_complete` visible in GA4 DebugView |
| 4 | Duplicate-refresh guard | Complete row 1, then hard-refresh the return URL | `donation_complete` fires **exactly once** — the sessionStorage dedupe in `trackCheckoutReturn` |
| 5 | Sponsor a student | `/donate-sponsor-student`, complete | Return to `?sponsorship=success`; `sponsorship_complete` fires |
| 6 | Vehicle donation | `/vehicle-donation-program/form`, submit | `VehicleDonation` record in Base44; `vehicle_donation_submit` fires; staff notification email received |
| 7 | Volunteer | `/get-involved`, submit | Submission in Formspree; `volunteer_submit` fires; notification email received |
| 8 | Intake application | `/get-help-now`, submit | `Application` record created; `submitIntakeApplication` ran without error; confirmation email received |
| 9 | Contact intent | `/contact`, click a phone link and an email link | Two `contact_click` events, `method: phone` and `method: email` |

## Reading the dataLayer

On the deployed site, open the browser console and run:

```js
window.dataLayer.filter(e => e.event && !e.event.startsWith('gtm.'))
```

## Email is the part that fails silently

For every row that expects an email, record **which address received it** and
**how long it took**. A form that writes its record successfully but never
sends the notification looks identical to a working one from the UI — the
submitter sees a success screen either way, and the lead is simply lost. This
is the single most common way this system breaks in production.

Check for each: the recipient inbox, the spam folder, and the Base44 function
logs for a send error.

| Row | Email expected | Recipient | Received? | Delay |
|---|---|---|---|---|
| 1 | Donor receipt | | | |
| 6 | Staff: new vehicle donation | | | |
| 7 | Staff: new volunteer | | | |
| 8 | Applicant confirmation + staff notice | | | |

## Before going live

- Switch Stripe back to **live mode**.
- Delete or refund the test charges.
- Clear the test records (`VehicleDonation`, `Application`, `Testimonial`)
  from Base44 so they do not appear in staff dashboards as real leads.
