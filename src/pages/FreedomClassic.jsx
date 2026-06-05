import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MapPin, Calendar, Users, Mail, Trophy, Flag, CheckCircle, XCircle, Plus, ExternalLink, Award, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REGISTER_URL = 'https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament';
const BROCHURE_URL = 'mailto:info@mercyhouseatc.com?subject=Freedom Classic Brochure Request';

const Check = ({ included }) => included ?
<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> :
<XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />;

const AddonItem = ({ label }) =>
<li className="flex items-start gap-2 text-slate-700 text-sm py-1">
    <Plus className="w-4 h-4 text-navy flex-shrink-0 mt-0.5" />
    {label}
  </li>;


export default function FreedomClassic() {
  return (
    <div className="w-full bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '62vh' }}>

        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/d84ade956_herogolg.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105" />
          
          {/* Warm amber/gold wash over entire image */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(250,175,0,0.78) 0%, rgba(245,165,0,0.70) 50%, rgba(255,200,0,0.55) 75%, rgba(255,240,100,0.30) 100%)' }} />
          {/* Left-side dark gradient for text legibility */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }} />
          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))' }} />
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ height: '70px', display: 'block' }}>
            <path d="M0,55 C360,95 720,15 1080,55 C1260,75 1380,35 1440,50 L1440,90 L0,90 Z" fill="white" opacity="0.5" />
            <path d="M0,65 C280,100 600,35 960,68 C1150,84 1320,45 1440,62 L1440,90 L0,90 Z" fill="white" />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-10 py-14 pb-28">

          {/* ── LEFT: Mercy House logo + headline + CTAs ── */}
          <div className="flex flex-col items-center md:items-start gap-5 flex-1">
            {/* Mercy House logo — white drop-shadow so it reads on gold */}
            <img
              src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/8095691f4_11BlackSquareStacked.png"
              alt="Mercy House Adult & Teen Challenge"
              className="h-24 md:h-28 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.6)) brightness(0) invert(1)' }} />
            

            {/* Divider */}
            <div className="w-12 h-1 rounded-full bg-white opacity-70 self-start hidden md:block" />

            {/* Headline block */}
            <div className="text-center md:text-left">
              <p className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-1">Benefiting Mercy House Ministry</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight drop-shadow-lg">
                12th Annual<br />
                <span className="text-yellow-200">Freedom Classic</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-white/90 mt-2 tracking-wide">Golf Tournament</p>
              <div className="flex flex-col sm:flex-row gap-1 mt-3 text-white/80 font-medium text-sm md:text-base">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-yellow-300" /> Monday, October 19, 2026</span>
                <span className="hidden sm:inline text-white/50">·</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-yellow-300" /> Annandale Golf Club, Madison, MS</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                <Button className="hover:bg-navy/90 text-white font-bold px-8 py-5 text-base rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 bg-[hsl(var(--card))]">
                  <ExternalLink className="w-4 h-4" />
                  Register Your Team
                </Button>
              </a>
              <a href="mailto:info@mercyhouseatc.com">
                <Button className="hover:bg-white/30 backdrop-blur-sm border-2 border-white text-white font-semibold px-8 py-5 text-base rounded-full flex items-center gap-2 transition-transform hover:scale-105 bg-[hsl(var(--primary-foreground))]">
                  <Mail className="w-4 h-4" />
                  Sponsorship Inquiry
                </Button>
              </a>
            </div>
          </div>

          {/* ── RIGHT: Presented by ── */}
          <div className="flex flex-col items-center justify-center gap-3 md:min-w-[220px] md:pl-8 md:border-l md:border-white/25">
            <p className="text-white/75 font-semibold text-xs uppercase tracking-[0.2em]">Presented by</p>
            {/* White pill backdrop ensures the logo is readable on the golden bg without a checkerboard */}
            <div className="rounded-2xl px-5 py-3" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
              <img
                src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/d820a2e7b_presentedbymachaik.png"
                alt="Mac Haik Ford Jackson"
                className="h-16 md:h-20 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))' }} />
              
            </div>
          </div>

        </div>
      </section>

      {/* ── Overview Strip ── */}
      <section className="bg-navy py-5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-base">
            <Calendar className="w-5 h-5 text-gold" />
            Monday, October 19, 2026
          </div>
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-base">
            <Flag className="w-5 h-5 text-gold" />
            Four Person Scramble
          </div>
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-base">
            <MapPin className="w-5 h-5 text-gold" />
            Annandale Golf Club · Madison, MS
          </div>
        </div>
      </section>

      {/* ── 2026 Golf Classic Overview ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[hsl(var(--popover))]">2026 Golf Classic</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Schedule */}
            <div>
              <p className="font-bold text-lg mb-3 text-navy">Monday, October 19, 2026</p>
              <div className="space-y-3 text-slate-700">
                <div>
                  <p className="font-semibold">Morning Round</p>
                  <p className="text-slate-600 text-sm">8:00 AM (breakfast included)</p>
                  </div>
                  <div>
                  <p className="font-semibold">Lunch</p>
                  <p className="text-slate-600 text-sm">12:30 PM</p>
                  </div>
                  <div>
                  <p className="font-semibold">Afternoon Round</p>
                  <p className="text-slate-600 text-sm">1:30 PM</p>
                </div>
              </div>
              <p className="text-slate-600 text-xs mt-4 italic">Tee-off preference is given on a first-come, first-served basis after payment.</p>
            </div>

            {/* Cost & Includes */}
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1"><sup className="text-xl">$</sup>1,000 per team</p>
              <p className="font-semibold text-slate-700 mb-3">What's Included:</p>
              <ul className="space-y-2">
                {['4 Man Scramble at Annandale Golf Club', 'Delicious Lunch', 'High Quality Golf Polo', 'Several Chances to Win Prizes'].map((item) =>
                <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                )}
              </ul>
            </div>

            {/* Mission */}
            <div>
              <p className="text-xl font-bold mb-3 text-navy">Helping Those Who Need A Mulligan In Life.</p>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                By participating in the Golf Classic, you are supporting the Mercy House ministry and giving hope to men and women who are seeking freedom from addiction.
              </p>
              <p className="text-slate-700 font-semibold text-sm mb-4">Help us change lives by reaching our goal of $125,000.</p>
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gold hover:bg-gold/90 text-navy font-bold rounded-full flex items-center justify-center gap-2 py-5">
                  <ExternalLink className="w-4 h-4" />
                  Register Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Venue ── */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-navy" />
                <p className="font-bold text-xl text-navy">Annandale Golf Club</p>
              </div>
              <p className="text-slate-800 font-medium">100 Annandale Golf Club Drive<br />Madison, MS 39110</p>
              <a href="https://maps.google.com/?q=100+Annandale+Golf+Club+Drive+Madison+MS+39110" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-navy hover:underline">
                Get Directions →
              </a>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-navy" />
                <p className="font-bold text-xl text-[hsl(var(--background))]">Reunion Golf & Country Club</p>
              </div>
              <p className="text-slate-800 font-medium">150 Greensward Dr<br />Madison, MS 39110</p>
              <a href="https://maps.google.com/?q=150+Greensward+Dr+Madison+MS+39110" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-navy hover:underline">
                Get Directions →
              </a>
            </div>
            <div className="flex-1">
              <p className="font-bold text-navy mb-2">Questions?</p>
              <a href="tel:6017203718" className="flex items-center gap-2 font-bold text-slate-800 hover:underline">
                <Phone className="w-4 h-4" /> (601) 720-3718
              </a>
              <a href="mailto:info@mercyhouseatc.com" className="block mt-1 text-sm font-semibold hover:underline text-[hsl(var(--background))]">info@mercyhouseatc.com</a>
              <a href="mailto:khardin@mercyhouseatc.com" className="block mt-1 text-sm font-semibold hover:underline text-[hsl(var(--background))]">khardin@mercyhouseatc.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Sponsorships ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-[hsl(var(--background))]">Team Sponsorships</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            {/* Platinum */}
            <div className="flex flex-col">
              <div className="bg-navy text-white text-center font-bold text-lg py-4 tracking-widest">PLATINUM</div>
              <div className="flex-1 bg-white p-6 flex flex-col">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>5,000</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                  [true, '8 Golfers'],
                  [true, 'Website logo'],
                  [true, 'Testimony tee-box sign logo'],
                  [true, 'Branded feather banner'],
                  [true, 'Embroidered sleeve logo (limited availability)']].
                  map(([inc, label]) =>
                  <div key={label} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check included={inc} />{label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gold */}
            <div className="flex flex-col">
              <div className="bg-gold text-navy text-center font-bold text-lg py-4 tracking-widest">GOLD</div>
              <div className="flex-1 bg-white p-6 flex flex-col border-l border-slate-100">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>2,500</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                  [true, '4 Golfers'],
                  [true, 'Website logo'],
                  [true, 'Testimony tee-box sign logo'],
                  [true, 'Branded feather banner'],
                  [false, 'Embroidered sleeve logo']].
                  map(([inc, label]) =>
                  <div key={label} className={`flex items-start gap-2 text-sm ${inc ? 'text-slate-700' : 'text-slate-500 line-through'}`}>
                      <Check included={inc} />{label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Silver */}
            <div className="flex flex-col">
              <div className="bg-navy-light text-white text-center font-bold text-lg py-4 tracking-widest">SILVER</div>
              <div className="flex-1 bg-white p-6 flex flex-col border-l border-slate-100">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>1,500</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                  [true, '4 Golfers'],
                  [true, 'Website logo'],
                  [true, 'Testimony tee-box sign logo'],
                  [false, 'Branded feather banner'],
                  [false, 'Embroidered sleeve logo']].
                  map(([inc, label]) =>
                  <div key={label} className={`flex items-start gap-2 text-sm ${inc ? 'text-slate-700' : 'text-slate-500 line-through'}`}>
                      <Check included={inc} />{label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Only */}
            <div className="flex flex-col">
              <div className="bg-slate-600 text-white text-center font-bold text-lg py-4 tracking-widest">TEAM ONLY</div>
              <div className="flex-1 bg-white p-6 flex flex-col border-l border-slate-100">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>1,000</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                  [true, '4 Golfers'],
                  [false, 'Website logo'],
                  [false, 'Testimony tee-box sign logo'],
                  [false, 'Branded feather banner'],
                  [false, 'Embroidered sleeve logo']].
                  map(([inc, label]) =>
                  <div key={label} className={`flex items-start gap-2 text-sm ${inc ? 'text-slate-700' : 'text-slate-500 line-through'}`}>
                      <Check included={inc} />{label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
              <Button className="hover:bg-gold/90 text-navy font-bold px-12 py-5 text-lg rounded-full flex items-center gap-2 shadow-lg bg-[hsl(var(--background))]">
                <ExternalLink className="w-5 h-5" />
                Register Now
              </Button>
            </a>
            <a href={BROCHURE_URL}>
              <Button variant="outline" className="border-2 border-slate-600 hover:bg-slate-100 px-12 py-5 text-lg rounded-full font-semibold text-[hsl(var(--foreground))]">
                📄 Download Brochure
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Add-on Sponsorships ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-3 text-[hsl(var(--background))]">Add-on Sponsorships</h2>
          <p className="text-center text-slate-700 max-w-2xl mx-auto mb-10 text-sm leading-relaxed">
            Advertise your company's logo as the sole sponsor for any of the following add-ons. These can be added to a team sponsorship package above or purchased solo without a team. But hurry! Only one company per sponsorship.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* $2,500 */}
            <div>
              <p className="text-2xl font-bold mb-4 text-navy"><sup className="text-base">$</sup>2,500 each</p>
              <ul className="space-y-1">
                {['Closest to the Pin Sponsor', 'Longest Drive Sponsor', 'Golf Cannon Sponsor'].map((l) => <AddonItem key={l} label={l} />)}
              </ul>
            </div>
            {/* $2,000 */}
            <div>
              <p className="text-2xl font-bold mb-4 text-navy"><sup className="text-base">$</sup>2,000 each</p>
              <ul className="space-y-1">
                {['Registration Tent Sponsor', 'Hospitality Tent Sponsor', 'Golf Cart Sponsor', 'Driving Range Sponsor', 'Putting Green Sponsor', 'Golf Ball Sponsor'].map((l) => <AddonItem key={l} label={l} />)}
              </ul>
            </div>
            {/* $500 & $250 */}
            <div>
              <p className="text-2xl font-bold mb-4 text-navy"><sup className="text-base">$</sup>500 each</p>
              <ul className="space-y-1 mb-6">
                {['Testimony Tee-Box Sponsor'].map((l) => <AddonItem key={l} label={l} />)}
              </ul>
              <p className="text-2xl font-bold mb-4 text-navy"><sup className="text-base">$</sup>250 each</p>
              <ul className="space-y-1">
                {['Welcome Sign Sponsor'].map((l) => <AddonItem key={l} label={l} />)}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-10">
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="w-full max-w-sm">
              <Button className="w-full hover:bg-gold/90 font-bold py-5 text-lg rounded-full flex items-center justify-center gap-2 shadow-lg text-[hsl(var(--background))] bg-[hsl(var(--background))]">
                <ExternalLink className="w-5 h-5" />
                Register Now
              </Button>
            </a>
            <a href={BROCHURE_URL} className="w-full max-w-sm">
              <Button variant="outline" className="w-full border-2 border-slate-600 text-slate-700 hover:bg-slate-100 py-5 text-lg rounded-full font-semibold">
                📄 Download Brochure
              </Button>
            </a>
            <p className="text-xl font-bold mt-2 text-navy">Questions? Call (601) 720-3718</p>
          </div>
        </div>
      </section>

      {/* ── Sponsors ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 tracking-widest uppercase mb-10">Thanks To Our Sponsors</h2>
          <div className="bg-white border border-slate-200 rounded-2xl shadow p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-items-center">
              <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/4d4f3719d_image.png" alt="Mac Haik Ford Jackson" className="h-16 w-auto object-contain" />
              {/* Placeholder slots for future sponsors */}
            </div>
            <p className="text-center text-slate-600 text-sm mt-6 italic">More sponsors to be announced — <a href="mailto:info@mercyhouseatc.com" className="underline hover:text-navy">contact us to become a sponsor</a>.</p>
          </div>
        </div>
      </section>

      {/* ── Live Leaderboard ── */}
      <section className="py-16 bg-navy">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Award className="w-7 h-7 text-gold" />
              <h2 className="text-3xl font-bold text-white">Live Leaderboard</h2>
            </div>
            <p className="text-slate-100 mb-6">Follow the action in real time on tournament day.</p>
            <a href="https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament/leaderboards" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 text-lg mb-6">
                <ExternalLink className="mr-2 w-5 h-5" />
                Open Live Scores
              </Button>
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <iframe
              src="https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament/leaderboards"
              title="Freedom Classic Live Leaderboard"
              className="w-full"
              style={{ height: '600px', border: 'none' }}
              allowFullScreen />
            
          </div>
          <p className="text-center text-slate-300 text-xs mt-3">If the leaderboard doesn't load above, use the "Open Live Scores" button.</p>
        </div>
      </section>

      {/* ── Mission Banner ── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-navy">Play Golf. Change Lives.</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            Every swing you take supports men and women finding freedom from addiction. 100% of individual donations go directly to Mercy House's faith-based recovery mission.
          </p>
          <a href="https://mercyhouseatc.com/donate-today" target="_blank" rel="noopener noreferrer">
            <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 text-lg">
              Support the Mission
            </Button>
          </a>
        </div>
      </section>

    </div>);

}