/**
 * NHTSA vPIC lookups behind the vehicle fields.
 *
 * vPIC is a free, keyless government service that answers with
 * `Access-Control-Allow-Origin: *`, so the browser calls it directly — no
 * proxy function and no secret to protect. Everything here is a convenience:
 * every field stays editable by hand, so a failed lookup only costs the donor
 * a tap.
 */
const VPIC = 'https://vpic.nhtsa.dot.gov/api/vehicles';

// vPIC files SUVs, pickups and vans under "car"; boats are not covered at all.
const MAKE_TYPE = {
  car: 'car',
  suv: 'car',
  truck: 'car',
  rv: 'car',
  motorcycle: 'motorcycle',
};

// Brands whose spelling is not title case.
const ACRONYMS = new Set(['BMW', 'GMC', 'KIA', 'MG', 'VW', 'AMC']);

export const VIN_LENGTH = 17;

/** vPIC shouts in caps — "TESLA", "ROLLS-ROYCE" — so tidy it for the form. */
function tidy(value) {
  if (!value) return '';
  return value
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (ACRONYMS.has(word.toUpperCase())) return word.toUpperCase();
      return word
        .toLowerCase()
        .replace(/(^|[-/])([a-z])/g, (_, separator, letter) => separator + letter.toUpperCase());
    })
    .join(' ');
}

function rowsOf(payload) {
  return Array.isArray(payload?.Results) ? payload.Results : [];
}

/** Decode a VIN into the vehicle fields the form shows. */
export async function decodeVin(vin) {
  const cleaned = vin.trim().toUpperCase();
  if (cleaned.length !== VIN_LENGTH) {
    throw new Error(`A VIN is ${VIN_LENGTH} characters. Check the windshield or door jamb.`);
  }

  const response = await fetch(`${VPIC}/DecodeVinValues/${encodeURIComponent(cleaned)}?format=json`);
  if (!response.ok) throw new Error('The VIN lookup service is busy. Please enter the details by hand.');

  const [result] = rowsOf(await response.json());
  if (!result?.Make) throw new Error("We couldn't read that VIN. Please enter the details by hand.");

  return {
    vehicle_year: result.ModelYear || '',
    vehicle_make: tidy(result.Make),
    vehicle_model: tidy(result.Model),
    vehicle_trim: result.Trim || '',
    body_style: result.BodyClass || '',
    engine: [
      result.DisplacementL ? `${Number(result.DisplacementL).toFixed(1)}L` : '',
      result.EngineCylinders ? `${result.EngineCylinders}-cyl` : '',
    ]
      .filter(Boolean)
      .join(' '),
    fuel_type: result.FuelTypePrimary || '',
    drive_type: result.DriveType || '',
  };
}

/** Manufacturer suggestions for the chosen donation type. */
export async function fetchMakes(donationType) {
  const type = MAKE_TYPE[donationType];
  if (!type) return [];

  const response = await fetch(`${VPIC}/GetMakesForVehicleType/${type}?format=json`);
  if (!response.ok) return [];

  const names = rowsOf(await response.json()).map((row) => tidy(row.MakeName));
  return [...new Set(names.filter(Boolean))].sort();
}

/** Model suggestions for a manufacturer, once there is enough of a name to match. */
export async function fetchModels(make) {
  if (!make || make.trim().length < 2) return [];

  const response = await fetch(`${VPIC}/GetModelsForMake/${encodeURIComponent(make.trim())}?format=json`);
  if (!response.ok) return [];

  const names = rowsOf(await response.json()).map((row) => tidy(row.Model_Name));
  return [...new Set(names.filter(Boolean))].sort();
}