import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, Mail, Phone, Calendar, MapPin, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import VolunteerShiftManager from './VolunteerShiftManager';
import VolunteerActivityEditor, { formatActivity } from './VolunteerActivityEditor';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function VolunteerManager() {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => base44.entities.Volunteer.list('-created_date')
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

  const filteredVolunteers = volunteers.filter(v => 
    statusFilter === 'all' || v.status === statusFilter
  );

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
            return (
              <Card key={volunteer.id} className="hover:shadow-xl transition-shadow cursor-pointer border-2" onClick={() => setSelectedVolunteer(volunteer)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl text-navy dark:text-gold mb-2">
                        {volunteer.full_name}
                      </CardTitle>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center gap-2 text-lg md:text-lg">
                          <Mail className="w-5 h-5" />
                          {volunteer.email}
                        </div>
                        <div className="flex items-center gap-2 text-lg md:text-lg">
                          <Phone className="w-5 h-5" />
                          {volunteer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-lg md:text-lg">
                          <Calendar className="w-5 h-5" />
                          Applied {format(new Date(volunteer.created_date), 'MMM dd, yyyy')}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={`${statusConfig[volunteer.status]?.color} text-base md:text-base px-4 py-2 flex items-center gap-2`}>
                      <StatusIcon className="w-5 h-5" />
                      {statusConfig[volunteer.status]?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-lg md:text-lg text-slate-700 dark:text-slate-200">Availability: </span>
                      <span className="text-lg md:text-lg text-slate-600 dark:text-slate-300">
                        {volunteer.availability?.map(a => availabilityLabels[a]).join(', ') || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-lg md:text-lg text-slate-700 dark:text-slate-200">Activities: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {volunteer.areas_of_interest?.length > 0 ? (
                          volunteer.areas_of_interest.map((interest, idx) => (
                            <Badge key={idx} variant="outline" className="text-base md:text-base px-3 py-1">
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
                <Label className="text-xl md:text-xl font-semibold mb-4 block text-slate-800 dark:text-slate-200">Update Status</Label>
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
                <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Contact Information</h3>
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
                <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Emergency Contact</h3>
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
                <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.availability?.length > 0 ? (
                    selectedVolunteer.availability.map((a, idx) => (
                      <Badge key={idx} className="text-base md:text-base px-3 py-1">{availabilityLabels[a]}</Badge>
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
                  <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Skills & Experience</h3>
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
                <Label htmlFor="notes" className="text-xl md:text-xl font-semibold mb-3 block text-slate-800 dark:text-slate-200">
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
                  <Label htmlFor="assigned_to" className="text-xl md:text-xl font-semibold mb-3 block text-slate-800 dark:text-slate-200">
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
                  <Label htmlFor="start_date" className="text-xl md:text-xl font-semibold mb-3 block text-slate-800 dark:text-slate-200">
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