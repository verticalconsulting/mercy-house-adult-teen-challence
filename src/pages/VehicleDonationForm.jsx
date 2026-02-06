import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';

export default function VehicleDonationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_condition: 'running',
    mileage: '',
    title_status: 'have_title',
    additional_notes: ''
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.VehicleDonation.create(data),
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year) : null,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
    };

    createMutation.mutate(submitData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-navy dark:text-gold mb-4">Thank You!</h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                Your vehicle donation form has been submitted successfully. We'll contact you within 24-48 hours to schedule a pickup.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy dark:text-gold mb-4">
            Vehicle Donation Form
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Fill out the form below and we'll contact you to schedule a free pickup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Location */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vehicle_year">Year</Label>
                  <Input
                    id="vehicle_year"
                    type="number"
                    placeholder="2015"
                    value={formData.vehicle_year}
                    onChange={(e) => handleChange('vehicle_year', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_make">Make *</Label>
                  <Input
                    id="vehicle_make"
                    placeholder="Toyota"
                    value={formData.vehicle_make}
                    onChange={(e) => handleChange('vehicle_make', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_model">Model *</Label>
                  <Input
                    id="vehicle_model"
                    placeholder="Camry"
                    value={formData.vehicle_model}
                    onChange={(e) => handleChange('vehicle_model', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicle_condition">Condition *</Label>
                  <Select value={formData.vehicle_condition} onValueChange={(value) => handleChange('vehicle_condition', value)}>
                    <SelectTrigger id="vehicle_condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="not_running">Not Running</SelectItem>
                      <SelectItem value="needs_repairs">Needs Repairs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="50000"
                    value={formData.mileage}
                    onChange={(e) => handleChange('mileage', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title_status">Title Status</Label>
                <Select value={formData.title_status} onValueChange={(value) => handleChange('title_status', value)}>
                  <SelectTrigger id="title_status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="have_title">I Have the Title</SelectItem>
                    <SelectItem value="no_title">No Title</SelectItem>
                    <SelectItem value="in_process">Title in Process</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea
                  id="additional_notes"
                  placeholder="Any additional information about the vehicle..."
                  rows={4}
                  value={formData.additional_notes}
                  onChange={(e) => handleChange('additional_notes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy py-6 text-lg"
          >
            {createMutation.isPending ? 'Submitting...' : 'Submit Donation Form'}
          </Button>
        </form>
      </div>
    </div>
  );
}