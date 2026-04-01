import React, { useState, useEffect } from 'react';
import { Gift, PartyPopper } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, addYears, isSameDay } from 'date-fns';
import type { FamilyMember } from '../types';

interface Props {
  members: FamilyMember[];
}

export const NextUpWidget: React.FC<Props> = ({ members }) => {
  const [nextMember, setNextMember] = useState<FamilyMember | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    if (members.length === 0) return;

    const calculateNext = () => {
      const now = new Date();
      
      const upcoming = members.map(m => {
        const dob = new Date(m.dateOfBirth);
        const thisYearBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate(), dob.getHours(), dob.getMinutes());
        
        // If birthday already passed this year, look at next year
        let nextBday = thisYearBday;
        if (thisYearBday < now && !isSameDay(thisYearBday, now)) {
          nextBday = addYears(thisYearBday, 1);
        }

        return { member: m, nextBday, diff: nextBday.getTime() - now.getTime() };
      }).sort((a, b) => a.diff - b.diff)[0];

      if (upcoming) {
        setNextMember(upcoming.member);
        const bday = upcoming.nextBday;
        
        if (isSameDay(bday, now)) {
          setIsBirthday(true);
        } else {
          setIsBirthday(false);
          const days = differenceInDays(bday, now);
          const hours = differenceInHours(bday, now) % 24;
          const minutes = differenceInMinutes(bday, now) % 60;
          const seconds = differenceInSeconds(bday, now) % 60;
          setTimeLeft({ days, hours, minutes, seconds });
        }
      }
    };

    calculateNext();
    const interval = setInterval(calculateNext, 1000);
    return () => clearInterval(interval);
  }, [members]);

  if (!nextMember) return null;

  return (
    <div className={`mb-8 overflow-hidden rounded-3xl border transition-all duration-500 bg-linear-to-r ${
      isBirthday 
      ? 'from-pink-500 to-orange-500 text-white border-transparent shadow-xl animate-pulse ring-4 ring-orange-500/20' 
      : 'from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700 shadow-lg'
    }`}>
      <div className="flex flex-col md:flex-row p-6 md:p-8 items-center justify-between gap-6 relative">
        {/* Background Icons Decor */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Gift size={120} />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
          <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shrink-0 overflow-hidden shadow-md ${
            isBirthday ? 'border-white' : 'border-slate-700'
          }`}>
            {nextMember.avatar ? (
              <img src={nextMember.avatar} alt={nextMember.name} className="w-full h-full object-cover" />
            ) : (
             <span className="text-2xl font-bold">{nextMember.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block ${
              isBirthday ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'
            }`}>
              {isBirthday ? 'CELEBRATING TODAY' : 'NEXT BIRTHDAY'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {nextMember.name}'s Celebration
            </h2>
            <p className={`mt-1 font-medium ${isBirthday ? 'text-white/80' : 'text-slate-400'}`}>
              {isBirthday 
                ? `Happy Birthday, ${nextMember.name}! Today is the big day!` 
                : `Coming up on ${new Date(nextMember.dateOfBirth).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`}
            </p>
          </div>
        </div>

        {!isBirthday && (
          <div className="grid grid-cols-4 gap-3 md:gap-5 z-10">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hrs', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds },
            ].map(unit => (
              <div key={unit.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[80px] flex flex-col items-center border border-white/10">
                <span className="text-xl md:text-2xl font-mono font-bold leading-none">{String(unit.value).padStart(2, '0')}</span>
                <span className="text-[10px] md:text-xs uppercase font-bold text-white/50 mt-1">{unit.label}</span>
              </div>
            ))}
          </div>
        )}

        {isBirthday && (
          <div className="flex items-center gap-3 z-10 px-8 py-3 bg-white text-orange-600 rounded-full font-bold shadow-lg animate-bounce">
            <PartyPopper size={24} />
            <span>It's Party Time!</span>
          </div>
        )}
      </div>
    </div>
  );
};
