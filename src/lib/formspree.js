/**
 * Vehicle Donation Program — lead delivery to the ministry inbox.
 *
 * Posts the request to the Formspree form the team already monitors. The
 * endpoint is a public form ID — the same value a plain HTML <form action>
 * would carry — so it is safe to ship in client code, unlike an API key.
 * Formspree accepts a JSON body as long as the request sends
 * `Accept: application/json`.
 */
const VEHICLE_DONATION_ENDPOINT = 'https://formspree.io/f/xpppzvlg';

export async function submitVehicleDonation(payload) {
  const response = await fetch(VEHICLE_DONATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Vehicle donation form endpoint returned ${response.status}`);
  }

  return response.json().catch(() => ({}));
}