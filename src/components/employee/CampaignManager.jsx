import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, Save, X, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function CampaignManager() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal_amount: '',
    current_amount: 0,
    image_url: '',
    end_date: '',
    active: true,
    featured: false
  });

  const queryClient = useQueryClient();

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Campaign.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created!');
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Campaign.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign updated!');
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Campaign.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      goal_amount: '',
      current_amount: 0,
      image_url: '',
      end_date: '',
      active: true,
      featured: false
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      goal_amount: parseFloat(formData.goal_amount),
      current_amount: parseFloat(formData.current_amount) || 0
    };

    if (editing) {
      updateMutation.mutate({ id: editing, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (campaign) => {
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      goal_amount: campaign.goal_amount.toString(),
      current_amount: campaign.current_amount || 0,
      image_url: campaign.image_url || '',
      end_date: campaign.end_date || '',
      active: campaign.active,
      featured: campaign.featured || false
    });
    setEditing(campaign.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-gold">Fundraising Campaigns</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage campaign goals and track progress</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{editing ? 'Edit Campaign' : 'Create Campaign'}</span>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="New Building Fund"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Help us build a new facility..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Goal Amount ($)</Label>
                  <Input
                    type="number"
                    required
                    min="100"
                    value={formData.goal_amount}
                    onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label>Current Amount ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <Label>End Date (optional)</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Featured on Homepage</Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {editing ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      {campaigns.length === 0 && (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No campaigns yet</p>
          <p className="text-sm">Create your first fundraising campaign above.</p>
        </div>
      )}
      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const percentage = Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100);
          return (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy dark:text-gold flex items-center gap-2">
                      {campaign.name}
                      {campaign.featured && (
                        <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">Featured</span>
                      )}
                      {!campaign.active && (
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Inactive</span>
                      )}
                    </h3>
                    {campaign.description && (
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(campaign)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Delete this campaign?')) {
                          deleteMutation.mutate(campaign.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      ${campaign.current_amount?.toLocaleString() || 0} raised
                    </span>
                    <span className="font-bold text-navy dark:text-gold">
                      ${campaign.goal_amount?.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-navy to-gold h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {percentage.toFixed(1)}% of goal • {campaign.end_date ? `Ends ${new Date(campaign.end_date).toLocaleDateString()}` : 'No end date'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}