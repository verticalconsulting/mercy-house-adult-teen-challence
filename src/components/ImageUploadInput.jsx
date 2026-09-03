import React, { useState, useRef, useId } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';

/**
 * Image upload field with automatic client-side compression.
 *
 * ImageMagick (the image-manipulation-image-magick skill) is a server-side CLI
 * and cannot run inside the deployed web app or Base44's Deno backend. This
 * component replicates its core behaviour — resize to a max width and compress
 * to JPEG — entirely in the browser via the Canvas API, before uploading the
 * optimised file. That keeps uploads small, fast, and correctly sized for the
 * placement (hero / card / OG preview) without a server round-trip.
 *
 * A URL input is kept alongside the upload button so existing paste-a-URL
 * workflows still work.
 */
async function compressImage(file, maxWidth = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Could not compress image'))),
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadInput({ value, onChange, maxWidth = 1600, className }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const inputId = useId();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const blob = await compressImage(file, maxWidth, 0.82);
      const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
      const result = await base44.integrations.Core.UploadFile({ file: compressedFile });
      onChange(result.file_url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}
        </div>
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            id={inputId}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Compressing…</>
            ) : (
              <><Upload className="w-4 h-4 mr-2" /> Upload &amp; compress</>
            )}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          )}
        </div>
      </div>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL…"
        className="mt-2"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <p className="text-xs text-slate-400 mt-1">
        Images are automatically resized to {maxWidth}px wide and compressed to JPEG for fast loading.
      </p>
    </div>
  );
}