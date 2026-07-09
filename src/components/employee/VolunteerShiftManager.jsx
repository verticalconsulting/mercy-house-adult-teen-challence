import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Plus, Send, CalendarClock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusConfig = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  reschedule_requested: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  completed: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  no_show: 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200'
};

export default function VolunteerShiftManager({ volunteer }) {
  const queryClient = useQueryClient();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [shiftVolunteerName, setShiftVolunteerName] = useState(volunteer.full_name || '');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const { data: shifts = [], isLoading: shiftsLoading } = useQuery({
    queryKey: ['volunteer-shifts', volunteer.id],
    queryFn: () => base44.entities.VolunteerShift.filter({ volunteer_id: volunteer.id }, '-event_date', 50),
    enabled: !!volunteer.id
  });

  const { data: events = [] } = useQuery({
    queryKey: ['google-events-for-shift'],
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

  const upcomingEvents = events;

  const addShiftMutation = useMutation({
    mutationFn: async () => {
      const event = events.find(e => e.id === selectedEventId);
      if (!event) throw new Error('Please select an event');
      // All-day events have a date-only start (e.g. "2026-09-17"); convert to
      // a full date-time string so the VolunteerShift.event_date field validates.
      const eventDate = event.start && event.start.length === 10
        ? event.start + 'T00:00:00'
        : event.start;
      return base44.entities.VolunteerShift.create({
        volunteer_id: volunteer.id,
        volunteer_name: shiftVolunteerName || volunteer.full_name,
        google_event_id: event.id,
        event_title: event.title,
        event_date: eventDate,
        role: role || 'Volunteer',
        status: 'scheduled',
        reminder_sent: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-shifts', volunteer.id] });
      toast.success('Shift scheduled');
      setSelectedEventId('');
      setShiftVolunteerName(volunteer.full_name || '');
      setRole('');
    },
    onError: (e) => toast.error(e?.response?.data?.detail || e?.message || 'Failed to schedule shift')
  });

  const sendSmsMutation = useMutation({
    mutationFn: async (msg) => {
      const res = await base44.functions.invoke('sendVolunteerSms', { volunteer_id: volunteer.id, message: msg });
      if (res.status >= 400) {
        throw new Error(res.data?.error || 'Failed to send SMS');
      }
      return res;
    },
    onSuccess: () => {
      toast.success('Message sent');
      setMessage('');
    },
    onError: (e) => toast.error(e?.response?.data?.error || e.message || 'Failed to send')
  });

  const updateShiftMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.VolunteerShift.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-shifts', volunteer.id] });
      toast.success('Shift updated');
    }
  });

  return (
    <div className="space-y-8">
      {/* Shifts & Scheduling */}
      <div>
        <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4 flex items-center gap-2">
          <CalendarClock className="w-6 h-6" /> Shifts &amp; Scheduling
        </h3>

        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-4">
          <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200">Schedule a New Shift</Label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {upcomingEvents.length === 0 ? (
                <SelectItem value="none" disabled>No upcoming events</SelectItem>
              ) : upcomingEvents.map(e => (
                <SelectItem key={e.id} value={e.id} className="text-lg">
                  {e.title} — {format(new Date(e.start), 'MMM dd, yyyy h:mm a')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={shiftVolunteerName}
            onChange={e => setShiftVolunteerName(e.target.value)}
            placeholder="Volunteer name"
            className="h-12 text-lg"
          />
          <Input
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="Role / what they'll do (e.g. Kitchen prep)"
            className="h-12 text-lg"
          />
          <Button
            onClick={() => addShiftMutation.mutate()}
            disabled={!selectedEventId || addShiftMutation.isPending}
            className="bg-navy text-white dark:bg-navy hover:bg-navy/90 text-lg px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" /> Schedule Shift
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {shiftsLoading ? (
            <p className="text-slate-500 text-lg">Loading shifts…</p>
          ) : shifts.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-lg">No shifts scheduled yet.</p>
          ) : (
            shifts.map(s => (
              <div key={s.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{s.event_title}</p>
                  <p className="text-slate-600 dark:text-slate-300">{format(new Date(s.event_date), 'MMM dd, yyyy h:mm a')}</p>
                  {s.role && <p className="text-sm text-slate-500 dark:text-slate-400">Role: {s.role}</p>}
                  {s.reminder_sent && <p className="text-xs text-green-600 mt-1">✓ Reminder sent</p>}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <Badge className={`${statusConfig[s.status]} text-sm px-3 py-1`}>
                    {s.status.replace(/_/g, ' ')}
                  </Badge>
                  <Select
                    value={s.status}
                    onValueChange={(v) => updateShiftMutation.mutate({ id: s.id, data: { status: v } })}
                  >
                    <SelectTrigger className="h-9 w-40 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['scheduled', 'confirmed', 'completed', 'no_show', 'cancelled'].map(st => (
                        <SelectItem key={st} value={st} className="text-sm capitalize">{st.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Send SMS */}
      <div>
        <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" /> Send Text Message
        </h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-3">
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message to send via SMS…"
            className="min-h-24 text-lg"
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessage(`Hi ${volunteer.full_name?.split(' ')[0] || 'there'}, this is a reminder about your volunteer shift. Reply CONFIRM, CANCEL, or RESCHEDULE. — Mercy House`)}
            >
              Reminder template
            </Button>
          </div>
          <Button
            onClick={() => sendSmsMutation.mutate(message)}
            disabled={!message.trim() || sendSmsMutation.isPending}
            className="bg-gold text-navy hover:bg-gold/90 text-lg px-6 py-3 font-semibold"
          >
            {sendSmsMutation.isPending ? (
              <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-5 h-5 mr-2" /> Send SMS</>
            )}
          </Button>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sends to {volunteer.phone}</p>
        </div>
      </div>
    </div>
  );
}