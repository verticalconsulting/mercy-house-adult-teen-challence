/**
 * Vehicle Donation Program — lead delivery to the ministry inbox.
 *
 * Posts the request to the Formspree form the team already monitors. The
 * endpoint is a public form ID — the same value a plain HTML <form action>
 * would carry — so it is safe to ship in client code, unlike an API key.
 * Formspree accepts a JSON body as long as the request sends
 * `Accept: application/json`.
 */
const VEHICLE_DONATION_ENDPOINT = 'https://formspree.io/f/mqppqwyr';

/**
 * Subject line for the ministry inbox. `_subject` is Formspree's reserved field
 * for overriding the form's default subject, so the team can triage pickups
 * from the inbox list without opening each message.
 */
function subjectFor(payload) {
  const isProperty = payload.donation_type === 'house' || payload.donation_type === 'land';
  const kind = isProperty
    ? 'property'
    : payload.donation_type === 'motorcycle'
      ? 'motorcycle'
      : 'vehicle';
  const subject = isProperty
    ? ''
    : [payload.vehicle_year, payload.vehicle_make, payload.vehicle_model].filter(Boolean).join(' ');
  return subject ? `New ${kind} donation: ${subject}` : `New ${kind} donation`;
}

export async function submitVehicleDonation(payload) {
  const response = await fetch(VEHICLE_DONATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subjectFor(payload),
      _gotcha: '',
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Vehicle donation form endpoint returned ${response.status}`);
  }

  return response.json().catch(() => ({}));
}