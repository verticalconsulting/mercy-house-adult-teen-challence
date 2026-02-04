import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Users, FileText, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function EmployeePortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {
        toast.error('Please log in to access the employee portal');
        base44.auth.redirectToLogin();
      })
      .finally(() => setLoading(false));
  }, []);

  const { data: applications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.Application.list('-created_date'),
    initialData: []
  });

  const { data: bedCounts } = useQuery({
    queryKey: ['bedCounts'],
    queryFn: () => base44.entities.BedCount.list(),
    initialData: []
  });

  const mensBedData = bedCounts.find(bc => bc.program_type === 'mens') || { program_type: 'mens', total_beds: 0, occupied_beds: 0, waitlist_count: 0 };
  const womensBedData = bedCounts.find(bc => bc.program_type === 'womens') || { program_type: 'womens', total_beds: 0, occupied_beds: 0, waitlist_count: 0 };

  const [mensData, setMensData] = useState(mensBedData);
  const [womensData, setWomensData] = useState(womensBedData);

  useEffect(() => {
    if (bedCounts.length > 0) {
      const mens = bedCounts.find(bc => bc.program_type === 'mens');
      const womens = bedCounts.find(bc => bc.program_type === 'womens');
      if (mens) setMensData(mens);
      if (womens) setWomensData(womens);
    }
  }, [bedCounts]);

  const updateBedMutation = useMutation({
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

  const updateAppMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Application.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setSelectedApp(null);
      toast.success('Application updated successfully');
    }
  });

  const handleSaveBeds = (programType) => {
    const data = programType === 'mens' ? mensData : womensData;
    const dataToSave = {
      ...data,
      last_updated_by: user?.email || 'Unknown'
    };
    updateBedMutation.mutate({ id: data.id, data: dataToSave });
  };

  const handleAssignToMe = (app) => {
    updateAppMutation.mutate({
      id: app.id,
      data: { ...app, assigned_to: user?.email, status: 'under_review' }
    });
  };

  const handleApprove = (app) => {
    const programType = app.application_type === 'mens_program' ? 'mens' : 'womens';
    const currentData = programType === 'mens' ? mensData : womensData;
    
    if (currentData.occupied_beds >= currentData.total_beds) {
      toast.error('No beds available. Please update bed count or add to waitlist.');
      return;
    }

    // Update application to accepted
    updateAppMutation.mutate({
      id: app.id,
      data: { ...app, status: 'accepted' }
    });

    // Increase occupied beds
    const newData = {
      ...currentData,
      occupied_beds: currentData.occupied_beds + 1,
      last_updated_by: user?.email
    };
    
    updateBedMutation.mutate({ id: currentData.id, data: newData });
    
    if (programType === 'mens') {
      setMensData(newData);
    } else {
      setWomensData(newData);
    }
  };

  const handleDecline = (app) => {
    updateAppMutation.mutate({
      id: app.id,
      data: { ...app, status: 'declined' }
    });
  };

  const handleWaitlist = (app) => {
    const programType = app.application_type === 'mens_program' ? 'mens' : 'womens';
    const currentData = programType === 'mens' ? mensData : womensData;
    
    updateAppMutation.mutate({
      id: app.id,
      data: { ...app, status: 'waitlist' }
    });

    const newData = {
      ...currentData,
      waitlist_count: (currentData.waitlist_count || 0) + 1,
      last_updated_by: user?.email
    };
    
    updateBedMutation.mutate({ id: currentData.id, data: newData });
    
    if (programType === 'mens') {
      setMensData(newData);
    } else {
      setWomensData(newData);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    waitlist: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-navy dark:text-gold mb-8">Employee Portal</h1>

        <Tabs defaultValue="applications">
          <TabsList>
            <TabsTrigger value="applications">
              <FileText className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="beds">
              <Users className="w-4 h-4 mr-2" />
              Bed Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Applications</h2>
                <div className="space-y-3">
                  {applications.map(app => (
                    <Card key={app.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedApp(app)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-navy dark:text-gold">{app.full_legal_name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{app.cell_phone}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {format(new Date(app.created_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={statusColors[app.status]}>{app.status}</Badge>
                            <p className="text-xs text-slate-500 mt-1">{app.application_type === 'mens_program' ? "Men's" : "Women's"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                {selectedApp ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy dark:text-gold">Application Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="max-h-[600px] overflow-y-auto space-y-3">
                        <div><strong>Name:</strong> {selectedApp.full_legal_name}</div>
                        <div><strong>DOB:</strong> {selectedApp.date_of_birth}</div>
                        <div><strong>Phone:</strong> {selectedApp.cell_phone}</div>
                        <div><strong>Email:</strong> {selectedApp.email}</div>
                        <div><strong>Address:</strong> {selectedApp.address}, {selectedApp.city}, {selectedApp.state} {selectedApp.zip}</div>
                        <div><strong>Emergency Contact:</strong> {selectedApp.emergency_contact_name} ({selectedApp.emergency_contact_phone})</div>
                        <div><strong>Legal Supervision:</strong> {selectedApp.under_legal_supervision ? 'Yes' : 'No'}</div>
                        <div><strong>Health Insurance:</strong> {selectedApp.has_health_insurance ? 'Yes' : 'No'}</div>
                        <div><strong>Current Medications:</strong> {selectedApp.current_medications || 'None'}</div>
                        <div><strong>Addiction Details:</strong> {selectedApp.addiction_details}</div>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div>
                          <Label>Assign To</Label>
                          <Select value={selectedApp.assigned_to || ''} onValueChange={(value) => updateAppMutation.mutate({ id: selectedApp.id, data: { ...selectedApp, assigned_to: value, status: 'under_review' } })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign reviewer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={user.email}>Me ({user.email})</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleAssignToMe(selectedApp)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                            <Eye className="w-4 h-4 mr-2" />
                            Assign to Me
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(selectedApp)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Add to Bed
                          </Button>
                          <Button onClick={() => handleWaitlist(selectedApp)} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                            Waitlist
                          </Button>
                          <Button onClick={() => handleDecline(selectedApp)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold">
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-20">
                    Select an application to view details
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="beds" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="bg-navy dark:bg-slate-950 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-gold" />
                    Men's Campus
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="mens_total">Total Beds</Label>
                    <Input id="mens_total" type="number" min="0" value={mensData.total_beds} onChange={(e) => setMensData({ ...mensData, total_beds: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label htmlFor="mens_occupied">Occupied Beds</Label>
                    <Input id="mens_occupied" type="number" min="0" max={mensData.total_beds} value={mensData.occupied_beds} onChange={(e) => setMensData({ ...mensData, occupied_beds: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label htmlFor="mens_waitlist">Waitlist Count</Label>
                    <Input id="mens_waitlist" type="number" min="0" value={mensData.waitlist_count || 0} onChange={(e) => setMensData({ ...mensData, waitlist_count: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Available: <strong className="text-green-600">{mensData.total_beds - mensData.occupied_beds}</strong> beds
                    </div>
                    <Button onClick={() => handleSaveBeds('mens')} className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                      <Save className="w-4 h-4 mr-2" />
                      Save Men's Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-navy dark:bg-slate-950 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-gold" />
                    Women's Campus
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="womens_total">Total Beds</Label>
                    <Input id="womens_total" type="number" min="0" value={womensData.total_beds} onChange={(e) => setWomensData({ ...womensData, total_beds: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label htmlFor="womens_occupied">Occupied Beds</Label>
                    <Input id="womens_occupied" type="number" min="0" max={womensData.total_beds} value={womensData.occupied_beds} onChange={(e) => setWomensData({ ...womensData, occupied_beds: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label htmlFor="womens_waitlist">Waitlist Count</Label>
                    <Input id="womens_waitlist" type="number" min="0" value={womensData.waitlist_count || 0} onChange={(e) => setWomensData({ ...womensData, waitlist_count: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Available: <strong className="text-green-600">{womensData.total_beds - womensData.occupied_beds}</strong> beds
                    </div>
                    <Button onClick={() => handleSaveBeds('womens')} className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                      <Save className="w-4 h-4 mr-2" />
                      Save Women's Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}