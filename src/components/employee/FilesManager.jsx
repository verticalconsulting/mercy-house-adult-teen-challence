import React, { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';

const MAX_BYTES = 8 * 1024 * 1024;

function readBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(new Error('That file could not be read.'));
    reader.readAsDataURL(file);
  });
}

export default function FilesManager({ onUploaded }) {
  const formRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!file) {
      setError('Choose a file to upload.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Files must be 8 MB or smaller.');
      return;
    }

    setBusy(true);
    try {
      const data_base64 = await readBase64(file);
      const response = await base44.functions.invoke('uploadFileResource', {
        file_name: file.name,
        content_type: file.type || 'application/octet-stream',
        data_base64,
      });
      const { url, error: uploadError } = response.data || {};
      if (!url) throw new Error(uploadError || 'The upload did not finish.');

      await base44.entities.DocumentResource.create({
        title: title.trim() || file.name,
        description: description.trim() || undefined,
        file_url: url,
        published: true,
      });

      setSuccess('Uploaded and published on the Files page.');
      setFile(null);
      setTitle('');
      setDescription('');
      formRef.current?.reset();
      onUploaded?.();
    } catch (err) {
      setError(err.message || 'The upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mh-card p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-navy dark:text-white">Upload a document</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Files are stored on our own file server and appear publicly on this page.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-upload">File (PDF or document, up to 8 MB)</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          disabled={busy}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-title">Title</Label>
        <Input
          id="file-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Defaults to the file name"
          disabled={busy}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-description">Short description (optional)</Label>
        <Input
          id="file-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={busy}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm font-medium text-navy dark:text-gold">
          {success}
        </p>
      )}

      <Button type="submit" disabled={busy} className="bg-navy text-white hover:bg-navy-900">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {busy ? 'Uploading…' : 'Upload document'}
      </Button>
    </form>
  );
}