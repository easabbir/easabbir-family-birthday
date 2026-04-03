import { useEffect, useState } from 'react';
import type { FamilyMember } from '../types';
import { getExactAge, getYearProgress, getDaysToNextBirthday, type AgeBreakdown } from '../utils/date';
import { InfographicProgressBar } from './InfographicProgressBar';
import { Clock, Trash2, Pencil, PartyPopper, Star, Download } from 'lucide-react';
import { downloadICS } from '../utils/calendar';
import { isSameDay } from 'date-fns';

interface Props {
  member: FamilyMember;
  onRemove: (id: string) => void;
  onEdit: (member: FamilyMember) => void;
}

const MILESTONES = [1, 5, 10, 13, 16, 18, 20, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100];

export const AgeCard: React.FC<Props> = ({ member, onRemove, onEdit }) => {
  const [age, setAge] = useState<AgeBreakdown | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [daysToNext, setDaysToNext] = useState<number>(0);
  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const dob = new Date(member.dateOfBirth);
    if (isNaN(dob.getTime())) {
      setIsInvalidDate(true);
      return;
    }
    setIsInvalidDate(false);

    const update = () => {
      const now = new Date();
      setAge(getExactAge(dob, now));
      setProgress(getYearProgress(dob, now));
      setDaysToNext(getDaysToNextBirthday(dob, now));
      
      const bdayThisYear = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
      setIsBirthday(isSameDay(bdayThisYear, now));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [member.dateOfBirth]);

  if (isInvalidDate) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 p-6 flex flex-col relative group">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => onEdit(member)} className="text-red-300 hover:text-blue-500 transition-colors cursor-pointer"><Pencil size={18} /></button>
          <button onClick={() => onRemove(member.id)} className="text-red-300 hover:text-red-600 transition-colors cursor-pointer"><Trash2 size={18} /></button>
        </div>
        <div className="text-red-700 dark:text-red-400 font-medium">Invalid date for {member.name}. Please edit.</div>
      </div>
    );
  }

  if (!age) return null;

  const nextMilestone = MILESTONES.find(m => m > age.years);
  const isMilestoneUpcoming = nextMilestone && (nextMilestone - age.years === 1) && (daysToNext < 60);

  const dataPoints = [
    { label: 'Years', value: age.years, highlight: true },
    { label: 'Months', value: age.months },
    { label: 'Days', value: age.days },
    { label: 'Hrs', value: age.hours },
    { label: 'Min', value: age.minutes },
  ];

  return (
    <div className={`relative flex flex-col transition-all duration-500 rounded-3xl border overflow-hidden group
      ${isBirthday 
        ? 'glass-panel-heavy border-orange-400/50 dark:border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-[1.02] z-10' 
        : 'glass-panel hover:glass-panel-heavy'}
    `}>
      {/* Accent Line */}
      <div className="h-2 w-full" style={{ backgroundColor: isBirthday ? '#f97316' : member.color }} />
      
      {/* Floating Actions */}
      <div className="absolute top-4 right-4 flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={() => downloadICS(member)}
          className="p-2 glass-button text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg cursor-pointer"
          title="Add to Calendar"
        >
          <Download size={16} />
        </button>
        <button 
          onClick={() => onEdit(member)}
          className="p-2 glass-button text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg cursor-pointer"
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={() => onRemove(member.id)}
          className="p-2 glass-button text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-6 md:p-7">
        <div className="flex items-start gap-4 mb-6">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shrink-0 overflow-hidden relative"
            style={{ backgroundColor: member.color }}
          >
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              member.name.charAt(0).toUpperCase()
            )}
            {isBirthday && (
              <div className="absolute inset-0 bg-black/10 animate-pulse flex items-center justify-center">
                <PartyPopper size={24} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight truncate flex items-center gap-2 drop-shadow-sm">
              {member.name}
              {isBirthday && <PartyPopper className="text-orange-500 shrink-0 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" size={20} />}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-sm backdrop-blur-sm" style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                {member.relation}
              </span>
              {isMilestoneUpcoming && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 border border-yellow-400/30 backdrop-blur-sm">
                  <Star size={10} fill="currentColor" />
                  Big {nextMilestone}!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Precise Age Grid */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {dataPoints.map((point) => (
            <div 
              key={point.label} 
              className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-colors backdrop-blur-md
                ${point.highlight 
                  ? 'bg-white/20 dark:bg-white/10 border-white/40 dark:border-white/20 shadow-inner' 
                  : 'bg-white/5 dark:bg-black/10 border-white/10 dark:border-white/5'}`}
            >
              <span className={`text-xl font-mono font-black leading-none ${point.highlight ? 'text-slate-800 dark:text-white drop-shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>
                {String(point.value).padStart(2, '0')}
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400 mt-2">
                {point.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
               <Clock size={14} />
               <span>Year Progress</span>
            </div>
            <div className="text-slate-800 dark:text-slate-200 drop-shadow-sm">{progress.toFixed(1)}%</div>
          </div>
          <InfographicProgressBar percentage={progress} color={isBirthday ? '#f97316' : member.color} daysToNext={daysToNext} />
        </div>
      </div>
    </div>
  );
};
