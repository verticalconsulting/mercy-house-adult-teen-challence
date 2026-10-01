import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Construction } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Admin toggle that controls whether the maintenance/construction banner
 * is visible on the homepage. Backed by the `maintenance_banner_enabled`
 * SiteSetting record (value stored as "true" / "false").
 */
export default function MaintenanceBannerToggle() {
  const queryClient = useQueryClient();
  const [toggling, setToggling] = useState(false);

  const { data: setting, isLoading } = useQuery({
    queryKey: ['siteSetting', 'maintenance_banner_enabled'],
    queryFn: async () => {
      const { items } = await base44.entities.SiteSetting.filter(
        { key: 'maintenance_banner_enabled' },
        { limit: 1 }
      );
      return items[0] || null;
    },
  });

  const enabled = setting?.value === 'true';

  const toggleMutation = useMutation({
    mutationFn: async (nextEnabled) => {
      const value = nextEnabled ? 'true' : 'false';
      if (setting?.id) {
        return await base44.entities.SiteSetting.update(setting.id, { value });
      }
      return await base44.entities.SiteSetting.create({
        key: 'maintenance_banner_enabled',
        value,
        label: 'Maintenance Banner',
      });
    },
    onMutate: async (nextEnabled) => {
      await queryClient.cancelQueries({ queryKey: ['siteSetting', 'maintenance_banner_enabled'] });
      const previous = queryClient.getQueryData(['siteSetting', 'maintenance_banner_enabled']);
      queryClient.setQueryData(['siteSetting', 'maintenance_banner_enabled'], (old) => ({
        ...old,
        value: nextEnabled ? 'true' : 'false',
      }));
      return { previous };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(['siteSetting', 'maintenance_banner_enabled'], context.previous);
      toast.error(`Failed to update banner: ${err.message}`);
    },
    onSuccess: (_data, nextEnabled) => {
      queryClient.invalidateQueries({ queryKey: ['siteSetting', 'maintenance_banner_enabled'] });
      toast.success(nextEnabled ? 'Maintenance banner turned on' : 'Maintenance banner turned off');
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
          <Construction className="w-5 h-5 text-gold" />
          Maintenance Banner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Show construction banner on homepage
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              When on, a flashing navy-and-gold banner appears at the top of the homepage asking
              visitors to hold off on donations.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isLoading || toggling}
            aria-label="Toggle maintenance banner"
          />
        </div>
      </CardContent>
    </Card>
  );
}