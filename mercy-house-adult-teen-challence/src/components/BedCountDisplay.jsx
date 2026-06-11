import React from 'react';
import { Users, Bed, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function BedCountDisplay({ bedData, programName }) {
  if (!bedData) return null;

  const availableBeds = bedData.total_beds - bedData.occupied_beds;
  const occupancyRate = ((bedData.occupied_beds / bedData.total_beds) * 100).toFixed(0);

  return (
    <Card className="bg-white dark:bg-slate-800 border-navy/10 dark:border-gold/20 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-navy dark:text-gold mb-4">
          {programName} Availability
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-navy dark:text-gold" />
            </div>
            <div className="text-2xl font-bold text-navy dark:text-white">
              {bedData.occupied_beds}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Current Residents
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Bed className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {availableBeds}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Open Beds
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {bedData.waitlist_count || 0}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Waiting List
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span>Occupancy Rate</span>
            <span className="font-semibold">{occupancyRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <div
              className="bg-navy dark:bg-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}