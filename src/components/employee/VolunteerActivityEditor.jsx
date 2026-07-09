import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ACTIVITY_GROUPS = [
  {
    label: 'Education & Mentoring',
    activities: [
      { value: 'mentoring', label: 'Mentoring & Support' },
      { value: 'teaching', label: 'Teaching & Education' },
      { value: 'chapel_teaching', label: 'Chapel Teaching' },
      { value: 'ged_prep', label: 'GED Prep' }
    ]
  },
  {
    label: 'Facilities & Operations',
    activities: [
      { value: 'administrative', label: 'Administrative' },
      { value: 'maintenance', label: 'Maintenance & Repairs' },
      { value: 'events', label: 'Event Planning' },
      { value: 'transportation', label: 'Transportation' }
    ]
  },
  {
    label: 'Micro-Businesses',
    activities: [
      { value: 'thrift_store', label: 'Thrift Store' },
      { value: 'superthrift', label: 'SuperTHRIFT' },
      { value: 'auto_academy', label: 'Auto Academy' },
      { value: 'workforce_development', label: 'Workforce Development' }
    ]
  },
  {
    label: 'Kitchen & Care',
    activities: [
      { value: 'kitchen', label: 'Kitchen & Meal Prep' },
      { value: 'childcare', label: 'Childcare' }
    ]
  },
  {
    label: 'Outdoor & Agriculture',
    activities: [
      { value: 'landscaping', label: 'Landscaping' },
      { value: 'gardening', label: 'Gardening' },
      { value: 'bee_keeping', label: 'Bee Keeping' },
      { value: 'chickens', label: 'Chickens' }
    ]
  }
];

export const ALL_ACTIVITY_LABELS = Object.fromEntries(
  ACTIVITY_GROUPS.flatMap(g => g.activities.map(a => [a.value, a.label]))
);

export function formatActivity(value) {
  return ALL_ACTIVITY_LABELS[value] || value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function VolunteerActivityEditor({ volunteer }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(volunteer.areas_of_interest || []);

  useEffect(() => {
    setSelected(volunteer.areas_of_interest || []);
  }, [volunteer.id, volunteer.areas_of_interest]);

  const saveMutation = useMutation({
    mutationFn: (areas) => base44.entities.Volunteer.update(volunteer.id, { areas_of_interest: areas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success('Activities updated');
    },
    onError: (e) => toast.error(e?.response?.data?.detail || e?.message || 'Failed to update activities')
  });

  const toggle = (value) => {
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const hasChanges = JSON.stringify([...selected].sort()) !== JSON.stringify([...(volunteer.areas_of_interest || [])].sort());

  return (
    <div>
      <h3 className="text-2xl font-bold text-navy dark:text-gold mb-1">Activities & Interests</h3>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
        Select the activities this volunteer is involved in. Changes are saved to their record.
      </p>
      <div className="space-y-5">
        {ACTIVITY_GROUPS.map((group) => (
          <div key={group.label} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <p className="text-lg font-semibold text-navy dark:text-gold mb-3">{group.label}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {group.activities.map((activity) => (
                <div key={activity.value} className="flex items-center gap-3">
                  <Checkbox
                    id={`act-${activity.value}`}
                    checked={selected.includes(activity.value)}
                    onCheckedChange={() => toggle(activity.value)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor={`act-${activity.value}`} className="text-lg text-slate-700 dark:text-slate-200 cursor-pointer">
                    {activity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={() => saveMutation.mutate(selected)}
        disabled={!hasChanges || saveMutation.isPending}
        className="mt-5 w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy text-lg py-4"
      >
        {saveMutation.isPending ? 'Saving...' : 'Save Activities'}
      </Button>
    </div>
  );
}