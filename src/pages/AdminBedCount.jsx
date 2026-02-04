import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBedCount() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: bedCounts } = useQuery({
    queryKey: ['bedCounts'],
    queryFn: () => base44.entities.BedCount.list(),
    initialData: []
  });

  const mensBedData = bedCounts.find(bc => bc.program_type === 'mens') || { program_type: 'mens', total_beds: 0, occupied_beds: 0, waitlist_count: 0 };
  const womensBedData = bedCounts.find(bc => bc.program_type === 'womens') || { program_type: 'womens', total_beds: 0, occupied_beds: 0, waitlist_count: 0 };

  const [mensData, setMensData] = useState(mensBedData);
  const [womensData, setWomensData] = useState(womensBedData);

  React.useEffect(() => {
    if (bedCounts.length > 0) {
      const mens = bedCounts.find(bc => bc.program_type === 'mens');
      const womens = bedCounts.find(bc => bc.program_type === 'womens');
      if (mens) setMensData(mens);
      if (womens) setWomensData(womens);
    }
  }, [bedCounts]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      if (id) {
        return await base44.entities.BedCount.update(id, data);
      } else {
        return await base44.entities.BedCount.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bedCounts'] });
      toast.success('Bed count updated successfully');
    }
  });

  const handleSave = (programType) => {
    const data = programType === 'mens' ? mensData : womensData;
    const dataToSave = {
      ...data,
      last_updated_by: user?.email || 'Unknown'
    };
    updateMutation.mutate({ id: data.id, data: dataToSave });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy dark:text-gold mb-2">
            Bed Count Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Update current bed availability for both campuses
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Men's Campus */}
          <Card>
            <CardHeader className="bg-navy dark:bg-slate-950 text-white">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-gold" />
                <CardTitle>Men's Campus</CardTitle>
              </div>
              <CardDescription className="text-slate-300">
                Update bed availability and waitlist
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="mens_total">Total Beds</Label>
                <Input
                  id="mens_total"
                  type="number"
                  min="0"
                  value={mensData.total_beds}
                  onChange={(e) => setMensData({ ...mensData, total_beds: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="mens_occupied">Occupied Beds</Label>
                <Input
                  id="mens_occupied"
                  type="number"
                  min="0"
                  max={mensData.total_beds}
                  value={mensData.occupied_beds}
                  onChange={(e) => setMensData({ ...mensData, occupied_beds: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="mens_waitlist">Waitlist Count</Label>
                <Input
                  id="mens_waitlist"
                  type="number"
                  min="0"
                  value={mensData.waitlist_count || 0}
                  onChange={(e) => setMensData({ ...mensData, waitlist_count: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="pt-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Available: <strong className="text-green-600">{mensData.total_beds - mensData.occupied_beds}</strong> beds
                </div>
                <Button
                  onClick={() => handleSave('mens')}
                  className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
                  disabled={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Men's Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Women's Campus */}
          <Card>
            <CardHeader className="bg-navy dark:bg-slate-950 text-white">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-gold" />
                <CardTitle>Women's Campus</CardTitle>
              </div>
              <CardDescription className="text-slate-300">
                Update bed availability and waitlist
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="womens_total">Total Beds</Label>
                <Input
                  id="womens_total"
                  type="number"
                  min="0"
                  value={womensData.total_beds}
                  onChange={(e) => setWomensData({ ...womensData, total_beds: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="womens_occupied">Occupied Beds</Label>
                <Input
                  id="womens_occupied"
                  type="number"
                  min="0"
                  max={womensData.total_beds}
                  value={womensData.occupied_beds}
                  onChange={(e) => setWomensData({ ...womensData, occupied_beds: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="womens_waitlist">Waitlist Count</Label>
                <Input
                  id="womens_waitlist"
                  type="number"
                  min="0"
                  value={womensData.waitlist_count || 0}
                  onChange={(e) => setWomensData({ ...womensData, waitlist_count: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="pt-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Available: <strong className="text-green-600">{womensData.total_beds - womensData.occupied_beds}</strong> beds
                </div>
                <Button
                  onClick={() => handleSave('womens')}
                  className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
                  disabled={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Women's Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}