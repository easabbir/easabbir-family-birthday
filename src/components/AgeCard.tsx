import { useEffect, useState } from 'react';
import type { FamilyMember } from '../types';
import { getExactAge, getYearProgress, getDaysToNextBirthday, type AgeBreakdown } from '../utils/date';
import { InfographicProgressBar } from './InfographicProgressBar';
import { Calendar, User, Clock, Trash2, Pencil } from 'lucide-react';

interface Props {
  member: FamilyMember;
  onRemove: (id: string) => void;
  onEdit: (member: FamilyMember) => void;
}

export const AgeCard: React.FC<Props> = ({ member, onRemove, onEdit }) => {
  const [age, setAge] = useState<AgeBreakdown | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [daysToNext, setDaysToNext] = useState<number>(0);
  const [isInvalidDate, setIsInvalidDate] = useState(false);

  useEffect(() => {
    // Initial calculation
    const dob = new Date(member.dateOfBirth);
    if (isNaN(dob.getTime())) {
      setIsInvalidDate(true);
      return;
    }
    setIsInvalidDate(false);

    setAge(getExactAge(dob, new Date()));
    setProgress(getYearProgress(dob, new Date()));
    setDaysToNext(getDaysToNextBirthday(dob, new Date()));

    const interval = setInterval(() => {
      const currentTime = new Date();
      setAge(getExactAge(dob, currentTime));
      setProgress(getYearProgress(dob, currentTime));
      setDaysToNext(getDaysToNextBirthday(dob, currentTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [member.dateOfBirth]);

  if (isInvalidDate) {
    return (
      <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6 flex flex-col relative group">
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => onEdit(member)}
            className="text-red-300 hover:text-blue-500 transition-colors"
            aria-label="Edit member"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => onRemove(member.id)}
            className="text-red-300 hover:text-red-600 transition-colors"
            aria-label="Remove member"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="text-red-700 font-medium">Invalid date for {member.name}. Please edit the date.</div>
      </div>
    );
  }

  if (!age) return null;

  const dataPoints = [
    { label: 'Years', value: age.years, highlight: true },
    { label: 'Months', value: age.months },
    { label: 'Days', value: age.days },
    { label: 'Hours', value: age.hours },
    { label: 'Minutes', value: age.minutes },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] group relative">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: member.color }}
      />
      
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={() => onEdit(member)}
          className="text-slate-300 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Edit member"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => onRemove(member.id)}
          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Remove member"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base text-white font-mono shadow-sm flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: member.color }}
          >
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              member.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <User size={18} className="text-slate-400" />
              {member.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 font-medium">
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${member.color}15`, color: member.color }}>
                {member.relation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(member.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
              </span>
            </div>
          </div>
        </div>

        {/* Dense Data Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-5">
          {dataPoints.map((point) => (
            <div 
              key={point.label} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border \${point.highlight ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'} shadow-sm relative overflow-hidden`}
            >
              {point.highlight && (
                <div 
                  className="absolute top-0 left-0 w-full h-0.5 opacity-50"
                  style={{ backgroundColor: member.color }}
                />
              )}
              <span className="text-xl font-mono font-bold text-slate-800">
                {String(point.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-1">
                {point.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-700 font-medium mb-3">
             <Clock size={16} style={{ color: member.color }} />
             <span>Time visualization</span>
          </div>
          <InfographicProgressBar percentage={progress} color={member.color} daysToNext={daysToNext} />
        </div>
      </div>
    </div>
  );
};
