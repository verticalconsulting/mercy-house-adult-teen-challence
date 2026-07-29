import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, Video, Upload, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const EMPTY = {
  title: '', media_type: 'photo', media_url: '', description: '',
  event_name: '', event_date: '', category: 'general', published: true
};

const categoryOptions = [
  ['general', 'General'], ['outreach', 'Outreach'], ['fundraiser', 'Fundraiser'],
  ['graduation', 'Graduation'], ['service', 'Service'], ['community_event', 'Community Event'], ['other', 'Other']
];

/**
 * Compress an image File on the client via a canvas before uploading.
 * Scales the longest edge down to maxSize and re-encodes as JPEG at the
 * given quality. Returns a File ready for UploadFile.
 */
function compressImage(file, maxSize = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'));
            const out = new File([blob], file.name.replace(/\.(png|jpg|jpeg|webp|heic)$/i, '.jpg'), { type: 'image/jpeg' });
            resolve({ file: out, originalSize: file.size, compressedSize: blob.size });
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function getEmbedThumb(url) {
  const yt = url && url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

export default function MediaResourceManager() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);
  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['mediaResources'],
    queryFn: () => base44.entities.MediaResource.list('-created_date', 200),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MediaResource.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mediaResources'] }); toast.success('Media item created!'); resetForm(); },
    onError: (err) => toast.error('Failed to create: ' + (err?.message || 'Unknown error'))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MediaResource.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mediaResources'] }); toast.success('Media item updated!'); resetForm(); },
    onError: (err) => toast.error('Failed to update: ' + (err?.message || 'Unknown error'))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MediaResource.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mediaResources'] }); toast.success('Media item deleted!'); },
    onError: (err) => toast.error('Failed to delete: ' + (err?.message || 'Unknown error'))
  });

  const resetForm = () => {
    setFormData(EMPTY);
    setShowForm(false);
    setEditing(null);
    setUploadStats(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      title: item.title || '',
      media_type: item.media_type || 'photo',
      media_url: item.media_url || '',
      description: item.description || '',
      event_name: item.event_name || '',
      event_date: item.event_date ? item.event_date.slice(0, 10) : '',
      category: item.category || 'general',
      published: item.published !== false
    });
    setShowForm(true);
    setUploadStats(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadStats(null);
    try {
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.type !== 'image/gif') {
        const result = await compressImage(file);
        fileToUpload = result.file;
        const saved = Math.max(0, 100 - Math.round((result.compressedSize / result.originalSize) * 100));
        setUploadStats({ original: result.originalSize, compressed: result.compressedSize, saved });
        toast.success(`Compressed: ${(result.originalSize / 1024).toFixed(0)}KB → ${(result.compressedSize / 1024).toFixed(0)}KB (${saved}% smaller)`);
      }
      const { file_url } = await base44.integrations.Core.UploadFile({ file: fileToUpload });
      setData('media_url')(file_url);
      setData('media_type')(file.type.startsWith('image/') ? 'photo' : 'video');
    } catch (err) {
      toast.error('Upload failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.media_url) { toast.error('Title and media URL are required.'); return; }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const setData = (key) => (val) => setFormData((d) => ({ ...d, [key]: val.target ? val.target.value : val }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-gold">Media Resources</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <Zap className="w-4 h-4 text-gold" /> Photos are automatically compressed before upload to keep the gallery fast.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
          <Plus className="w-4 h-4 mr-2" /> Add Media
        </Button>
      </div>

      {showForm && (
        <Card className="border-gold">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{editing ? 'Edit Media Item' : 'Create New Media Item'}</span>
              <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Media Type</Label>
                  <Select value={formData.media_type} onValueChange={setData('media_type')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photo"><span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Photo</span></SelectItem>
                      <SelectItem value="video"><span className="flex items-center gap-2"><Video className="w-4 h-4" /> Video</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={setData('category')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={setData('title')} required />
              </div>

              {/* Upload / URL */}
              <div className="space-y-3">
                <Label>{formData.media_type === 'photo' ? 'Upload Photo' : 'Upload Video File'}</Label>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploading ? 'Uploading…' : 'Choose File'}
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept={formData.media_type === 'photo' ? 'image/*' : 'video/*'}
                    onChange={handleFile}
                    className="hidden"
                  />
                  {uploadStats && (
                    <span className="text-xs text-green-600 font-medium">
                      {(uploadStats.original / 1024).toFixed(0)}KB → {(uploadStats.compressed / 1024).toFixed(0)}KB ({uploadStats.saved}% saved)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Or paste a URL (YouTube/Vimeo or direct link) below.</p>
                <Input
                  value={formData.media_url}
                  onChange={setData('media_url')}
                  placeholder="https://... (YouTube/Vimeo URL or direct media link)"
                />
              </div>

              {/* Preview */}
              {formData.media_url && (
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs">
                  {formData.media_type === 'photo' ? (
                    <img src={formData.media_url} alt="preview" className="w-full h-40 object-cover" />
                  ) : getEmbedThumb(formData.media_url) ? (
                    <img src={getEmbedThumb(formData.media_url)} alt="preview" className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Video className="w-8 h-8" />
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Event Name</Label>
                  <Input value={formData.event_name} onChange={setData('event_name')} />
                </div>
                <div>
                  <Label>Event Date</Label>
                  <Input type="date" value={formData.event_date} onChange={setData('event_date')} />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={setData('description')} rows={3} />
              </div>

              <div className="flex items-center gap-2">
                <Switch id="pub" checked={formData.published} onCheckedChange={(c) => setFormData((d) => ({ ...d, published: c }))} />
                <Label htmlFor="pub" className="cursor-pointer">Published (visible on public site)</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" /> {editing ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && !showForm && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-slate-500 dark:text-slate-400">
              No media items yet. Click "Add Media" to upload your first photo or video.
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Card key={item.id}>
            <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-t-lg">
              {item.media_type === 'photo' ? (
                <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
              ) : getEmbedThumb(item.media_url) ? (
                <img src={getEmbedThumb(item.media_url)} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <video src={item.media_url} className="w-full h-full object-cover" muted />
              )}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <Badge className={item.media_type === 'photo' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}>
                  {item.media_type === 'photo' ? <ImageIcon className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                  {item.media_type}
                </Badge>
                {!item.published && <Badge variant="outline" className="bg-white/90">Draft</Badge>}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-navy dark:text-gold text-sm truncate">{item.title}</h3>
                  {item.event_name && <p className="text-xs text-slate-500 truncate">{item.event_name}</p>}
                  {item.event_date && <p className="text-xs text-slate-400">{format(parseISO(item.event_date), 'MMM d, yyyy')}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700" onClick={() => { if (confirm('Delete this media item?')) deleteMutation.mutate(item.id); }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}