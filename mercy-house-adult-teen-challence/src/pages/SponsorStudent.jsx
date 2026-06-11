import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, Heart, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SponsorStudent() {
  const [selectedResident, setSelectedResident] = useState(null);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sponsorship') === 'success') {
      const residentName = params.get('resident');
      toast.success(`Thank you for sponsoring ${residentName}! You will receive a confirmation email.`);
    } else if (params.get('sponsorship') === 'cancelled') {
      toast.error('Sponsorship cancelled. Feel free to try again anytime.');
    }
  }, []);

  const { data: residents, isLoading } = useQuery({
    queryKey: ['residents'],
    queryFn: () => base44.entities.Resident.filter({ available_for_sponsorship: true }),
    initialData: []
  });

  const handleSponsor = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (window.self !== window.top) {
      toast.error('Sponsorships must be completed from the published app. Please open the app in a new tab.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await base44.functions.invoke('createSponsorshipCheckout', {
        residentId: selectedResident.id,
        amount: amount,
        email: email
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Sponsorship error:', error);
      toast.error('Failed to start sponsorship. Please try again.');
      setLoading(false);
    }
  };

  const suggestedAmounts = [40, 60, 80, 100];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-navy dark:bg-slate-950 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Sponsor a Student
              </h1>
              <p className="text-xl text-slate-300 mb-4 leading-relaxed">
                Change a life. Build a future.
              </p>
              <p className="text-lg text-slate-200 mb-8">
                For just <span className="text-gold font-bold text-2xl">$40</span> a month, you can sponsor a student in our program and provide direct support for their transformation journey.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Monthly support & encouragement</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Progress updates on their journey</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Direct funding for educational needs</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Tax-deductible donation</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold text-navy rounded-2xl p-8 text-center shadow-2xl">
                <div className="text-6xl font-black mb-3">$40</div>
                <div className="text-2xl font-bold mb-6">/month</div>
                <p className="text-navy/80 font-semibold mb-8">
                  Make a direct impact on a student's life
                </p>
                <Button className="w-full bg-navy hover:bg-navy/90 text-gold font-bold text-lg py-6">
                  <Heart className="w-5 h-5 mr-2" />
                  Become a Sponsor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-3">Students Ready for Sponsorship</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Meet the students who would benefit from your monthly support
          </p>
        </div>

        {isLoading ?
        <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-navy dark:text-gold mx-auto" />
          </div> :
        residents.length === 0 ?
        <Card className="text-center p-12">
            <p className="text-slate-600 dark:text-slate-300">
              Currently, we sponsor students in our program as a cohort rather than individual sponsorships.
              <br />
              <Button variant="outline" className="mt-6" onClick={() => window.location.href = '/Donate'}>
                Support Our Students
              </Button>
            </p>
          </Card> :

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents.map((resident) =>
          <Card key={resident.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedResident(resident)}>
                <div className="aspect-[4/5] overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {resident.photo_url ?
              <img
                src={resident.photo_url}
                alt={resident.full_name}
                className="w-full h-full object-cover hidden" /> :


              <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-20 h-20 text-slate-400" />
                    </div>
              }
                </div>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">{resident.full_name}</CardTitle>
                  {resident.age &&
              <p className="text-sm text-slate-600 dark:text-slate-400">Age {resident.age}</p>
              }
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">
                    {resident.story || 'On a journey to transformation...'}
                  </p>
                  <Button className="w-full mt-4 bg-gold hover:bg-gold/90 text-navy font-bold">
                    <Heart className="w-4 h-4 mr-2" />
                    Sponsor ${suggestedAmounts[0]}/month
                  </Button>
                </CardContent>
              </Card>
          )}
          </div>
        }
      </div>

      <Dialog open={!!selectedResident} onOpenChange={(open) => !open && setSelectedResident(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy dark:text-gold">
              Sponsor {selectedResident?.full_name}
            </DialogTitle>
            <DialogDescription>
              Your monthly support will directly impact {selectedResident?.full_name}'s journey to transformation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sponsor_email">Your Email</Label>
              <Input
                id="sponsor_email"
                type="email"
                placeholder="sponsor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              
            </div>

            <div>
              <Label>Monthly Sponsorship Amount</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {suggestedAmounts.map((amt) =>
                <Button
                  key={amt}
                  variant={amount === amt ? 'default' : 'outline'}
                  onClick={() => setAmount(amt)}
                  className={amount === amt ? 'bg-navy dark:bg-gold text-white dark:text-navy font-bold' : 'font-semibold'}>
                  
                    ${amt}
                  </Button>
                )}
              </div>
              <Input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="mt-2"
                placeholder="Custom amount" />
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Most sponsors choose $40/month, but you can adjust to any amount.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <h4 className="font-semibold text-navy dark:text-gold mb-2">Your Impact:</h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Monthly encouragement & support
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Progress updates on their journey
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Direct funding for their needs
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Tax-deductible donation
                </li>
              </ul>
            </div>

            <Button
              onClick={handleSponsor}
              disabled={loading || !email || amount < 10}
              className="w-full bg-gold hover:bg-gold/90 text-navy font-bold">
              
              {loading ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </> :

              <>
                  <Heart className="w-4 h-4 mr-2" />
                  Sponsor ${amount}/month
                </>
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>);

}