import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MapPin, Calendar, Users, Mail, Trophy, Flag, CheckCircle, XCircle, Plus, ExternalLink, Award, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REGISTER_URL = 'https://events.golfstatus.com/event/12th-annual-freedom-classic-golf-tournament';
const BROCHURE_URL = 'mailto:info@mercyhouseatc.com?subject=Freedom Classic Brochure Request';

const Check = ({ included }) => included
  ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
  : <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />;

const AddonItem = ({ label }) => (
  <li className="flex items-start gap-2 text-slate-700 text-sm py-1">
    <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
    {label}
  </li>
);

export default function FreedomClassic() {
  return (
    <div className="w-full bg-white">

      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '60vh' }}>
        {/* Background: new golf hero image with strong golden overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/d84ade956_herogolg.png"
            alt="Golf hero"
            className="w-full h-full object-cover object-center"
          />
          {/* Strong amber/gold overlay matching reference */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(245,168,0,0.72) 0%, rgba(245,185,0,0.65) 55%, rgba(255,220,0,0.5) 80%, rgba(255,255,255,0.95) 100%)' }} />
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ height: '80px' }}>
            <path d="M0,60 C240,100 480,20 720,55 C960,90 1200,20 1440,55 L1440,100 L0,100 Z" fill="white" opacity="0.6" />
            <path d="M0,70 C300,110 600,30 900,65 C1100,90 1300,40 1440,65 L1440,100 L0,100 Z" fill="white" />
          </svg>
        </div>

        {/* Content: left = Mercy House logo + tournament info, right = Presented by */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 pb-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Left: Mercy House logo + tournament details */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/8095691f4_11BlackSquareStacked.png"
                alt="Mercy House Adult & Teen Challenge"
                className="h-32 md:h-40 w-auto object-contain drop-shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold text-navy leading-tight drop-shadow">
                  12th Annual<br />Freedom Classic
                </h1>
                <p className="text-xl md:text-2xl font-bold text-navy mt-1">Golf Tournament</p>
                <p className="text-base md:text-lg text-navy/80 font-medium mt-1">Monday, October 19, 2026</p>
                <p className="text-base text-navy/70 font-medium">Annandale Golf Club · Madison, MS</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-5 text-base rounded-full shadow-xl flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Register Your Team
                    </Button>
                  </a>
                  <a href="mailto:info@mercyhouseatc.com">
                    <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-white px-8 py-5 text-base font-semibold rounded-full bg-white/50 backdrop-blur-sm">
                      <Mail className="mr-2 w-4 h-4" />
                      Sponsorship Inquiry
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Presented by */}
            <div className="flex flex-col items-center gap-2 md:items-end">
              <p className="text-navy font-semibold text-base tracking-wide">Presented by</p>
              <img
                src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/d820a2e7b_presentedbymachaik.png"
                alt="Mac Haik Ford Jackson"
                className="h-20 md:h-24 w-auto object-contain drop-shadow-lg"
              />
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
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#2d7a2d' }}>2026 Golf Classic</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Schedule */}
            <div>
              <p className="font-bold text-lg mb-3" style={{ color: '#2d7a2d' }}>Monday, October 19, 2026</p>
              <div className="space-y-3 text-slate-700">
                <div>
                  <p className="font-semibold">Morning Round</p>
                  <p className="text-slate-500 text-sm">8:00 AM (breakfast included)</p>
                </div>
                <div>
                  <p className="font-semibold">Lunch</p>
                  <p className="text-slate-500 text-sm">12:30 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Afternoon Round</p>
                  <p className="text-slate-500 text-sm">1:30 PM</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-4 italic">Tee-off preference is given on a first-come, first-served basis after payment.</p>
            </div>

            {/* Cost & Includes */}
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1"><sup className="text-xl">$</sup>1,000 per team</p>
              <p className="font-semibold text-slate-700 mb-3">What's Included:</p>
              <ul className="space-y-2">
                {['4 Man Scramble at Annandale Golf Club', 'Delicious Lunch', 'High Quality Golf Polo', 'Several Chances to Win Prizes'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission */}
            <div>
              <p className="text-xl font-bold mb-3" style={{ color: '#2d7a2d' }}>Helping Those Who Need A Mulligan In Life.</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                By participating in the Golf Classic, you are supporting the Mercy House ministry and giving hope to men and women who are seeking freedom from addiction.
              </p>
              <p className="text-slate-700 font-semibold text-sm mb-4">Help us change lives by reaching our goal of $125,000.</p>
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full flex items-center justify-center gap-2 py-5">
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
              <p className="text-slate-600">100 Annandale Golf Club Drive<br />Madison, MS 39110</p>
              <a href="https://maps.google.com/?q=100+Annandale+Golf+Club+Drive+Madison+MS+39110" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-medium hover:underline" style={{ color: '#2d7a2d' }}>
                Get Directions →
              </a>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-navy" />
                <p className="font-bold text-xl text-navy">Reunion Golf & Country Club</p>
              </div>
              <p className="text-slate-600">150 Greensward Dr<br />Madison, MS 39110</p>
              <a href="https://maps.google.com/?q=150+Greensward+Dr+Madison+MS+39110" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-medium hover:underline" style={{ color: '#2d7a2d' }}>
                Get Directions →
              </a>
            </div>
            <div className="flex-1">
              <p className="font-bold text-navy mb-2">Questions?</p>
              <a href="tel:6017203718" className="flex items-center gap-2 font-semibold text-slate-700 hover:underline">
                <Phone className="w-4 h-4" /> (601) 720-3718
              </a>
              <a href="mailto:info@mercyhouseatc.com" className="block mt-1 text-sm text-navy hover:underline">info@mercyhouseatc.com</a>
              <a href="mailto:khardin@mercyhouseatc.com" className="block mt-1 text-sm text-navy hover:underline">khardin@mercyhouseatc.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Sponsorships ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10" style={{ color: '#2d7a2d' }}>Team Sponsorships</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            {/* Platinum */}
            <div className="flex flex-col">
              <div className="bg-blue-500 text-white text-center font-bold text-lg py-4 tracking-widest">PLATINUM</div>
              <div className="flex-1 bg-white p-6 flex flex-col">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>5,000</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                    [true, '8 Golfers'],
                    [true, 'Website logo'],
                    [true, 'Testimony tee-box sign logo'],
                    [true, 'Branded feather banner'],
                    [true, 'Embroidered sleeve logo (limited availability)'],
                  ].map(([inc, label]) => (
                    <div key={label} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check included={inc} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gold */}
            <div className="flex flex-col">
              <div className="text-white text-center font-bold text-lg py-4 tracking-widest" style={{ background: '#c9a227' }}>GOLD</div>
              <div className="flex-1 bg-white p-6 flex flex-col border-l border-slate-100">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>2,500</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                    [true, '4 Golfers'],
                    [true, 'Website logo'],
                    [true, 'Testimony tee-box sign logo'],
                    [true, 'Branded feather banner'],
                    [false, 'Embroidered sleeve logo'],
                  ].map(([inc, label]) => (
                    <div key={label} className={`flex items-start gap-2 text-sm ${inc ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                      <Check included={inc} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Silver */}
            <div className="flex flex-col">
              <div className="bg-slate-400 text-white text-center font-bold text-lg py-4 tracking-widest">SILVER</div>
              <div className="flex-1 bg-white p-6 flex flex-col border-l border-slate-100">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>1,500</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                    [true, '4 Golfers'],
                    [true, 'Website logo'],
                    [true, 'Testimony tee-box sign logo'],
                    [false, 'Branded feather banner'],
                    [false, 'Embroidered sleeve logo'],
                  ].map(([inc, label]) => (
                    <div key={label} className={`flex items-start gap-2 text-sm ${inc ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                      <Check included={inc} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Only */}
            <div className="flex flex-col">
              <div className="bg-green-600 text-white text-center font-bold text-lg py-4 tracking-widest">TEAM ONLY</div>
              <div className="flex-1 bg-white p-6 flex flex-col border-l border-slate-100">
                <p className="text-4xl font-black text-slate-800 mb-1"><sup className="text-xl font-bold">$</sup>1,000</p>
                <div className="space-y-3 mt-4 flex-1">
                  {[
                    [true, '4 Golfers'],
                    [false, 'Website logo'],
                    [false, 'Testimony tee-box sign logo'],
                    [false, 'Branded feather banner'],
                    [false, 'Embroidered sleeve logo'],
                  ].map(([inc, label]) => (
                    <div key={label} className={`flex items-start gap-2 text-sm ${inc ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                      <Check included={inc} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-12 py-5 text-lg rounded-full flex items-center gap-2 shadow-lg">
                <ExternalLink className="w-5 h-5" />
                Register Now
              </Button>
            </a>
            <a href={BROCHURE_URL}>
              <Button variant="outline" className="border-2 border-slate-600 text-slate-700 hover:bg-slate-100 px-12 py-5 text-lg rounded-full font-semibold">
                📄 Download Brochure
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Add-on Sponsorships ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-3" style={{ color: '#2d7a2d' }}>Add-on Sponsorships</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10 text-sm leading-relaxed">
            Advertise your company's logo as the sole sponsor for any of the following add-ons. These can be added to a team sponsorship package above or purchased solo without a team. But hurry! Only one company per sponsorship.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* $2,500 */}
            <div>
              <p className="text-2xl font-bold mb-4" style={{ color: '#2d7a2d' }}><sup className="text-base">$</sup>2,500 each</p>
              <ul className="space-y-1">
                {['Closest to the Pin Sponsor', 'Longest Drive Sponsor', 'Golf Cannon Sponsor'].map(l => <AddonItem key={l} label={l} />)}
              </ul>
            </div>
            {/* $2,000 */}
            <div>
              <p className="text-2xl font-bold mb-4" style={{ color: '#2d7a2d' }}><sup className="text-base">$</sup>2,000 each</p>
              <ul className="space-y-1">
                {['Registration Tent Sponsor', 'Hospitality Tent Sponsor', 'Golf Cart Sponsor', 'Driving Range Sponsor', 'Putting Green Sponsor', 'Golf Ball Sponsor'].map(l => <AddonItem key={l} label={l} />)}
              </ul>
            </div>
            {/* $500 & $250 */}
            <div>
              <p className="text-2xl font-bold mb-4" style={{ color: '#2d7a2d' }}><sup className="text-base">$</sup>500 each</p>
              <ul className="space-y-1 mb-6">
                {['Testimony Tee-Box Sponsor'].map(l => <AddonItem key={l} label={l} />)}
              </ul>
              <p className="text-2xl font-bold mb-4" style={{ color: '#2d7a2d' }}><sup className="text-base">$</sup>250 each</p>
              <ul className="space-y-1">
                {['Welcome Sign Sponsor'].map(l => <AddonItem key={l} label={l} />)}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-10">
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="w-full max-w-sm">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 text-lg rounded-full flex items-center justify-center gap-2 shadow-lg">
                <ExternalLink className="w-5 h-5" />
                Register Now
              </Button>
            </a>
            <a href={BROCHURE_URL} className="w-full max-w-sm">
              <Button variant="outline" className="w-full border-2 border-slate-600 text-slate-700 hover:bg-slate-100 py-5 text-lg rounded-full font-semibold">
                📄 Download Brochure
              </Button>
            </a>
            <p className="text-xl font-bold mt-2" style={{ color: '#2d7a2d' }}>Questions? Call (601) 720-3718</p>
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
            <p className="text-center text-slate-400 text-sm mt-6 italic">More sponsors to be announced — <a href="mailto:info@mercyhouseatc.com" className="underline hover:text-navy">contact us to become a sponsor</a>.</p>
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
            <p className="text-slate-300 mb-6">Follow the action in real time on tournament day.</p>
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
              allowFullScreen
            />
          </div>
          <p className="text-center text-slate-400 text-xs mt-3">If the leaderboard doesn't load above, use the "Open Live Scores" button.</p>
        </div>
      </section>

      {/* ── Mission Banner ── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Play Golf. Change Lives.</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Every swing you take supports men and women finding freedom from life-controlling addiction.
            100% of individual donations go directly to Mercy House's mission of faith-based recovery.
          </p>
          <Link to={createPageUrl('Donate')}>
            <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-white px-8 py-4 text-lg font-semibold">
              Support the Mission
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}