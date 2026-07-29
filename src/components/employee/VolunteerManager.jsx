import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, Mail, Phone, Calendar, MapPin, CheckCircle, XCircle, Clock, UserCheck, BellRing, CalendarPlus, MessageSquare, RefreshCw, Loader2 } from 'lucide-react';
import VolunteerShiftManager from './VolunteerShiftManager';
import VolunteerActivityEditor, { formatActivity } from './VolunteerActivityEditor';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function VolunteerManager() {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const queryClient = useQueryClient();

  // Bulk action dialog state
  const [assignOpen, setAssignOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [bulkEventId, setBulkEventId] = useState('');
  const [bulkRole, setBulkRole] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => base44.entities.Volunteer.list('-created_date')
  });

  // Upcoming events (Google Calendar via the women's center calendar function).
  const { data: events = [] } = useQuery({
    queryKey: ['google-events-for-bulk-shift'],
    queryFn: async () => {
      const now = new Date();
      const max = new Date(now.getFullYear(), now.getMonth() + 6, 1);
      const res = await base44.functions.invoke('getWomensCenterCalendar', {
        timeMin: now.toISOString(),
        timeMax: max.toISOString()
      });
      return res.data?.events || [];
    }
  });

  const updateVolunteerMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Volunteer.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success('Volunteer updated successfully');
      setSelectedVolunteer(updated);
    },
    onError: (e) => {
      toast.error(e?.response?.data?.detail || e?.message || 'Failed to update volunteer');
    }
  });

  const sendRemindersMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('sendVolunteerReminders', {});
      if (res.status >= 400) {
        throw new Error(res.data?.error || 'Failed to send reminders');
      }
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-shifts'] });
      toast.success(`Reminders processed — ${data.sent || 0} sent, ${data.failed || 0} failed (${data.checked || 0} shifts checked)`);
    },
    onError: (e) => toast.error(e?.message || 'Failed to send reminders')
  });

  // Bulk assign selected volunteers to a single event (creates VolunteerShift per volunteer).
  const bulkAssignMutation = useMutation({
    mutationFn: async () => {
      const event = events.find(e => e.id === bulkEventId);
      if (!event) throw new Error('Please select an event');
      const eventDate = event.start && event.start.length === 10
        ? event.start + 'T00:00:00'
        : event.start;
      const selected = volunteers.filter(v => selectedIds.has(v.id));
      const payloads = selected.map(v => ({
        volunteer_id: v.id,
        volunteer_name: v.full_name,
        google_event_id: event.id,
        event_title: event.title,
        event_date: eventDate,
        role: bulkRole || 'Volunteer',
        status: 'scheduled',
        reminder_sent: false
      }));
      return base44.entities.VolunteerShift.bulkCreate(payloads);
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-shifts'] });
      toast.success(`Assigned ${Array.isArray(created) ? created.length : selectedIds.size} volunteer(s) to the event`);
      setAssignOpen(false);
      setBulkEventId('');
      setBulkRole('');
    },
    onError: (e) => toast.error(e?.response?.data?.detail || e?.message || 'Failed to assign volunteers')
  });

  // Bulk SMS to selected volunteers (respects sms_opt_in server-side).
  const bulkSmsMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('sendBulkVolunteerSms', {
        volunteer_ids: Array.from(selectedIds),
        message: bulkMessage
      });
      if (res.status >= 400) {
        throw new Error(res.data?.error || 'Failed to send bulk SMS');
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Bulk SMS sent: ${data.sent || 0} sent, ${data.skipped || 0} skipped (opt-out/no phone), ${data.failed || 0} failed`);
      setSmsOpen(false);
      setBulkMessage('');
    },
    onError: (e) => toast.error(e?.data?.error || e?.message || 'Failed to send bulk SMS')
  });

  const filteredVolunteers = volunteers.filter(v =>
    statusFilter === 'all' || v.status === statusFilter
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allFilteredSelected = filteredVolunteers.length > 0 && filteredVolunteers.every(v => selectedIds.has(v.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredVolunteers.forEach(v => next.delete(v.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredVolunteers.forEach(v => next.add(v.id));
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedVolunteers = volunteers.filter(v => selectedIds.has(v.id));
  const optedInCount = selectedVolunteers.filter(v => v.sms_opt_in === true).length;

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending', icon: Clock },
    approved: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Approved', icon: CheckCircle },
    active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Active', icon: UserCheck },
    inactive: { color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200', label: 'Inactive', icon: Users },
    declined: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Declined', icon: XCircle }
  };

  const availabilityLabels = {
    weekday_mornings: 'Weekday Mornings',
    weekday_afternoons: 'Weekday Afternoons',
    weekday_evenings: 'Weekday Evenings',
    weekends: 'Weekends',
    flexible: 'Flexible'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-gold">Volunteer Applications</h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-2">
            {filteredVolunteers.length} {statusFilter === 'all' ? 'total' : statusFilter} applications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => sendRemindersMutation.mutate()}
            disabled={sendRemindersMutation.isPending}
            className="bg-gold text-navy hover:bg-gold/90 text-lg px-5 py-3 font-semibold h-12"
            title="Send SMS reminders to volunteers with shifts in the next 24–48 hours"
          >
            <BellRing className="w-5 h-5 mr-2" />
            {sendRemindersMutation.isPending ? 'Sending…' : 'Send Shift Reminders'}
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 text-lg h-12">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-lg">All Applications</SelectItem>
              <SelectItem value="pending" className="text-lg">Pending</SelectItem>
              <SelectItem value="approved" className="text-lg">Approved</SelectItem>
              <SelectItem value="active" className="text-lg">Active</SelectItem>
              <SelectItem value="inactive" className="text-lg">Inactive</SelectItem>
              <SelectItem value="declined" className="text-lg">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-2 z-20 flex flex-col sm:flex-row sm:items-center gap-3 bg-navy dark:bg-slate-800 text-white rounded-xl p-4 shadow-lg">
          <span className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-gold" />
            {selectedIds.size} selected
          </span>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <Button
              onClick={() => setAssignOpen(true)}
              className="bg-gold text-navy hover:bg-gold/90 text-base px-4 py-2 h-10"
            >
              <CalendarPlus className="w-4 h-4 mr-2" /> Assign to Event
            </Button>
            <Button
              onClick={() => setSmsOpen(true)}
              className="bg-white text-navy hover:bg-slate-100 text-base px-4 py-2 h-10"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Send Bulk SMS
            </Button>
            <Button
              onClick={clearSelection}
              variant="ghost"
              className="text-white hover:bg-white/10 text-base px-4 py-2 h-10"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Select-all row */}
      {!isLoading && filteredVolunteers.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <Checkbox
            id="select-all"
            checked={allFilteredSelected}
            onCheckedChange={toggleSelectAll}
            className="w-5 h-5"
          />
          <Label htmlFor="select-all" className="text-base text-slate-600 dark:text-slate-300 cursor-pointer">
            Select all {filteredVolunteers.length}
          </Label>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-lg md:text-xl text-slate-500">Loading applications...</div>
      ) : filteredVolunteers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400">No volunteer applications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredVolunteers.map((volunteer) => {
            const StatusIcon = statusConfig[volunteer.status]?.icon || Clock;
            const isSel = selectedIds.has(volunteer.id);
            return (
              <Card key={volunteer.id} className={`hover:shadow-xl transition-shadow border-2 ${isSel ? 'border-gold' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={isSel}
                        onCheckedChange={() => toggleSelect(volunteer.id)}
                        className="w-5 h-5 mt-1 shrink-0"
                        aria-label={`Select ${volunteer.full_name}`}
                      />
                      <button
                        className="text-left flex-1 min-w-0"
                        onClick={() => setSelectedVolunteer(volunteer)}
                      >
                        <CardTitle className="text-2xl md:text-3xl text-navy dark:text-gold mb-2 text-left">
                          {volunteer.full_name}
                        </CardTitle>
                        <CardDescription className="space-y-2 text-left">
                          <div className="flex items-center gap-2 text-lg">
                            <Mail className="w-5 h-5 shrink-0" />
                            <span className="truncate">{volunteer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-lg">
                            <Phone className="w-5 h-5 shrink-0" />
                            {volunteer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-lg">
                            <Calendar className="w-5 h-5 shrink-0" />
                            Applied {format(new Date(volunteer.created_date), 'MMM dd, yyyy')}
                          </div>
                          {volunteer.sms_opt_in && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                              <MessageSquare className="w-4 h-4" /> SMS opt-in
                            </div>
                          )}
                        </CardDescription>
                      </button>
                    </div>
                    <Badge className={`${statusConfig[volunteer.status]?.color} text-base px-4 py-2 flex items-center gap-2 shrink-0`}>
                      <StatusIcon className="w-5 h-5" />
                      {statusConfig[volunteer.status]?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">Availability: </span>
                      <span className="text-lg text-slate-600 dark:text-slate-300">
                        {volunteer.availability?.map(a => availabilityLabels[a]).join(', ') || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">Activities: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {volunteer.areas_of_interest?.length > 0 ? (
                          volunteer.areas_of_interest.map((interest, idx) => (
                            <Badge key={idx} variant="outline" className="text-base px-3 py-1">
                              {formatActivity(interest)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-lg text-slate-400">None assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Bulk Assign to Event Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-navy dark:text-gold flex items-center gap-2">
              <CalendarPlus className="w-6 h-6" /> Assign {selectedIds.size} Volunteer(s) to Event
            </DialogTitle>
            <DialogDescription>
              Creates a scheduled shift for each selected volunteer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-lg font-semibold mb-2 block">Select an event</Label>
              <Select value={bulkEventId} onValueChange={setBulkEventId}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Choose an upcoming event" />
                </SelectTrigger>
                <SelectContent>
                  {events.length === 0 ? (
                    <SelectItem value="none" disabled>No upcoming events</SelectItem>
                  ) : events.map(e => (
                    <SelectItem key={e.id} value={e.id} className="text-lg">
                      {e.title} — {format(new Date(e.start.length === 10 ? e.start + 'T00:00:00' : e.start), 'MMM dd, yyyy h:mm a')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-lg font-semibold mb-2 block">Role (optional)</Label>
              <Input
                value={bulkRole}
                onChange={e => setBulkRole(e.target.value)}
                placeholder="e.g. Kitchen prep, Setup crew"
                className="h-12 text-lg"
              />
            </div>
            <Button
              onClick={() => bulkAssignMutation.mutate()}
              disabled={!bulkEventId || bulkAssignMutation.isPending}
              className="w-full bg-navy dark:bg-gold text-white dark:text-navy text-lg py-6"
            >
              {bulkAssignMutation.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Assigning…</>
              ) : (
                <><CalendarPlus className="w-5 h-5 mr-2" /> Assign to Event</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk SMS Dialog */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-navy dark:text-gold flex items-center gap-2">
              <MessageSquare className="w-6 h-6" /> Send Bulk SMS
            </DialogTitle>
            <DialogDescription>
              Sends one text message to {selectedIds.size} selected volunteer(s). Only volunteers who opted in to SMS will receive it ({optedInCount} eligible).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              value={bulkMessage}
              onChange={e => setBulkMessage(e.target.value)}
              placeholder="Type a message to send via SMS…"
              className="min-h-32 text-lg"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkMessage(`Hi! This is a reminder about your upcoming volunteer shift at Mercy House. Reply CONFIRM, CANCEL, or RESCHEDULE. — Mercy House`)}
              >
                Reminder template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkMessage(`Mercy House volunteer update: we appreciate your service! If you have questions, call 855-893-7333. Reply STOP to opt out.`)}
              >
                Update template
              </Button>
            </div>
            {optedInCount < selectedIds.size && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {selectedIds.size - optedInCount} volunteer(s) have not opted in to SMS and will be skipped.
              </p>
            )}
            <Button
              onClick={() => bulkSmsMutation.mutate()}
              disabled={!bulkMessage.trim() || bulkSmsMutation.isPending}
              className="w-full bg-gold text-navy hover:bg-gold/90 text-lg py-6 font-semibold"
            >
              {bulkSmsMutation.isPending ? (
                <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Sending…</>
              ) : (
                <><MessageSquare className="w-5 h-5 mr-2" /> Send to {optedInCount} Volunteer(s)</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Volunteer Detail Dialog */}
      <Dialog open={!!selectedVolunteer} onOpenChange={() => setSelectedVolunteer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl md:text-4xl text-navy dark:text-gold">
              {selectedVolunteer?.full_name}
            </DialogTitle>
            <DialogDescription className="text-lg md:text-xl">
              Volunteer Application Details
            </DialogDescription>
          </DialogHeader>

          {selectedVolunteer && (
            <div className="space-y-8 mt-6">
              {/* Status Update */}
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
                <Label className="text-xl font-semibold mb-4 block text-slate-800 dark:text-slate-200">Update Status</Label>
                <div className="flex flex-wrap gap-3">
                  {['pending', 'approved', 'active', 'inactive', 'declined'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedVolunteer.status === status ? 'default' : 'outline'}
                      onClick={() => updateVolunteerMutation.mutate({
                        id: selectedVolunteer.id,
                        data: { status }
                      })}
                      className="text-lg px-6 py-3"
                    >
                      {statusConfig[status]?.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Email</Label>
                    <Input value={selectedVolunteer.email || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, email: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Phone</Label>
                    <Input value={selectedVolunteer.phone || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, phone: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Street Address</Label>
                    <Input value={selectedVolunteer.address || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, address: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">City</Label>
                    <Input value={selectedVolunteer.city || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, city: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">State</Label>
                    <Input value={selectedVolunteer.state || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, state: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">ZIP Code</Label>
                    <Input value={selectedVolunteer.zip || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, zip: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Date of Birth</Label>
                    <Input type="date" value={selectedVolunteer.date_of_birth || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, date_of_birth: e.target.value})} className="h-12 text-lg" />
                  </div>
                </div>
                <Button
                  onClick={() => updateVolunteerMutation.mutate({
                    id: selectedVolunteer.id,
                    data: {
                      email: selectedVolunteer.email,
                      phone: selectedVolunteer.phone,
                      address: selectedVolunteer.address,
                      city: selectedVolunteer.city,
                      state: selectedVolunteer.state,
                      zip: selectedVolunteer.zip,
                      date_of_birth: selectedVolunteer.date_of_birth || null
                    }
                  })}
                  disabled={updateVolunteerMutation.isPending}
                  className="mt-4 text-lg px-6 py-3"
                >
                  Save Contact Info
                </Button>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Emergency Contact</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Name</Label>
                    <Input value={selectedVolunteer.emergency_contact_name || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, emergency_contact_name: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Phone</Label>
                    <Input value={selectedVolunteer.emergency_contact_phone || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, emergency_contact_phone: e.target.value})} className="h-12 text-lg" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Relationship</Label>
                    <Input value={selectedVolunteer.emergency_contact_relationship || ''} onChange={(e) => setSelectedVolunteer({...selectedVolunteer, emergency_contact_relationship: e.target.value})} className="h-12 text-lg" />
                  </div>
                </div>
                <Button
                  onClick={() => updateVolunteerMutation.mutate({
                    id: selectedVolunteer.id,
                    data: {
                      emergency_contact_name: selectedVolunteer.emergency_contact_name,
                      emergency_contact_phone: selectedVolunteer.emergency_contact_phone,
                      emergency_contact_relationship: selectedVolunteer.emergency_contact_relationship
                    }
                  })}
                  disabled={updateVolunteerMutation.isPending}
                  className="mt-4 text-lg px-6 py-3"
                >
                  Save Emergency Contact
                </Button>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.availability?.length > 0 ? (
                    selectedVolunteer.availability.map((a, idx) => (
                      <Badge key={idx} className="text-base px-3 py-1">{availabilityLabels[a]}</Badge>
                    ))
                  ) : (
                    <span className="text-lg text-slate-400">Not specified</span>
                  )}
                </div>
              </div>

              <VolunteerActivityEditor volunteer={selectedVolunteer} />

              {/* Skills & Experience */}
              {(selectedVolunteer.skills || selectedVolunteer.previous_volunteer_experience || selectedVolunteer.why_volunteer) && (
                <div>
                  <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Skills & Experience</h3>
                  <div className="space-y-4 text-lg md:text-xl">
                    {selectedVolunteer.skills && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Skills:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selectedVolunteer.skills}</p>
                      </div>
                    )}
                    {selectedVolunteer.previous_volunteer_experience && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Previous Experience:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selectedVolunteer.previous_volunteer_experience}</p>
                      </div>
                    )}
                    {selectedVolunteer.why_volunteer && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Why Volunteer:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selectedVolunteer.why_volunteer}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-xl font-semibold mb-3 block text-slate-800 dark:text-slate-200">
                  Internal Notes
                </Label>
                <Textarea
                  id="notes"
                  value={selectedVolunteer.notes || ''}
                  onChange={(e) => setSelectedVolunteer({...selectedVolunteer, notes: e.target.value})}
                  placeholder="Add notes about this volunteer..."
                  className="min-h-32 text-lg md:text-xl"
                />
                <Button
                  onClick={() => updateVolunteerMutation.mutate({
                    id: selectedVolunteer.id,
                    data: { notes: selectedVolunteer.notes }
                  })}
                  className="mt-3 text-lg px-6 py-3"
                >
                  Save Notes
                </Button>
              </div>

              {/* Assigned Staff & Start Date */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="assigned_to" className="text-xl font-semibold mb-3 block text-slate-800 dark:text-slate-200">
                    Assigned Staff
                  </Label>
                  <Input
                    id="assigned_to"
                    value={selectedVolunteer.assigned_to || ''}
                    onChange={(e) => setSelectedVolunteer({...selectedVolunteer, assigned_to: e.target.value})}
                    placeholder="Staff email"
                    className="text-lg md:text-xl h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="start_date" className="text-xl font-semibold mb-3 block text-slate-800 dark:text-slate-200">
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={selectedVolunteer.start_date || ''}
                    onChange={(e) => setSelectedVolunteer({...selectedVolunteer, start_date: e.target.value})}
                    className="text-lg md:text-xl h-12"
                  />
                </div>
              </div>

              <Button
                onClick={() => updateVolunteerMutation.mutate({
                  id: selectedVolunteer.id,
                  data: {
                    assigned_to: selectedVolunteer.assigned_to,
                    start_date: selectedVolunteer.start_date || null
                  }
                })}
                className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy text-xl py-6"
              >
                Update Assignment & Start Date
              </Button>

              <VolunteerShiftManager volunteer={selectedVolunteer} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}