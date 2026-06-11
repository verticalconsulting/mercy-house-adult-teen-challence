import React from 'react';
import { ShieldCheck, FileText, Phone, Mail, MapPin } from 'lucide-react';

export default function NonprofitLegitimacy({ variant = 'full' }) {
  const annualReport2023 = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6983b4b00291b5dfd8507106/94e81b0ea_Annual-Report_v2023.pdf';
  const annualReport2024 = 'https://drive.google.com/file/d/1nXKBoDu9NBTjiLXgmkfHXEZwMIurUxRb/view?usp=drive_link';

  if (variant === 'compact') {
    return (
      <div className="bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-xl px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-semibold text-navy dark:text-gold">
          <ShieldCheck className="w-4 h-4" />
          501(c)(3) Nonprofit
        </span>
        <span>EIN: 99-1943281</span>
        <span>Georgetown, MS</span>
        <a href="tel:8558937333" className="hover:text-navy dark:hover:text-gold transition-colors">855-89-FREEDOM</a>
        <a href="mailto:info@mercyhouseatc.com" className="hover:text-navy dark:hover:text-gold transition-colors">info@mercyhouseatc.com</a>
        <a
          href={annualReport2023}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-navy dark:text-gold font-semibold hover:underline"
        >
          <FileText className="w-4 h-4" />
          2023 Annual Report
        </a>
        <a
          href={annualReport2024}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-navy dark:text-gold font-semibold hover:underline"
        >
          <FileText className="w-4 h-4" />
          2024 Annual Report
        </a>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-navy dark:text-gold" />
        </div>
        <div>
          <h3 className="font-bold text-navy dark:text-gold text-lg leading-tight">Verified 501(c)(3) Nonprofit</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Mercy House Adult &amp; Teen Challenge of Mississippi</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
        <div className="space-y-2.5">
          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">EIN:</span> 99-1943281
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              P.O. Box 266<br />
              Georgetown, MS 39078
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Phone className="w-4 h-4 text-gold shrink-0" />
            <a href="tel:8558937333" className="hover:text-navy dark:hover:text-gold transition-colors">
              855-89-FREEDOM (855-893-7333)
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4 text-gold shrink-0" />
            <a href="mailto:info@mercyhouseatc.com" className="hover:text-navy dark:hover:text-gold transition-colors">
              info@mercyhouseatc.com
            </a>
          </div>
        </div>
      </div>

      {/* Financial Transparency */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Financial Transparency</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={annualReport2023}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy dark:bg-gold text-white dark:text-navy rounded-lg text-sm font-semibold hover:bg-navy/90 dark:hover:bg-gold/90 transition-colors"
          >
            <FileText className="w-4 h-4" />
            2023 Annual Report
          </a>
          <a
            href={annualReport2024}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy dark:bg-gold text-white dark:text-navy rounded-lg text-sm font-semibold hover:bg-navy/90 dark:hover:bg-gold/90 transition-colors"
          >
            <FileText className="w-4 h-4" />
            2024 Annual Report
          </a>
          <a
            href="mailto:info@mercyhouseatc.com?subject=Financial%20Documentation%20Request"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:border-navy dark:hover:border-gold hover:text-navy dark:hover:text-gold transition-colors"
          >
            <Mail className="w-4 h-4" />
            Request Form 990
          </a>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
          Financial documentation and IRS determination letter available upon request.
        </p>
      </div>
    </div>
  );
}