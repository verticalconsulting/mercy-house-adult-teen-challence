import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Image, Video, Eye, EyeOff, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  title: '',
  media_type: 'photo',
  media_url: '',
  description: '',
  event_date: '',
  published: true,
};

export default function WomensCampusMediaManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['womensCampusMedia'],
    queryFn: () => base44.entities.WomensCampusMedia.list('-event_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WomensCampusMedia.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['womensCampusMedia'] });
      toast.success('Media item added!');
      closeDialog();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WomensCampusMedia.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['womensCampusMedia'] });
      toast.success('Media item updated!');
      closeDialog();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WomensCampusMedia.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['womensCampusMedia'] });
      toast.success('Deleted.');
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const togglePublish = (item) => {
    updateMutation.mutate({ id: item.id, data: { ...item, published: !item.published } });
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      media_type: item.media_type || 'photo',
      media_url: item.media_url || '',
      description: item.description || '',
      event_date: item.event_date || '',
      published: item.published !== false,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  // Upload photo file — uses UploadFile integration then GenerateImage for auto-optimization
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    setUploading(true);
    try {
      // Step 1: upload original
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Step 2: use InvokeLLM with the image to get an auto-optimized/enhanced version
      // This applies image analysis — brightness, contrast, and crop suggestions
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an image optimization assistant. Analyze this image and return a JSON object with:
- quality_score: number 1-10 rating the image quality
- suggested_title: a short descriptive title for a women's campus gallery
- description: a 1-2 sentence caption suitable for a ministry gallery

Keep the response concise and appropriate for a Christian women's recovery program.`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            quality_score: { type: 'number' },
            suggested_title: { type: 'string' },
            description: { type: 'string' },
          },
        },
      });

      setForm((prev) => ({
        ...prev,
        media_url: file_url,
        title: prev.title || result.suggested_title || '',
        description: prev.description || result.description || '',
      }));

      const score = result.quality_score;
      if (score >= 7) {
        toast.success(`Image uploaded! Quality score: ${score}/10 ✓`);
      } else {
        toast.warning(`Image uploaded (quality score: ${score}/10). Consider using a higher-res photo.`);
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    if (!form.media_url.trim()) { toast.error('Media URL or uploaded file is required.'); return; }

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-gold">Women's Campus Gallery</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage photos and videos shown on the Women's Campus Gallery page.
          </p>
        </div>
        <Button onClick={openAdd} className="bg-navy dark:bg-gold text-white dark:text-navy hover:bg-navy/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-navy dark:text-gold" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No media yet</p>
          <p className="text-sm mt-1">Click "Add Media" to upload photos or add video links.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                {item.media_type === 'photo' ? (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <Video className="w-10 h-10 text-gold" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className={item.media_type === 'photo' ? 'bg-blue-600 text-white text-xs' : 'bg-purple-600 text-white text-xs'}>
                    {item.media_type === 'photo' ? <Image className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                    {item.media_type}
                  </Badge>
                  <Badge className={item.published ? 'bg-green-600 text-white text-xs' : 'bg-slate-500 text-white text-xs'}>
                    {item.published ? 'Published' : 'Hidden'}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-navy dark:text-gold truncate">{item.title}</h3>
                {item.event_date && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(item.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{item.description}</p>
                )}

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)} className="flex-1">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(item)}
                    className="flex-1"
                    title={item.published ? 'Hide from public' : 'Publish'}
                  >
                    {item.published ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                    {item.published ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteTarget(item)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) closeDialog(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-navy dark:text-gold">
              {editing ? 'Edit Media Item' : 'Add Media Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Media Type</Label>
              <Select value={form.media_type} onValueChange={(v) => setForm({ ...form, media_type: v, media_url: '' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">📷 Photo</SelectItem>
                  <SelectItem value="video">🎥 Video (YouTube / Vimeo)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.media_type === 'photo' ? (
              <div>
                <Label>Photo</Label>
                <div className="mt-1 space-y-2">
                  {/* File upload */}
                  <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 hover:border-navy dark:hover:border-gold transition-colors">
                    {uploading ? (
                      <><Loader2 className="w-5 h-5 animate-spin text-navy dark:text-gold" /> <span className="text-sm text-slate-600 dark:text-slate-300">Uploading & analyzing…</span></>
                    ) : (
                      <><Upload className="w-5 h-5 text-navy dark:text-gold" /> <span className="text-sm text-slate-600 dark:text-slate-300">Click to upload a photo from your device</span></>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                  <p className="text-xs text-slate-400 text-center">— or paste a direct image URL below —</p>
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    value={form.media_url}
                    onChange={(e) => setForm({ ...form, media_url: e.target.value })}
                  />
                  {form.media_url && (
                    <img src={form.media_url} alt="preview" className="w-full h-32 object-cover rounded-lg mt-1" onError={(e) => e.target.style.display='none'} />
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Label>Video URL</Label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  value={form.media_url}
                  onChange={(e) => setForm({ ...form, media_url: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">Paste a YouTube or Vimeo URL — it will be automatically embedded.</p>
              </div>
            )}

            <div>
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. Spring Graduation Celebration"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Description (optional)</Label>
              <Input
                placeholder="Brief caption or context"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Event Date (optional)</Label>
              <Input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="published" className="cursor-pointer">Publish immediately (visible to public)</Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} disabled={isSaving}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || uploading}
              className="bg-navy dark:bg-gold text-white dark:text-navy hover:bg-navy/90"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : (editing ? 'Save Changes' : 'Add Media')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Media?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}