import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Save, Users, FileText, Eye, CheckCircle, XCircle, Settings, Bot, Trash2,
  AlertTriangle, RefreshCw, LogOut, ShieldCheck, Clock, ClipboardList,
  BedDouble, Heart, Quote, Calendar, Sparkles, Megaphone, Plug, Filter,
  Search, Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ApplicationViewer from '../components/employee/ApplicationViewer';
import IntegrationsManager from '../components/employee/IntegrationsManager';
import AgentManager from '../components/employee/AgentManager';
import TestimonialManager from '../components/employee/TestimonialManager';
import VolunteerManager from '../components/employee/VolunteerManager';
import BlogManager from '../components/employee/BlogManager';
import CampaignManager from '../components/employee/CampaignManager';
import EventManager from '../components/employee/EventManager';
import DonationFunnel from './DonationFunnel';
import WomensCampusMediaManager from '../components/employee/WomensCampusMediaManager';
import SearchPerformance from './SearchPerformance';

const TAB_ITEMS = [
  { value: 'applications', label: 'Applications', icon: FileText },
  { value: 'beds', label: 'Beds', icon: BedDouble },
  { value: 'volunteers', label: 'Volunteers', icon: Heart },
  { value: 'testimonials', label: 'Testimonials', icon: Quote },
  { value: 'events', label: 'Events', icon: Calendar },
  { value: 'blog', label: 'Blog AI', icon: Sparkles },
  { value: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { value: 'integrations', label: 'Integrations', icon: Plug },
  { value: 'agent', label: 'AI Agent', icon: Bot },
  { value: 'funnel', label: 'Donation Funnel', icon: Filter },
  { value: 'search', label: 'Search Performance', icon: Search },
  { value: 'womensgallery', label: "Women's Gallery", icon: ImageIcon },
  { value: 'settings', label: 'Settings', icon: Settings },
];

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold leading-none text-navy dark:text-gold">{value}</div>
          <div className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeePortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const pullStartY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          base44.auth.redirectToLogin();
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Auth error:', error);
        base44.auth.redirectToLogin();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        pullStartY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (isPulling.current && window.scrollY === 0) {
        const pullDistance = e.touches[0].clientY - pullStartY.current;
        if (pullDistance > 80) {
          isPulling.current = false;
          handleRefresh();
        }
      }
    };

    const handleTouchEnd = () => {
      isPulling.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['applications'] }),
      queryClient.invalidateQueries({ queryKey: ['bedCounts'] })
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['bedCounts'] });
      const previousBedCounts = queryClient.getQueryData(['bedCounts']);
      
      queryClient.setQueryData(['bedCounts'], (old) => 
        old?.map((bed) => bed.id === id ? { ...bed, ...data } : bed)
      );
      
      return { previousBedCounts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['bedCounts'], context.previousBedCounts);
      toast.error(`Failed to update bed count: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bedCounts'] });
      toast.success('Bed count updated successfully');
    }
  });

  const updateAppMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Application.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      const previousApplications = queryClient.getQueryData(['applications']);
      
      queryClient.setQueryData(['applications'], (old) => 
        old?.map((app) => app.id === id ? { ...app, ...data } : app)
      );
      
      return { previousApplications };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['applications'], context.previousApplications);
      toast.error(`Failed to update application: ${error.message}`);
    },
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

  const handleApprove = async (app) => {
    // Guard: an already-accepted applicant has already claimed a bed.
    if (app.status === 'accepted') {
      toast.error('This application is already accepted.');
      return;
    }

    const programType = app.application_type === 'mens_program' ? 'mens' : 'womens';
    const currentData = programType === 'mens' ? mensData : womensData;

    if (currentData.occupied_beds >= currentData.total_beds) {
      toast.error('No beds available. Please update bed count or add to waitlist.');
      return;
    }

    // Step 1: accept the application. Only touch bed counts if this succeeds,
    // so a failed/rolled-back update never leaves the bed counter ahead.
    try {
      await updateAppMutation.mutateAsync({
        id: app.id,
        data: { ...app, status: 'accepted' }
      });
    } catch {
      // updateAppMutation.onError already rolled back the cache and notified.
      return;
    }

    // Step 2: claim a bed now that the applicant is accepted.
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

  const handleWaitlist = async (app) => {
    // Guard: an applicant already on the waitlist has already been counted.
    if (app.status === 'waitlist') {
      toast.error('This application is already on the waitlist.');
      return;
    }

    const programType = app.application_type === 'mens_program' ? 'mens' : 'womens';
    const currentData = programType === 'mens' ? mensData : womensData;

    // Step 1: move the application to waitlist; only bump the counter on success.
    try {
      await updateAppMutation.mutateAsync({
        id: app.id,
        data: { ...app, status: 'waitlist' }
      });
    } catch {
      // updateAppMutation.onError already rolled back the cache and notified.
      return;
    }

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

  const handleSignOut = () => {
    try {
      base44.auth.logout(window.location.href);
    } catch {
      base44.auth.logout();
    }
  };

  // At-a-glance metrics derived from already-loaded data
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const underReviewCount = applications.filter((a) => a.status === 'under_review').length;
  const mensAvailable = (mensData.total_beds || 0) - (mensData.occupied_beds || 0);
  const womensAvailable = (womensData.total_beds || 0) - (womensData.occupied_beds || 0);
  const waitlistTotal = (mensData.waitlist_count || 0) + (womensData.waitlist_count || 0);

  // Disable application actions while a status/bed write is in flight (prevents
  // a double-click from double-counting beds or waitlist entries).
  const actionsBusy = updateAppMutation.isPending || updateBedMutation.isPending;

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await base44.entities.User.delete(user.id);
      toast.success('Account deleted successfully');
      base44.auth.logout();
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account. Please try again.');
      setDeleteLoading(false);
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

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">Admin Access Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Your account (<strong>{user.email}</strong>) has role: <strong>{user.role}</strong>. You need <strong>admin</strong> role to access this portal.
          </p>
          <p className="text-sm text-slate-500">Contact your system administrator to have your role updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-navy dark:bg-gold text-white dark:text-navy px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Refreshing...</span>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portal header */}
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy dark:bg-gold">
                <ShieldCheck className="h-6 w-6 text-gold dark:text-navy" />
              </div>
              <div>
                <h1 className="text-2xl font-bold leading-tight text-navy dark:text-gold">Employee Portal</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Mercy House operations dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {user.full_name || user.email}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs capitalize text-slate-500 dark:text-slate-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  {user.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* At-a-glance metrics */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard icon={Clock} label="Pending" value={pendingCount} accent="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" />
          <StatCard icon={Eye} label="In Review" value={underReviewCount} accent="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" />
          <StatCard icon={BedDouble} label="Men's Beds Open" value={mensAvailable} accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" />
          <StatCard icon={BedDouble} label="Women's Beds Open" value={womensAvailable} accent="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" />
          <StatCard icon={ClipboardList} label="Waitlist" value={waitlistTotal} accent="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" />
        </div>

        <Tabs defaultValue="applications">
          <TabsList className="mb-2 flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-navy data-[state=active]:border-navy data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-gold dark:data-[state=active]:border-gold dark:data-[state=active]:bg-gold dark:data-[state=active]:text-navy"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">
                  Applications
                  <span className="ml-2 text-base font-medium text-slate-400 dark:text-slate-500">
                    {applications.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {applications.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No applications yet</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          New intake applications will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    applications.map(app => {
                      const isSelected = selectedApp?.id === app.id;
                      return (
                        <Card
                          key={app.id}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedApp(app)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedApp(app);
                            }
                          }}
                          className={`cursor-pointer transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-navy dark:focus-visible:ring-gold ${
                            isSelected ? 'ring-2 ring-navy dark:ring-gold' : ''
                          }`}
                        >
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
                                <Badge className={statusColors[app.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}>
                                  {app.status || 'unknown'}
                                </Badge>
                                <p className="text-xs text-slate-500 mt-1">{app.application_type === 'mens_program' ? "Men's" : "Women's"}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                {selectedApp ? (
                  <div className="space-y-4">
                    <ApplicationViewer application={selectedApp} onClose={() => setSelectedApp(null)} />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-navy dark:text-gold">Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                          <Button onClick={() => handleAssignToMe(selectedApp)} disabled={actionsBusy} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60">
                            <Eye className="w-4 h-4 mr-2" />
                            Assign to Me
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(selectedApp)} disabled={actionsBusy} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Add to Bed
                          </Button>
                          <Button onClick={() => handleWaitlist(selectedApp)} disabled={actionsBusy} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold disabled:opacity-60">
                            Waitlist
                          </Button>
                          <Button onClick={() => handleDecline(selectedApp)} disabled={actionsBusy} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60">
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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

          <TabsContent value="volunteers" className="mt-6">
            <VolunteerManager />
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <TestimonialManager />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventManager />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogManager />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <IntegrationsManager />
          </TabsContent>

          <TabsContent value="agent" className="mt-6">
            <AgentManager />
          </TabsContent>

          <TabsContent value="funnel" className="mt-6">
            <DonationFunnel />
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <SearchPerformance />
          </TabsContent>

          <TabsContent value="womensgallery" className="mt-6">
            <WomensCampusMediaManager />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Account Information
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>Name:</strong> {user?.full_name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Danger Zone
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete My Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}