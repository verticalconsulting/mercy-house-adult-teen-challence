# Runbook: Migrate the Google Ads conversion tags

**Who runs this:** someone with edit access to the Google Ads account, the GA4
property, and the GTM container.

## The conversion inventory

Everything the site can now report. All six fire as `dataLayer` pushes from
`src/lib/analytics.js` except the monthly gift, which is server-side.

| Conversion | dataLayer event | Fired from | Notes |
|---|---|---|---|
| Donation complete | `donation_complete` | `trackCheckoutReturn`, Stripe `?donation=success` | Deduped per session |
| Monthly gift | `monthly_gift_complete` | Virtuous webhook → GA4 Measurement Protocol | Server-side; see virtuous-webhook.md |
| Sponsor a student | `sponsorship_complete` | `trackCheckoutReturn`, Stripe `?sponsorship=success` | Deduped per session |
| Vehicle donation form | `vehicle_donation_submit` | `VehicleDonationForm` mutation `onSuccess` | Lead, not revenue |
| Contact | `contact_click` | `tel:`/`mailto:` clicks on `/contact` | **Intent only — see warning** |
| Volunteer | `volunteer_submit` | Formspree `state.succeeded` | Lead, not revenue |

Two further events already exist and can be imported if wanted:
`intake_payment_complete` and `intake_sponsored_complete`.

## Warning: contact_click is not a completed contact

`/contact` has no form. It lists phone numbers and email addresses, so the
only measurable signal is the click on the link. A click means someone opened
their dialler or mail client — not that they called, and not that anyone
answered. Give it a low conversion value, or mark it Secondary. Importing it
as a Primary conversion at donation-equivalent value will teach Smart Bidding
to buy clicks from people who never make contact.

## Steps

1. **Inventory what exists.** Ads → Goals → Conversions → Summary. For each
   action record: name, source (Website / Google Analytics 4 / Import),
   category, count setting, value, attribution model, and whether it is
   Primary or Secondary. Screenshot the table — this is your rollback
   reference.
2. **Identify legacy tags.** Any action with source "Website" was created from
   a gtag `AW-` snippet. Find where that snippet lives on the old site. It
   will not exist in this codebase — this repo has never contained an `AW-`
   tag.
3. **Create the GA4 conversions.** In GA4 → Admin → Events, mark each of the
   six event names above as a conversion. They must have fired at least once
   before GA4 will list them, so run the payment E2E matrix first, or create
   them manually via Admin → Conversions → New conversion event.
4. **Link GA4 to Ads** if not already: GA4 → Admin → Product links → Google
   Ads links.
5. **Import into Ads:** Goals → Conversions → New conversion action → Import
   → Google Analytics 4 properties → select the six events.
6. **Set values and counting:**
   - `donation_complete`, `monthly_gift_complete`, `sponsorship_complete`:
     use the event value, count **Every**.
   - `vehicle_donation_submit`, `volunteer_submit`: a fixed estimated value,
     count **One** (a person filling the form twice is one lead).
   - `contact_click`: low or zero value, count **One**, consider Secondary.
7. **Run both in parallel.** Leave the legacy `AW-` tags firing alongside the
   new GA4-imported conversions for **at least two weeks**.
8. **Compare before removing anything.** Export daily totals for old and new
   for the overlap period. Expect the new numbers to differ slightly —
   different attribution windows and models. Investigate any gap over ~10%.
   Only then remove the legacy tags.

Removing the old tags first makes any discrepancy unattributable: you will
not be able to tell a tracking bug from a genuine change in conversion rate.

## Confirming it is done

- GA4 DebugView shows all six events during an E2E test run.
- Ads → Conversions lists six imported actions with "Recording conversions".
- Two weeks of parallel data with old and new totals within ~10%.
- Legacy `AW-` snippets removed from the old site and the container.
