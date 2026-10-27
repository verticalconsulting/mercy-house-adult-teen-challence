import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CONDITIONS } from '@/lib/vehicleDonationOptions';
import { VIN_LENGTH, decodeVin, fetchMakes, fetchModels } from '@/lib/vinLookup';

const THIS_YEAR = new Date().getFullYear();

/**
 * The vehicle half of step one.
 *
 * Year, make and model are plain inputs with suggestion lists rather than
 * dropdowns: the manufacturer catalogue is public data, and a donor with an
 * old or unusual vehicle must still be able to type it. Decoding a VIN fills
 * every field in, which is what most donors do.
 */
export default function VehicleFields({ form, set, donationType }) {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [lookup, setLookup] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    let active = true;
    fetchMakes(donationType).then((list) => {
      if (active) setMakes(list);
    });
    return () => {
      active = false;
    };
  }, [donationType]);

  // Model suggestions trail the make, but only once there is enough typed to
  // match on — and never fast enough to fire on every keystroke.
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      fetchModels(form.vehicle_make).then((list) => {
        if (active) setModels(list);
      });
    }, 500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [form.vehicle_make]);

  const handleDecode = async () => {
    setLookup({ loading: true, message: '', error: '' });
    try {
      const decoded = await decodeVin(form.vin);
      let filled = 0;
      Object.entries(decoded).forEach(([field, value]) => {
        if (value) {
          set(field, String(value));
          filled += 1;
        }
      });
      set('vin_decoded', 'true');
      setLookup({
        loading: false,
        message: filled
          ? 'VIN decoded. Check the details below and correct anything that looks off.'
          : "That VIN came back empty. Please fill these in by hand.",
        error: '',
      });
    } catch (err) {
      setLookup({ loading: false, message: '', error: err.message });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="vd-vin">VIN (optional)</Label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <Input
            id="vd-vin"
            value={form.vin}
            onChange={(event) => set('vin', event.target.value.toUpperCase())}
            maxLength={VIN_LENGTH}
            placeholder="17 characters, on the windshield or door jamb"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={handleDecode}
            disabled={lookup.loading || !form.vin.trim()}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md border-2 border-navy px-5 py-[13px] font-bold text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy"
          >
            {lookup.loading ? 'Looking up…' : 'Fill from VIN'}
          </button>
        </div>
        {lookup.message && !lookup.error && (
          <p className="mt-1.5 text-sm text-muted-foreground">{lookup.message}</p>
        )}
        {lookup.error && (
          <p role="alert" className="mt-1.5 text-sm font-semibold text-destructive">
            {lookup.error}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="vd-year">Year</Label>
          <Input
            id="vd-year"
            type="number"
            inputMode="numeric"
            min="1900"
            max={THIS_YEAR + 1}
            placeholder="2015"
            className="mt-1.5"
            value={form.vehicle_year}
            onChange={(event) => set('vehicle_year', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-make">Make</Label>
          <Input
            id="vd-make"
            list="vd-makes"
            placeholder="Toyota"
            autoComplete="off"
            className="mt-1.5"
            value={form.vehicle_make}
            onChange={(event) => set('vehicle_make', event.target.value)}
          />
          <datalist id="vd-makes">
            {makes.map((make) => (
              <option key={make} value={make} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="vd-model">Model</Label>
          <Input
            id="vd-model"
            list="vd-models"
            placeholder="Camry"
            autoComplete="off"
            className="mt-1.5"
            value={form.vehicle_model}
            onChange={(event) => set('vehicle_model', event.target.value)}
          />
          <datalist id="vd-models">
            {models.map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="vd-condition">Condition</Label>
          <Select
            value={form.vehicle_condition}
            onValueChange={(value) => set('vehicle_condition', value)}
          >
            <SelectTrigger id="vd-condition" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="vd-mileage">Mileage (optional)</Label>
          <Input
            id="vd-mileage"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="85000"
            className="mt-1.5"
            value={form.mileage}
            onChange={(event) => set('mileage', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-xl border border-border p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-gold-accessible">
            Vehicle details (optional)
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Filled in automatically when you decode a VIN.
          </p>
        </div>
        <div>
          <Label htmlFor="vd-trim">Trim</Label>
          <Input
            id="vd-trim"
            placeholder="EX-L"
            className="mt-1.5"
            value={form.vehicle_trim}
            onChange={(event) => set('vehicle_trim', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-body">Body style</Label>
          <Input
            id="vd-body"
            placeholder="Sedan"
            className="mt-1.5"
            value={form.body_style}
            onChange={(event) => set('body_style', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-engine">Engine</Label>
          <Input
            id="vd-engine"
            placeholder="3.0L 6-cyl"
            className="mt-1.5"
            value={form.engine}
            onChange={(event) => set('engine', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-fuel">Fuel type</Label>
          <Input
            id="vd-fuel"
            placeholder="Gasoline"
            className="mt-1.5"
            value={form.fuel_type}
            onChange={(event) => set('fuel_type', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-drive">Drive type</Label>
          <Input
            id="vd-drive"
            placeholder="FWD"
            className="mt-1.5"
            value={form.drive_type}
            onChange={(event) => set('drive_type', event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}