import React from 'react';
import { Shield, Award, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import CTABand from '../components/CTABand';
import NonprofitLegitimacy from '../components/NonprofitLegitimacy';

const annualReports = [
  {
    year: '2024',
    label: '2024 Annual Report',
    url: 'https://drive.google.com/file/d/1nXKBoDu9NBTjiLXgmkfHXEZwMIurUxRb/view?usp=drive_link',
  },
  // Add more years here as they become available
];

export default function Financials() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-900 py-24 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">Accountability & Transparency</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Financial Transparency</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            As a faith-based nonprofit, we are committed to the highest standards of stewardship and transparency. Every dollar entrusted to us is managed with integrity.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Verified & Certified</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Our Credentials</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Mercy House Adult &amp; Teen Challenge meets the highest standards for nonprofit accountability and transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {/* 501(c)(3) */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-navy/10 dark:bg-gold/10 rounded-2xl flex items-center justify-center mb-5">
                <Shield className="w-8 h-8 text-navy dark:text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">IRS 501(c)(3)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Officially recognized as a tax-exempt nonprofit organization by the Internal Revenue Service. Donations are tax-deductible to the fullest extent of the law.
              </p>
              <div className="mt-auto flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" />
                Verified
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">EIN: 45-4670832</p>
            </div>

            {/* Candid Platinum */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-navy/10 dark:bg-gold/10 rounded-2xl flex items-center justify-center mb-5">
                <Award className="w-8 h-8 text-navy dark:text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">Candid Platinum Transparency</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Awarded Candid's highest Seal of Transparency — Platinum level — recognizing our commitment to publicly sharing financial and programmatic information.
              </p>
              <div className="mt-auto">
                <a
                  href="https://app.candid.org/profile/9237605/mercy-house-teen-challenge-45-4670832/?pkId=85b52dd6-b112-4838-af55-83779d6afa0f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center"
                >
                  <img
                    src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/9237605/svg"
                    alt="Candid Platinum Seal of Transparency"
                    className="h-20 w-auto"
                  />
                </a>
              </div>
            </div>

            {/* Adult & Teen Challenge Affiliation */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-navy/10 dark:bg-gold/10 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-navy dark:text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">Adult &amp; Teen Challenge Affiliated</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Affiliated with Adult &amp; Teen Challenge, one of the world's largest faith-based recovery organizations operating in over 100 countries, providing a proven framework and accountability structure.
              </p>
              <div className="mt-auto flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" />
                Affiliated Member
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Funds Are Used */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Stewardship</p>
            <h2 className="text-3xl font-bold text-navy dark:text-gold mb-4">How Your Donation Is Used</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Mercy House Adult &amp; Teen Challenge of Mississippi is committed to transparent stewardship of every gift. Our micro-business operations — including our thrift store, vehicle donation program, and auto academy — generate revenue that helps support ministry operations alongside individual donor contributions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { emoji: '🏠', label: 'Housing & Facilities', desc: 'Safe, stable residential housing for men and women throughout their program stay' },
              { emoji: '🍽️', label: 'Meals & Nutrition', desc: 'Three meals per day provided to every resident at no cost to them' },
              { emoji: '📖', label: 'Program & Ministry', desc: 'Biblical teaching, counseling, life skills training, and vocational development' },
              { emoji: '⚙️', label: 'Daily Operations', desc: 'Utilities, staff, transportation, and the essential infrastructure that keeps us running' },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 text-center shadow-sm">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h4 className="font-bold text-navy dark:text-gold text-sm mb-1">{item.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Reports</p>
            <h2 className="text-3xl font-bold text-navy dark:text-gold mb-4">Annual Reports</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Download our annual reports to review our programs, impact, and financial stewardship.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            {annualReports.map((report) => (
              <a
                key={report.year}
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-navy dark:hover:border-gold transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-navy dark:text-gold" />
                  </div>
                  <div>
                    <div className="font-bold text-navy dark:text-gold">{report.label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">PDF — Google Drive</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-navy dark:group-hover:text-gold transition-colors" />
              </a>
            ))}
          </div>

          <div className="bg-navy dark:bg-slate-950 rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold text-gold mb-3">Request Additional Documentation</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our IRS Form 990, audited financials, and other documentation are available upon request.
            </p>
            <a
              href="mailto:info@mercyhouseatc.com"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
            >
              Request Documents
            </a>
          </div>
        </div>
      </section>

      {/* Nonprofit Legitimacy */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NonprofitLegitimacy />
        </div>
      </section>

      <CTABand
        heading="Support Our Mission"
        subtext="Your gift is tax-deductible and goes directly to housing, meals, program care, and ministry operations."
        primaryLabel="Donate Now"
        primaryTo="/Donate"
        secondaryLabel="Learn About Our Programs"
        secondaryTo="/Programs"
      />
    </div>
  );
}