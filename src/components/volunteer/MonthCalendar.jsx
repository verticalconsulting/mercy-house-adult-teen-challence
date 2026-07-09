import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format, addMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday
} from 'date-fns';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthCalendar({ events, currentMonth, onMonthChange, selectedDate, onSelectDate }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  const eventsByDay = {};
  for (const e of events) {
    if (!e.start) continue;
    const key = format(new Date(e.start), 'yyyy-MM-dd');
    if (!eventsByDay[key]) eventsByDay[key] = [];
    eventsByDay[key].push(e);
  }

  const rows = [];
  let day = gridStart;
  while (day <= gridEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onMonthChange(addMonths(currentMonth, -1))} aria-label="Previous month">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { onMonthChange(new Date()); onSelectDate(new Date()); }}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMonthChange(addMonths(currentMonth, 1))} aria-label="Next month">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 py-2">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {rows.flat().map((d) => {
          const key = format(d, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[key] || [];
          const inMonth = isSameMonth(d, currentMonth);
          const isSel = selectedDate && isSameDay(d, selectedDate);
          const today = isToday(d);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(d)}
              className={`min-h-[4.5rem] sm:min-h-24 p-1.5 rounded-lg border text-left flex flex-col gap-1 transition-colors ${
                isSel
                  ? 'border-gold ring-2 ring-gold bg-gold/10'
                  : inMonth
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-navy dark:hover:border-gold'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400'
              }`}
              aria-label={format(d, 'EEEE, MMMM d, yyyy') + (dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : '')}
            >
              <span className={`text-sm font-semibold inline-flex items-center justify-center ${today ? 'bg-navy text-white rounded-full w-6 h-6' : 'text-slate-700 dark:text-slate-200'}`}>
                {format(d, 'd')}
              </span>
              <span className="flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 2).map((e, i) => {
                  const hasVols = e.volunteer_count > 0;
                  return (
                    <span
                      key={i}
                      className={`text-xs px-1.5 py-0.5 rounded truncate ${hasVols ? 'bg-gold text-navy font-medium' : 'bg-navy/10 text-navy dark:bg-navy dark:text-white'}`}
                      title={e.title}
                    >
                      {e.all_day ? '' : format(new Date(e.start), 'h:mma') + ' '}
                      {e.title}
                    </span>
                  );
                })}
                {dayEvents.length > 2 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 px-1">+{dayEvents.length - 2} more</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}