import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploadInput from '@/components/ImageUploadInput';

/**
 * Admin manager for the home page "Who We Serve" program images.
 *
 * Each slot is keyed (womens_program, mens_program) so the Home page can look
 * it up by key. Images are compressed and resized client-side by
 * ImageUploadInput (Canvas API → JPEG) before upload, keeping the home page
 * fast for Google PageSpeed Insights without a server round-trip.
 */
const IMAGE_SLOTS = [
  {
    key: 'womens_program',
    label: "Women's Program",
    defaultImage: '/assets/images/women-program.png',
    defaultAlt: 'Women in the Mercy House program gathered together outdoors',
    maxWidth: 1200,
  },
  {
    key: 'mens_program',
    label: "Men's Program",
    defaultImage: '/assets/images/mens-1.jpeg',
    defaultAlt: 'Men in the Mercy House program working together on campus',
    maxWidth: 1200,
  },
];

export default function HomeImageManager() {
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { items } = await base44.entities.HomeImage.filter(
          { key: { $in: IMAGE_SLOTS.map((s) => s.key) } },
          { limit: 50 }
        );
        const byKey = {};
        items.forEach((item) => {
          byKey[item.key] = item;
        });
        setRecords(byKey);
      } catch (err) {
        toast.error('Could not load home images');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getField = (slot) => {
    const rec = records[slot.key];
    return {
      image_url: rec?.image_url || '',
      alt_text: rec?.alt_text || rec?.label || slot.defaultAlt,
    };
  };

  const updateField = (slotKey, field, value) => {
    setRecords((prev) => {
      const existing = prev[slotKey] || { key: slotKey };
      return {
        ...prev,
        [slotKey]: { ...existing, key: slotKey, [field]: value },
      };
    });
  };

  const handleSave = async (slot) => {
    setSaving(slot.key);
    try {
      const data = getField(slot);
      const existing = records[slot.key];
      if (existing?.id) {
        await base44.entities.HomeImage.update(existing.id, {
          image_url: data.image_url,
          alt_text: data.alt_text,
          label: slot.label,
        });
      } else {
        await base44.entities.HomeImage.create({
          key: slot.key,
          image_url: data.image_url,
          alt_text: data.alt_text,
          label: slot.label,
        });
      }
      toast.success(`${slot.label} image saved`);
      // Reload to sync ids
      const { items } = await base44.entities.HomeImage.filter(
        { key: { $in: IMAGE_SLOTS.map((s) => s.key) } },
        { limit: 50 }
      );
      const byKey = {};
      items.forEach((item) => {
        byKey[item.key] = item;
      });
      setRecords(byKey);
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(null);
    }
  };

  const handleReset = (slot) => {
    updateField(slot.key, 'image_url', '');
    updateField(slot.key, 'alt_text', slot.defaultAlt);
    toast.info(`Reverted to default ${slot.label} image (save to apply)`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-navy dark:text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-navy dark:text-gold">
            Home Page — "Who We Serve" Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Upload, replace, or reset the program card images shown on the home
            page. Each image is automatically resized to {IMAGE_SLOTS[0].maxWidth}px
            wide and compressed to JPEG in your browser before upload, so the
            home page stays fast for Google PageSpeed Insights.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Tip: use a landscape photo (roughly 4:3) for the best fit in the card.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {IMAGE_SLOTS.map((slot) => {
          const field = getField(slot);
          const isSaving = saving === slot.key;
          return (
            <Card key={slot.key}>
              <CardHeader>
                <CardTitle className="text-lg text-navy dark:text-gold">
                  {slot.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current image preview */}
                <div className="h-40 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={field.image_url || slot.defaultImage}
                    alt={field.alt_text}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Image</Label>
                  <ImageUploadInput
                    value={field.image_url}
                    onChange={(url) => updateField(slot.key, 'image_url', url)}
                    maxWidth={slot.maxWidth}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block" htmlFor={`alt-${slot.key}`}>
                    Alt text (accessibility)
                  </Label>
                  <Input
                    id={`alt-${slot.key}`}
                    value={field.alt_text}
                    onChange={(e) => updateField(slot.key, 'alt_text', e.target.value)}
                    placeholder={slot.defaultAlt}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleSave(slot)}
                    disabled={isSaving}
                    className="flex-1 bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
                  >
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save</>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleReset(slot)}
                    variant="outline"
                    disabled={isSaving}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to default
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}