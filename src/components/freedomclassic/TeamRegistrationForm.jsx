import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Loader2, CheckCircle, ExternalLink, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

const REGISTER_URL = 'https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament';

const EMPTY = {
  team_name: '',
  captain_name: '',
  captain_email: '',
  captain_phone: '',
  course_preference: 'no_preference',
  player2_name: '',
  player3_name: '',
  player4_name: '',
  notes: ''
};

export default function TeamRegistrationForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [prefilled, setPrefilled] = useState(false);

  // Prefill captain name + email from the logged-in user's context.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await base44.auth.me();
        if (cancelled || !user) return;
        setFormData((d) => ({
          ...d,
          captain_name: user.full_name || d.captain_name,
          captain_email: user.email || d.captain_email
        }));
        setPrefilled(!!(user.full_name || user.email));
      } catch {
        // Not logged in — leave blank; the visitor can fill manually.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const set = (key) => (e) => setFormData((d) => ({ ...d, [key]: e.target ? e.target.value : e }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.team_name || !formData.captain_name || !formData.captain_email) {
      toast.error('Please fill in team name, captain name, and email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.captain_email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const record = await base44.entities.GolfTeamRegistration.create(formData);
      setSubmitted(record);
      toast.success('Team registration submitted!');
    } catch (err) {
      toast.error('Could not submit: ' + (err?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-300 bg-white">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-2">You're Registered, {submitted.captain_name?.split(' ')[0]}!</h3>
          <p className="text-slate-600 mb-1">Team <span className="font-semibold text-navy">{submitted.team_name}</span> is signed up for the 12th Annual Freedom Classic.</p>
          <p className="text-sm text-slate-500 mb-6">We've saved your registration. Complete your $1,000 team payment below to secure your spot.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 text-base rounded-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Pay & Finalize on GolfStatus
              </Button>
            </a>
            <Button variant="outline" onClick={() => { setSubmitted(null); setFormData(EMPTY); }} className="rounded-full px-8 py-4">
              Register Another Team
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-navy text-2xl">
          <Users className="w-6 h-6 text-gold" />
          Team Registration
        </CardTitle>
        {prefilled && (
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <UserCircle className="w-4 h-4 text-green-600" />
            We pre-filled your name and email from your account.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="team_name">Team Name *</Label>
            <Input id="team_name" value={formData.team_name} onChange={set('team_name')} placeholder="e.g. The Mulligans" required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="captain_name">Captain Name *</Label>
              <Input id="captain_name" value={formData.captain_name} onChange={set('captain_name')} placeholder="Your full name" required />
            </div>
            <div>
              <Label htmlFor="captain_email">Captain Email *</Label>
              <Input id="captain_email" type="email" value={formData.captain_email} onChange={set('captain_email')} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="captain_phone">Captain Phone</Label>
              <Input id="captain_phone" value={formData.captain_phone} onChange={set('captain_phone')} placeholder="(601) 555-0000" />
            </div>
            <div>
              <Label>Course Preference</Label>
              <Select value={formData.course_preference} onValueChange={set('course_preference')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_preference">No Preference</SelectItem>
                  <SelectItem value="annandale">Annandale Golf Club</SelectItem>
                  <SelectItem value="reunion">Reunion Golf &amp; Country Club</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy mb-2">Team Players (4-person scramble — you + 3)</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="p2">Player 2</Label>
                <Input id="p2" value={formData.player2_name} onChange={set('player2_name')} placeholder="Name" />
              </div>
              <div>
                <Label htmlFor="p3">Player 3</Label>
                <Input id="p3" value={formData.player3_name} onChange={set('player3_name')} placeholder="Name" />
              </div>
              <div>
                <Label htmlFor="p4">Player 4</Label>
                <Input id="p4" value={formData.player4_name} onChange={set('player4_name')} placeholder="Name" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes / Special Requests</Label>
            <Textarea id="notes" value={formData.notes} onChange={set('notes')} rows={3} placeholder="Anything we should know?" />
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-5 text-base rounded-full">
            {submitting ? <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting…
            </> : <>
              <Users className="w-5 h-5 mr-2" /> Submit Team Registration
            </>}
          </Button>
          <p className="text-center text-xs text-slate-500">
            After submitting, you'll finalize your $1,000 team entry on GolfStatus. Course selection is first come, first served.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}