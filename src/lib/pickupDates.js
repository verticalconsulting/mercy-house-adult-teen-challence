/**
 * Pickup scheduling rules.
 *
 * The team needs a week to line up the truck, so the earliest bookable date is
 * seven days out. Dates are compared as `YYYY-MM-DD` strings, which sort
 * correctly and sidestep the timezone drift of `new Date(value)`.
 */
export const PICKUP_LEAD_DAYS = 7;

function toInputDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getMinPickupDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + PICKUP_LEAD_DAYS);
  return toInputDate(date);
}

/** Pickup is optional; when a date is given it must clear the lead time. */
export function isPickupDateAllowed(value) {
  if (!value) return true;
  return value >= getMinPickupDate();
}

export function formatPickupDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}