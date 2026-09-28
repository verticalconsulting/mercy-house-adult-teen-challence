/**
 * GA4 Measurement Protocol payload for a completed monthly gift.
 *
 * Plain JS with no Deno globals so it can be unit-tested — the alternative is
 * trusting a live endpoint that returns 204 for malformed events exactly as
 * it does for valid ones.
 */

/** Stable 32-bit hash, so the same gift always yields the same session id. */
function hashToInt(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function buildGa4MonthlyGiftPayload({ giftId, amount }) {
  const id = String(giftId);
  // Number(anything non-scalar) is NaN, and JSON.stringify turns NaN into
  // null, which GA4 rejects for a numeric param.
  const parsed = Number(amount);
  const value = Number.isFinite(parsed) ? parsed : 0;

  return {
    // Not the donor's real GA client id — that lives inside the Virtuous
    // iframe and is never exposed to the parent page. Derived from the gift
    // id so a retry maps to the same pseudo-user instead of inventing one.
    client_id: `virtuous.${id}`,
    events: [
      {
        name: 'monthly_gift_complete',
        params: {
          currency: 'USD',
          value,
          transaction_id: id,
          checkout_type: 'monthly',
          // Without these two, Measurement Protocol events are accepted with
          // a 204 and then fail to appear in standard reports — they are not
          // attached to a session and count as no engaged activity. This is
          // the most common way a "working" server-side conversion turns out
          // to be invisible.
          session_id: String(hashToInt(id)),
          engagement_time_msec: 1,
        },
      },
    ],
  };
}
