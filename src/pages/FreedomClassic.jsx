import React from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MapPin, Calendar, Users, Mail, Trophy, Flag, CheckCircle, XCircle, Plus, ExternalLink, Award, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REGISTER_URL = 'https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament';
const SPONSORSHIP_EMAIL = 'mailto:khardin@mercyhouseatc.com,info@mercyhouseatc.com?subject=Freedom Classic Sponsorship Inquiry';
const BROCHURE_URL = 'https://media.base44.com/files/public/6983b4b00291b5dfd8507106/d382579c9_2026_golfflyer.pdf';

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
    <div className="w-full bg-slate-100">

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
            {/* Freedom Golf Classic logo */}
             <img
              src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/fa14d3c30_mercy_house_freedom_golf_classic_transparent.png"
              alt="Mercy House Freedom Golf Classic"
              className="h-36 md:h-48 w-auto object-contain" />
            

            {/* Divider */}
            <div className="w-12 h-1 rounded-full bg-white opacity-70 self-start hidden md:block" />

            {/* Headline block */}
            <div className="text-center md:text-left">
              <p className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-1">HELPING THOSE WHO NEED A MULLIGAN IN LIFE</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight drop-shadow-lg">
                12th Annual<br />
                <span className="text-yellow-200">Freedom Classic</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-white/90 mt-2 tracking-wide">Golf Tournament</p>
              <div className="flex flex-col sm:flex-row gap-1 mt-3 text-white/80 font-medium text-sm md:text-base">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-yellow-300" /> Monday, October 19, 2026</span>
                <span className="hidden sm:inline text-white/50">·</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-yellow-300" /> Madison, MS</span>
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
              <a href={SPONSORSHIP_EMAIL}>
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
            <div className="rounded-2xl px-5 py-3" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
              <img
                src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/d820a2e7b_presentedbymachaik.png"
                alt="Mac Haik Ford Jackson"
                className="h-24 md:h-32 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))' }} />
            </div>
          </div>

        </div>
      </section>

      {/* ── Overview Strip ── */}
      <section className="bg-navy py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          <div className="flex items-center gap-4 text-white text-center md:text-left flex-1">
            <Calendar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-[#dcc061]" />
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-800">DATE</p>
              <p className="text-2xl md:text-3xl font-black text-slate-800">Monday, October 19, 2026</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/20" />
          <div className="flex items-center gap-4 text-white text-center md:text-left flex-1">
            <Flag className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-[#3f891f]" />
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-800">FORMAT</p>
              <p className="text-2xl md:text-3xl font-black text-slate-800">Four Person Scramble</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/20" />
          <div className="flex items-center gap-4 text-white text-center md:text-left flex-1">
            <MapPin className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-[#da1616]" />
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-800">LOCATION</p>
              <p className="text-2xl md:text-3xl font-black text-slate-800">Annandale & Reunion</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2026 Golf Classic Overview ── */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">2026 Golf Classic</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Schedule */}
            <div>
              <p className="font-bold text-lg mb-3 text-neutral-900">Monday, October 19, 2026</p>
              <div className="space-y-3 text-slate-700">
                <div>
                  <p className="font-semibold">Lunch</p>
                  <p className="text-slate-600 text-sm">11:00 AM</p>
                </div>
                <div>
                  <p className="font-semibold">Tee Time</p>
                  <p className="text-slate-600 text-sm">12:00 PM</p>
                </div>
              </div>
              <p className="text-xs mt-4 italic text-[#ff2a00]">One round per course. Course selection is first come, first served.</p>
            </div>

            {/* Cost & Includes */}
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1"><sup className="text-xl">$</sup>1,000 per team</p>
              <p className="font-semibold text-slate-700 mb-3">What's Included:</p>
              <ul className="space-y-2">
                {[
                '4 Man Scramble at either Reunion Golf & Country Club or Annandale Golf Club',
                'Delicious Lunch',
                'Golf Swag',
                'Several Chances to Win Prizes'].
                map((item) =>
                <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                )}
              </ul>
            </div>

            {/* Mission */}
            <div>
              <p className="text-xl font-bold mb-3 text-[#01a24f]">Helping Those Who Need A Mulligan In Life.</p>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                By participating in the Golf Classic, you are supporting the Mercy House ministry and giving hope to men and women who are seeking freedom from life controlling issues.
              </p>
              <p className="text-slate-700 font-semibold text-sm mb-4">Help us change lives by reaching our goal of $200,000.</p>
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full hover:bg-gold/90 text-navy font-bold rounded-full flex items-center justify-center gap-2 py-5 bg-[hsl(var(--card))]">
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
                <p className="font-bold text-xl text-slate-800">Annandale Golf Club</p>
              </div>
              <p className="text-slate-800 font-medium">100 Annandale Golf Club Drive<br />Madison, MS 39110</p>
              <a href="https://maps.google.com/?q=100+Annandale+Golf+Club+Drive+Madison+MS+39110" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold hover:underline text-[#1e293a]">Get Directions →</a>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-navy" />
                <p className="font-bold text-xl text-slate-800">Reunion Golf &amp; Country Club</p>
              </div>
              <p className="text-slate-800 font-medium">150 Greensward Dr<br />Madison, MS 39110</p>
              <a href="https://maps.google.com/?q=150+Greensward+Dr+Madison+MS+39110" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold hover:underline text-[#1e293a]">Get Directions →</a>
            </div>
            <div className="flex-1">
              <p className="font-bold mb-3 text-slate-800 text-xl">Questions?</p>
              <a href="tel:6015869870" className="flex items-center gap-2 font-bold text-slate-800 hover:underline mb-1">
                <Phone className="w-4 h-4" /> (601) 586-9870
              </a>
              <a href="tel:6012138536" className="flex items-center gap-2 font-bold text-slate-800 hover:underline mb-2">
                <Phone className="w-4 h-4" /> (601) 213-8536
              </a>
              <a href="mailto:info@mercyhouseatc.com" className="block text-sm font-semibold hover:underline text-slate-800">info@mercyhouseatc.com</a>
              <a href="mailto:mmilliman@mercyhouseatc.com" className="block mt-1 text-sm font-semibold hover:underline text-slate-800">mmilliman@mercyhouseatc.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sponsorship Levels ── */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-3 text-slate-800">Become a Sponsor!</h2>
          <p className="text-center text-slate-600 mb-10 text-base">Help us with our $200K goal to open our new Women's Campus!</p>

          {/* Top row: Platinum + Diamond */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Platinum */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col">
              <div className="bg-[#b0b0b0] text-white text-center py-4">
                <p className="font-black text-2xl tracking-widest">PLATINUM SPONSOR</p>
                <p className="text-4xl font-black mt-1">$10,000</p>
              </div>
              <div className="bg-white p-6 flex-1">
                <ul className="space-y-2">
                  {[
                  'Advertised on main banner, local radio stations (96.3 & 101.7), & golf towels',
                  'Premier logo recognition on all golf carts',
                  'Framed plaque and recognition at event',
                  '3 golf teams & 8 hole sponsorships',
                  '4 exclusive feather banners — 2 at each course'].
                  map((item) =>
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Diamond */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-blue-300 flex flex-col">
              <div className="bg-[#1a3a6e] text-white text-center py-4">
                <p className="font-black text-2xl tracking-widest">DIAMOND SPONSOR</p>
                <p className="text-4xl font-black mt-1">$5,000</p>
              </div>
              <div className="bg-white p-6 flex-1">
                <ul className="space-y-2">
                  {[
                  'Advertised on main banner, local radio stations (96.3 & 98.1), and golf towels',
                  'Premier logo recognition on all golf carts',
                  'Framed plaque and recognition at event',
                  '2 golf teams & 4 hole sponsorships',
                  '2 exclusive feather banners — 1 at each course'].
                  map((item) =>
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row: Gold + Silver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Gold */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-yellow-300 flex flex-col">
              <div className="bg-[#e6c94c] text-navy text-center py-4">
                <p className="font-black text-2xl tracking-widest">GOLD SPONSOR</p>
                <p className="text-4xl font-black mt-1">$3,000</p>
              </div>
              <div className="bg-white p-6 flex-1">
                <ul className="space-y-2">
                  {[
                  'Advertised on main banner, golf towels distributed to participants, and social media',
                  'Presentation of framed plaque recognition',
                  '1 golf team & 2 hole sponsorships'].
                  map((item) =>
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Silver */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col">
              <div className="bg-[#a8a8a8] text-white text-center py-4">
                <p className="font-black text-2xl tracking-widest">SILVER SPONSOR</p>
                <p className="text-4xl font-black mt-1">$2,000</p>
              </div>
              <div className="bg-white p-6 flex-1">
                <ul className="space-y-2">
                  {[
                  'Advertised on main banner',
                  '1 golf team and 1 hole sponsorship'].
                  map((item) =>
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Hole Sponsorships */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Hole Sponsorships</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-3xl font-black text-[#13761c]">$150</p>
                <p className="text-slate-600 font-semibold mt-1">Single Hole</p>
              </div>
              <div className="text-center bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-3xl font-black text-[#13761c]">$300</p>
                <p className="text-slate-600 font-semibold mt-1">Dual Hole</p>
              </div>
            </div>
          </div>

          {/* Mail info + CTAs */}
          <div className="bg-navy text-white rounded-2xl p-6 mb-8 text-sm text-center">
            <p className="font-semibold mb-1 text-slate-800">Mail Entries to: MHATC Golf Tournament</p>
            <p className="text-slate-800">PO Box 266, Georgetown, MS 39078</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
              <Button className="hover:bg-gold/90 text-navy font-bold px-12 py-5 text-lg rounded-full flex items-center gap-2 shadow-lg bg-[hsl(var(--background))]">
                <ExternalLink className="w-5 h-5" />
                Register Now
              </Button>
            </a>
            <a href={BROCHURE_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-2 border-slate-600 hover:bg-slate-100 px-12 py-5 text-lg rounded-full font-semibold text-[hsl(var(--foreground))]">
                📄 Download Brochure
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Sponsors ── */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 tracking-widest uppercase mb-10">Thanks To Our Sponsors</h2>
          <div className="bg-white border border-slate-200 rounded-2xl shadow p-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 items-center justify-items-center">

              {/* Mac Haik Ford Jackson */}
              <a href="https://www.machaikfordjackson.com/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 rounded-xl hover:bg-slate-50 transition-colors w-full">
                <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/4d4f3719d_image.png" alt="Mac Haik Ford Jackson" className="h-24 w-auto object-contain group-hover:scale-105 transition-transform" />
              </a>

              {/* Toyota of Hattiesburg */}
              <a href="https://www.toyotahattiesburg.com/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 rounded-xl hover:bg-slate-50 transition-colors w-full">
                <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/485fb9290_ToyotaofHattiesburg-RedandBlack.png" alt="Toyota of Hattiesburg" className="h-24 w-auto object-contain group-hover:scale-105 transition-transform hidden" />
              </a>

              {/* Deviney Construction */}
              <a href="https://www.devineyconstruction.com/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 rounded-xl hover:bg-slate-50 transition-colors w-full">
                <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/0a59a4908_DEVINEYLOGO.jpg" alt="Deviney Construction" className="h-24 w-auto object-contain group-hover:scale-105 transition-transform" />
              </a>

              {/* Morgan White Group */}
              <a href="https://morganwhite.com/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 rounded-xl hover:bg-slate-50 transition-colors w-full">
                <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/e4523a710_MorganWhite.jpg" alt="Morgan White Group" className="h-24 w-auto object-contain group-hover:scale-105 transition-transform" />
              </a>

              {/* Knit Together Healthcare */}
              <a href="https://knittogetherhealthcare.com/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 rounded-xl hover:bg-slate-50 transition-colors w-full">
                <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/9d7c3a24e_KnitTogetherLogoWhiteBG.jpg" alt="Knit Together Healthcare" className="h-24 w-auto object-contain group-hover:scale-105 transition-transform" />
              </a>

            </div>
            <p className="text-center text-slate-600 text-sm mt-8 italic">More sponsors to be announced — <a href="mailto:mmilliman@mercyhouseatc.com,info@mercyhouseatc.com?subject=Freedom Classic Sponsorship" className="underline hover:text-navy">contact us to become a sponsor</a>.</p>
          </div>
        </div>
      </section>

      {/* ── Live Leaderboard ── */}
      <section className="py-16 bg-navy">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Award className="w-7 h-7 text-[#d91c1c]" />
              <h2 className="text-3xl font-bold text-slate-800">Live Leaderboard</h2>
            </div>
            <p className="mb-6 text-slate-800">Follow the action in real time on tournament day.</p>
            <a href="https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament/leaderboards" target="_blank" rel="noopener noreferrer">
              <Button className="hover:bg-gold/90 font-bold px-8 py-4 text-lg mb-6 bg-white text-slate-800">
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
      <section className="py-14 bg-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#426a06]">Play Golf. Change Lives.</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">Every swing you take supports men and women finding freedom from life controlling issues. 100% of individual donations go directly to Mercy House's faith-based recovery mission.

          </p>
          <a href="https://mercyhouseatc.com/donate-today" target="_blank" rel="noopener noreferrer">
            <Button className="hover:bg-gold/90 font-bold px-8 py-4 text-lg bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">
              Support the Mission
            </Button>
          </a>
        </div>
      </section>

    </div>);

}