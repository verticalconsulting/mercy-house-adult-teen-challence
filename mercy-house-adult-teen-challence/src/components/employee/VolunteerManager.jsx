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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success('Volunteer updated successfully');
      setSelectedVolunteer(null);
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

  const interestLabels = {
    mentoring: 'Mentoring',
    teaching: 'Teaching',
    administrative: 'Administrative',
    maintenance: 'Maintenance',
    events: 'Events',
    thrift_store: 'Thrift Store',
    auto_academy: 'Auto Academy',
    kitchen: 'Kitchen',
    childcare: 'Childcare',
    transportation: 'Transportation'
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
                      <span className="font-semibold text-lg md:text-lg text-slate-700 dark:text-slate-200">Interests: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {volunteer.areas_of_interest?.map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-base md:text-base px-3 py-1">
                            {interestLabels[interest]}
                          </Badge>
                        ))}
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
                <div className="grid md:grid-cols-2 gap-4 text-lg md:text-xl">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Email:</span>
                    <p className="text-slate-600 dark:text-slate-300">{selectedVolunteer.email}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Phone:</span>
                    <p className="text-slate-600 dark:text-slate-300">{selectedVolunteer.phone}</p>
                  </div>
                  {selectedVolunteer.address && (
                    <div className="md:col-span-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Address:</span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {selectedVolunteer.address}, {selectedVolunteer.city}, {selectedVolunteer.state} {selectedVolunteer.zip}
                      </p>
                    </div>
                  )}
                  {selectedVolunteer.date_of_birth && (
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Date of Birth:</span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {format(new Date(selectedVolunteer.date_of_birth), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedVolunteer.emergency_contact_name && (
                <div>
                  <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-lg md:text-xl">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Name:</span>
                      <p className="text-slate-600 dark:text-slate-300">{selectedVolunteer.emergency_contact_name}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Phone:</span>
                      <p className="text-slate-600 dark:text-slate-300">{selectedVolunteer.emergency_contact_phone}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Relationship:</span>
                      <p className="text-slate-600 dark:text-slate-300">{selectedVolunteer.emergency_contact_relationship}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Availability & Interests */}
              <div>
                <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Availability & Interests</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-lg md:text-xl text-slate-700 dark:text-slate-200">Available:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedVolunteer.availability?.map((a, idx) => (
                        <Badge key={idx} className="text-base md:text-base px-3 py-1">{availabilityLabels[a]}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-lg md:text-xl text-slate-700 dark:text-slate-200">Areas of Interest:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedVolunteer.areas_of_interest?.map((interest, idx) => (
                        <Badge key={idx} variant="outline" className="text-base md:text-base px-3 py-1">{interestLabels[interest]}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

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
                    start_date: selectedVolunteer.start_date
                  }
                })}
                className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy text-xl py-6"
              >
                Update Assignment & Start Date
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}