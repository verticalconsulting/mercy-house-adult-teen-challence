import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, Loader2, ExternalLink, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  name: '',
  logo_url: '',
  website_url: '',
  dark_background: false,
  display_order: 0,
  published: true
};

export default function GolfSponsorManager() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: sponsors } = useQuery({
    queryKey: ['golfSponsors'],
    queryFn: () => base44.entities.GolfSponsor.list('display_order'),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GolfSponsor.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['golfSponsors'] });
      toast.success('Sponsor added!');
      resetForm();
    },
    onError: (err) => toast.error('Failed to add sponsor: ' + (err?.message || 'Unknown error'))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GolfSponsor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['golfSponsors'] });
      toast.success('Sponsor updated!');
      resetForm();
    },
    onError: (err) => toast.error('Failed to update sponsor: ' + (err?.message || 'Unknown error'))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GolfSponsor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['golfSponsors'] });
      toast.success('Sponsor removed!');
    },
    onError: (err) => toast.error('Failed to remove sponsor: ' + (err?.message || 'Unknown error'))
  });

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (sponsor) => {
    setEditing(sponsor);
    setFormData({
      name: sponsor.name || '',
      logo_url: sponsor.logo_url || '',
      website_url: sponsor.website_url || '',
      dark_background: sponsor.dark_background === true,
      display_order: sponsor.display_order || 0,
      published: sponsor.published !== false
    });
    setShowForm(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData((prev) => ({ ...prev, logo_url: file_url }));
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error('Logo upload failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      display_order: Number(formData.display_order) || 0
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-gold">Freedom Classic Sponsors</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Logos shown on the Freedom Classic page. Lower sort order appears first.
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsor
        </Button>
      </div>

      {showForm && (
        <Card className="border-gold">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{editing ? 'Edit Sponsor' : 'Add New Sponsor'}</span>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Sponsor Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g., Mac Haik Ford Jackson" />
                </div>
                <div>
                  <Label htmlFor="website_url">Website (optional)</Label>
                  <Input id="website_url" value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo *</Label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      {uploading ? 'Uploading…' : 'Upload Logo'}
                    </span>
                    <input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                  </label>
                  {formData.logo_url && (
                    <img src={formData.logo_url} alt="Logo preview" className={`h-16 w-auto object-contain rounded border border-slate-200 dark:border-slate-700 p-1 ${formData.dark_background ? 'bg-slate-900' : 'bg-white'}`} />
                  )}
                </div>
                <Input
                  className="mt-2"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="…or paste a logo URL"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="display_order">Sort Order</Label>
                  <Input id="display_order" type="number" min="0" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="dark_background" checked={formData.dark_background} onCheckedChange={(checked) => setFormData({ ...formData, dark_background: checked })} />
                  <Label htmlFor="dark_background" className="cursor-pointer">Dark background tile</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="published" checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} />
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editing ? 'Update Sponsor' : 'Add Sponsor'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sponsors.length === 0 && !showForm && (
          <Card>
            <CardContent className="p-8 text-center text-slate-500 dark:text-slate-400">
              No sponsors yet. Click “Add Sponsor” to add your first logo.
            </CardContent>
          </Card>
        )}
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <GripVertical className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  <div className={`flex items-center justify-center h-16 w-24 rounded border border-slate-200 dark:border-slate-700 p-1 flex-shrink-0 ${sponsor.dark_background ? 'bg-slate-900' : 'bg-white'}`}>
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-navy dark:text-gold truncate">{sponsor.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><GripVertical className="w-3 h-3" />Order: {sponsor.display_order || 0}</span>
                      {sponsor.website_url && <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" />Link</span>}
                      {sponsor.dark_background && <Badge variant="outline">Dark tile</Badge>}
                      {!sponsor.published && <Badge variant="outline">Draft</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(sponsor)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline" size="icon"
                    onClick={() => { if (confirm(`Remove ${sponsor.name} from the sponsors page?`)) deleteMutation.mutate(sponsor.id); }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}