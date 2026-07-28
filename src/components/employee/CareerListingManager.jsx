import React, { useState } from 'react';
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
import { Plus, Pencil, Trash2, Save, X, Briefcase, MapPin, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const EMPTY_FORM = {
  title: '',
  department: '',
  location: '',
  job_type: 'full_time',
  description: '',
  requirements: '',
  salary_range: '',
  application_email: '',
  application_link: '',
  posting_date: '',
  status: 'open',
  published: true
};

const jobTypeLabels = {
  full_time: 'Full-Time',
  part_time: 'Part-Time',
  contract: 'Contract',
  internship: 'Internship'
};

const jobTypeColors = {
  full_time: 'bg-green-100 text-green-800',
  part_time: 'bg-blue-100 text-blue-800',
  contract: 'bg-purple-100 text-purple-800',
  internship: 'bg-orange-100 text-orange-800'
};

export default function CareerListingManager() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const queryClient = useQueryClient();

  const { data: listings } = useQuery({
    queryKey: ['careerListings'],
    queryFn: () => base44.entities.CareerListing.list('-created_date'),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CareerListing.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerListings'] });
      toast.success('Career listing created!');
      resetForm();
    },
    onError: (err) => toast.error('Failed to create listing: ' + (err?.message || 'Unknown error'))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CareerListing.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerListings'] });
      toast.success('Career listing updated!');
      resetForm();
    },
    onError: (err) => toast.error('Failed to update listing: ' + (err?.message || 'Unknown error'))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CareerListing.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerListings'] });
      toast.success('Career listing deleted!');
    },
    onError: (err) => toast.error('Failed to delete listing: ' + (err?.message || 'Unknown error'))
  });

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (listing) => {
    setEditing(listing);
    setFormData({
      title: listing.title || '',
      department: listing.department || '',
      location: listing.location || '',
      job_type: listing.job_type || 'full_time',
      description: listing.description || '',
      requirements: listing.requirements || '',
      salary_range: listing.salary_range || '',
      application_email: listing.application_email || '',
      application_link: listing.application_link || '',
      posting_date: listing.posting_date ? listing.posting_date.slice(0, 10) : '',
      status: listing.status || 'open',
      published: listing.published !== false
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy dark:text-gold">Career Listings</h2>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {showForm && (
        <Card className="border-gold">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{editing ? 'Edit Career Listing' : 'Create New Career Listing'}</span>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., Men's Campus, Administration" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="job_type">Employment Type *</Label>
                  <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-Time</SelectItem>
                      <SelectItem value="part_time">Part-Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Georgetown, MS" />
                </div>
                <div>
                  <Label htmlFor="posting_date">Posting Date</Label>
                  <Input id="posting_date" type="date" value={formData.posting_date} onChange={(e) => setFormData({ ...formData, posting_date: e.target.value })} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Role Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} placeholder="Overview of the role and responsibilities" />
              </div>

              <div>
                <Label htmlFor="requirements">Qualifications & Requirements</Label>
                <Textarea id="requirements" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={4} placeholder="What skills, experience, or credentials are required?" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salary_range">Salary Range (optional)</Label>
                  <Input id="salary_range" value={formData.salary_range} onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })} placeholder="e.g., $35,000–$45,000" />
                </div>
                <div>
                  <Label htmlFor="application_email">Application Email</Label>
                  <Input id="application_email" type="email" value={formData.application_email} onChange={(e) => setFormData({ ...formData, application_email: e.target.value })} placeholder="careers@mercyhouseatc.com" />
                </div>
                <div>
                  <Label htmlFor="application_link">Application Link (optional)</Label>
                  <Input id="application_link" value={formData.application_link} onChange={(e) => setFormData({ ...formData, application_link: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="status_open" checked={formData.status === 'open'} onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'open' : 'closed' })} />
                  <Label htmlFor="status_open" className="cursor-pointer">Accepting Applications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="published" checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} />
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editing ? 'Update Listing' : 'Create Listing'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {listings.length === 0 && !showForm && (
          <Card>
            <CardContent className="p-8 text-center text-slate-500 dark:text-slate-400">
              No career listings yet. Click "Add Listing" to create your first one.
            </CardContent>
          </Card>
        )}
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-navy dark:text-gold text-lg">{listing.title}</h3>
                    <Badge className={jobTypeColors[listing.job_type]}>{jobTypeLabels[listing.job_type]}</Badge>
                    {listing.status === 'closed' && <Badge variant="outline">Closed</Badge>}
                    {!listing.published && <Badge variant="outline">Draft</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {listing.department && <span><Briefcase className="w-4 h-4 inline mr-1" />{listing.department}</span>}
                    {listing.location && <span><MapPin className="w-4 h-4 inline mr-1" />{listing.location}</span>}
                    {listing.posting_date && <span>Posted {format(parseISO(listing.posting_date), 'MMM d, yyyy')}</span>}
                  </div>
                  {listing.application_email && <p className="text-sm text-slate-500 mt-2"><Mail className="w-4 h-4 inline mr-1" />{listing.application_email}</p>}
                  {listing.application_link && <p className="text-sm text-slate-500 mt-1"><ExternalLink className="w-4 h-4 inline mr-1" />{listing.application_link}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(listing)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline" size="icon"
                    onClick={() => { if (confirm('Delete this career listing?')) deleteMutation.mutate(listing.id); }}
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