import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Admin toggle that controls whether the bed-availability cards appear on the
 * public Men's and Women's campus pages. Backed by the
 * `bed_count_visibility_enabled` SiteSetting (value stored as "true" / "false").
 * Defaults to visible when the setting has not been created yet.
 */
export default function BedCountVisibilityToggle() {
  const queryClient = useQueryClient();
  const [toggling, setToggling] = useState(false);

  const { data: setting, isLoading } = useQuery({
    queryKey: ['siteSetting', 'bed_count_visibility_enabled'],
    queryFn: async () => {
      const { items } = await base44.entities.SiteSetting.filter(
        { key: 'bed_count_visibility_enabled' },
        { limit: 1 }
      );
      return items[0] || null;
    },
  });

  // Default to visible until an admin explicitly hides it.
  const enabled = setting ? setting.value !== 'false' : true;

  const toggleMutation = useMutation({
    mutationFn: async (nextEnabled) => {
      const value = nextEnabled ? 'true' : 'false';
      if (setting?.id) {
        return await base44.entities.SiteSetting.update(setting.id, { value });
      }
      return await base44.entities.SiteSetting.create({
        key: 'bed_count_visibility_enabled',
        value,
        label: 'Bed Count Visibility',
      });
    },
    onMutate: async (nextEnabled) => {
      await queryClient.cancelQueries({ queryKey: ['siteSetting', 'bed_count_visibility_enabled'] });
      const previous = queryClient.getQueryData(['siteSetting', 'bed_count_visibility_enabled']);
      queryClient.setQueryData(['siteSetting', 'bed_count_visibility_enabled'], (old) => ({
        ...old,
        value: nextEnabled ? 'true' : 'false',
      }));
      return { previous };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(['siteSetting', 'bed_count_visibility_enabled'], context.previous);
      toast.error(`Failed to update bed count visibility: ${err.message}`);
    },
    onSuccess: (_data, nextEnabled) => {
      queryClient.invalidateQueries({ queryKey: ['siteSetting', 'bed_count_visibility_enabled'] });
      toast.success(nextEnabled ? 'Bed availability is now visible' : 'Bed availability is now hidden');
    },
  });

  const handleToggle = (nextEnabled) => {
    setToggling(true);
    toggleMutation.mutate(nextEnabled, {
      onSettled: () => setToggling(false),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-navy dark:text-gold flex items-center gap-2">
          {enabled ? <Eye className="w-5 h-5 text-gold" /> : <EyeOff className="w-5 h-5 text-gold" />}
          Bed Count Visibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Show bed availability on campus pages
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              When on, the Men's and Women's campus pages display current residents, open beds, and the
              waiting list. Turn off to hide availability from the public.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isLoading || toggling}
            aria-label="Toggle bed count visibility"
          />
        </div>
      </CardContent>
    </Card>
  );
}