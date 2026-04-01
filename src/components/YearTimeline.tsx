import React, { useMemo } from 'react';
import type { FamilyMember } from '../types';
import { getDayOfYear, getDaysInYear } from 'date-fns';

interface Props {
  members: FamilyMember[];
}

export const YearTimeline: React.FC<Props> = ({ members }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const daysInYear = getDaysInYear(now);
  const currentDayOfYear = getDayOfYear(now);
  const todayPercentage = (currentDayOfYear / daysInYear) * 100;

  const markers = useMemo(() => {
    return members.map(member => {
      const dob = new Date(member.dateOfBirth);
      if (isNaN(dob.getTime())) return null;

      // Plot their birthday in the current calendar year
      const bdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
      const dayOfYear = getDayOfYear(bdayThisYear);
      const percentage = (dayOfYear / daysInYear) * 100;
      
      const isPast = dayOfYear < currentDayOfYear;

      return {
        id: member.id,
        member,
        percentage,
        isPast
      };
    }).filter(Boolean);
  }, [members, currentYear, daysInYear, currentDayOfYear]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate approximate start percentage for each month
  const monthMarkers = months.map((month, index) => {
    const d = new Date(currentYear, index, 1);
    return {
      label: month,
      percentage: (getDayOfYear(d) / daysInYear) * 100
    };
  });

  if (members.length === 0) return null;

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 relative">
      <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        {currentYear} Birthday Timeline
      </h3>

      <div className="overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div className="relative w-full min-w-[320px] h-12 mt-4 mb-2">
          {/* The main line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 rounded-full -translate-y-1/2"></div>
          
          {/* The elapsed line representing how much of the year has passed */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-100 rounded-full -translate-y-1/2"
            style={{ width: `${todayPercentage}%` }}
          ></div>

          {/* Month ticks */}
          {monthMarkers.map((m) => (
            <div 
              key={m.label} 
              className="absolute top-1/2 w-px h-3 bg-slate-200 -translate-y-1/2"
              style={{ left: `${m.percentage}%` }}
            >
              <span className="absolute top-4 -translate-x-1/2 text-[9px] md:text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                {m.label}
              </span>
            </div>
          ))}

          {/* Today Marker */}
          <div 
            className="absolute top-1/2 w-0.5 h-6 bg-blue-500 -translate-y-1/2 z-10"
            style={{ left: `${todayPercentage}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 pointer-events-none">
              TODAY
            </span>
          </div>

          {/* Member Birthday Markers */}
          {markers.map((marker) => {
            if (!marker) return null;
            return (
              <div 
                key={marker.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group z-20 cursor-pointer transition-transform hover:scale-110 hover:z-30"
                style={{ left: `${marker.percentage}%` }}
                title={`${marker.member.name}'s Birthday`}
              >
                <div 
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white font-mono shadow-sm overflow-hidden border-2 ${marker.isPast ? 'border-slate-300 opacity-60' : 'border-white ring-2 ring-slate-100'}`}
                  style={{ backgroundColor: marker.member.color }}
                >
                  {marker.member.avatar ? (
                    <img src={marker.member.avatar} alt={marker.member.name} className={`w-full h-full object-cover ${marker.isPast ? 'grayscale' : ''}`} />
                  ) : (
                    marker.member.name.charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50">
                  {marker.member.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
