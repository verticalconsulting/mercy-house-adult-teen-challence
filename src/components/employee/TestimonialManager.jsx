import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { testimonySlug } from '@/lib/testimony';
import { Label } from '@/components/ui/label';
import { Plus, Sparkles, Loader2, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function TestimonialManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    graduate_name: '',
    photo_url: '',
    testimonial_text: '',
    program_type: 'mens',
    graduation_year: new Date().getFullYear(),
    featured: false,
    published: true,
    description: '',
    slug: '',
    consent_confirmed: false,
    consent_date: '',
    consent_notes: ''
  });
  const [keywords, setKeywords] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-created_date'),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Testimonial.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
      toast.success('Testimonial created successfully');
    },
    onError: (err) => toast.error('Failed to create: ' + (err?.message || 'Unknown error')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Testimonial.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
      toast.success('Testimonial updated successfully');
    },
    onError: (err) => toast.error('Failed to update: ' + (err?.message || 'Unknown error')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: (err) => toast.error('Failed to delete: ' + (err?.message || 'Unknown error')),
  });

  const resetForm = () => {
    setFormData({
      graduate_name: '',
      photo_url: '',
      testimonial_text: '',
      program_type: 'mens',
      graduation_year: new Date().getFullYear(),
      featured: false,
      published: true,
      description: '',
      slug: '',
      consent_confirmed: false,
      consent_date: '',
      consent_notes: ''
    });
    setKeywords('');
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const handleGenerateAI = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter some keywords');
      return;
    }

    setGeneratingAI(true);
    try {
      const response = await base44.functions.invoke('generateTestimonial', { keywords });
      setFormData({ ...formData, testimonial_text: response.data.testimonial });
      toast.success('Testimonial generated!');
    } catch (error) {
      toast.error('Failed to generate testimonial');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      graduate_name: testimonial.graduate_name,
      photo_url: testimonial.photo_url || '',
      testimonial_text: testimonial.testimonial_text,
      program_type: testimonial.program_type,
      graduation_year: testimonial.graduation_year || new Date().getFullYear(),
      featured: testimonial.featured || false,
      published: testimonial.published !== false,
      description: testimonial.description || '',
      slug: testimonial.slug || '',
      consent_confirmed: testimonial.consent_confirmed || false,
      consent_date: testimonial.consent_date || '',
      consent_notes: testimonial.consent_notes || ''
    });
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy dark:text-gold">Testimonials</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTestimonial ? 'Edit' : 'New'} Testimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Graduate Name *</Label>
                  <Input
                    value={formData.graduate_name}
                    onChange={(e) => setFormData({ ...formData, graduate_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Photo URL</Label>
                  <Input
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Program Type *</Label>
                  <Select
                    value={formData.program_type}
                    onValueChange={(value) => setFormData({ ...formData, program_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mens">Men's Campus</SelectItem>
                      <SelectItem value="womens">Women's Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Graduation Year</Label>
                  <Input
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>AI Generate from Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., addiction recovery, family restored, new career"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {generatingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Testimonial Text *</Label>
                <Textarea
                  value={formData.testimonial_text}
                  onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label>Additional Context (optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Background shown beneath the quote on the story page."
                />
              </div>

              {/* Story page: slug + consent.
                  TestimonyPage filters on consent_confirmed, so a story only
                  appears at its own URL once this is ticked — and unticking it
                  takes the page down and marks the URL noindex. */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                <p className="text-sm font-semibold text-navy dark:text-gold">
                  Story page at /testimonies/&hellip;
                </p>

                <div>
                  <Label>URL Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: testimonySlug(e.target.value) })}
                    placeholder="van-pope"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Leave blank for no dedicated page.
                    {formData.graduate_name && !formData.slug && (
                      <button
                        type="button"
                        className="ml-2 underline"
                        onClick={() =>
                          setFormData({ ...formData, slug: testimonySlug(formData.graduate_name) })
                        }
                      >
                        Use &ldquo;{testimonySlug(formData.graduate_name)}&rdquo;
                      </button>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.consent_confirmed}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        consent_confirmed: checked,
                        consent_date:
                          checked && !formData.consent_date
                            ? new Date().toISOString().slice(0, 10)
                            : formData.consent_date,
                      })
                    }
                  />
                  <Label>Written consent obtained to publish name, photo and story</Label>
                </div>

                <div>
                  <Label>Consent Date</Label>
                  <Input
                    type="date"
                    value={formData.consent_date}
                    onChange={(e) => setFormData({ ...formData, consent_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Consent Notes</Label>
                  <Textarea
                    value={formData.consent_notes}
                    onChange={(e) => setFormData({ ...formData, consent_notes: e.target.value })}
                    rows={2}
                    placeholder="How consent was obtained and where the signed record is filed."
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Featured on Homepage</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label>Published</Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {testimonial.photo_url && (
                  <img
                    src={testimonial.photo_url}
                    alt={testimonial.graduate_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-navy dark:text-gold">
                      {testimonial.graduate_name}
                    </h3>
                    {testimonial.featured && <Star className="w-4 h-4 text-gold fill-gold" />}
                    {!testimonial.published && (
                      <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                        Unpublished
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {testimonial.program_type === 'mens' ? "Men's" : "Women's"} Campus • Class of {testimonial.graduation_year}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    {testimonial.testimonial_text}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(testimonial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}