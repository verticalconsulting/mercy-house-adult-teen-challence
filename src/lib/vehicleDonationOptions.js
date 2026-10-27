/** Donation types, conditions and title states shown in the vehicle donation form. */
export const DONATION_TYPES = [
  { value: 'car', label: 'Car, truck, SUV or van' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'rv', label: 'RV or camper' },
  { value: 'boat', label: 'Boat' },
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land' },
];

/** Types that have no year, make or model — they get a description instead. */
export const PROPERTY_TYPES = ['house', 'land'];

export const isPropertyType = (value) => PROPERTY_TYPES.includes(value);

export const donationTypeLabel = (value) =>
  DONATION_TYPES.find((type) => type.value === value)?.label || 'Vehicle';

export const CONDITIONS = [
  { value: 'running', label: 'Runs and drives' },
  { value: 'needs_repairs', label: 'Runs, but needs repairs' },
  { value: 'not_running', label: 'Does not run' },
];

export const TITLE_OPTIONS = [
  { value: 'have_title', label: 'I have the title in hand' },
  { value: 'no_title', label: 'I do not have the title' },
  { value: 'in_process', label: 'The title is in process' },
];