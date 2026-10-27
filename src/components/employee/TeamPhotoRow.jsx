import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { User, Upload, Loader2, Trash2 } from 'lucide-react';

export default function TeamPhotoRow({ member, photoUrl, busy, onUpload, onRemove }) {
  const inputRef = useRef(null);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
      <div className="w-20 shrink-0 overflow-hidden rounded-md bg-navy-50 dark:bg-slate-700 aspect-[4/5]">
        {photoUrl ? (
          <img src={photoUrl} alt={`${member.name} photo`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-300">
            <User className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-navy dark:text-gold truncate">{member.name}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{member.title}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" /> {photoUrl ? 'Replace' : 'Upload'}</>
          )}
        </Button>
        {photoUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={onRemove}
            aria-label={`Remove ${member.name}'s photo`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}