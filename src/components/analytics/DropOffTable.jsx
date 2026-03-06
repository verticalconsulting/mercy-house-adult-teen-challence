import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function DropOffTable({ steps }) {
  if (!steps || steps.length < 2) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Funnel drop-off analysis">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Step</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Users</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Drop-off</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Retained</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, i) => {
            const prev = steps[i - 1];
            const dropOff = prev ? prev.value - step.value : 0;
            const dropOffPct = prev ? ((dropOff / prev.value) * 100).toFixed(1) : null;
            const retainedPct = prev ? (((step.value / prev.value) * 100).toFixed(1)) : '100';
            const isBigDrop = dropOffPct && parseFloat(dropOffPct) > 50;

            return (
              <tr key={step.name} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4 font-medium text-navy dark:text-gold">{step.name}</td>
                <td className="py-3 px-4 text-right font-mono">{step.value.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  {dropOffPct !== null ? (
                    <span className={`inline-flex items-center gap-1 font-semibold ${isBigDrop ? 'text-red-600' : 'text-amber-600'}`}>
                      <TrendingDown className="w-4 h-4" aria-hidden="true" />
                      -{dropOffPct}%
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold">
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    {retainedPct}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}