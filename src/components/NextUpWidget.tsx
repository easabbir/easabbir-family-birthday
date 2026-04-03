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
    <div className={`mb-8 overflow-hidden rounded-[2.5rem] border transition-all duration-500 bg-linear-to-r relative ${
      isBirthday 
      ? 'glass-panel-heavy from-pink-500/40 to-orange-500/40 text-white border-orange-400/50 shadow-[0_0_40px_rgba(249,115,22,0.3)] animate-pulse' 
      : 'glass-panel from-indigo-500/10 via-purple-500/5 to-pink-500/10 text-slate-900 dark:text-white border-white/20 dark:border-white/10 shadow-xl'
    }`}>
      <div className="flex flex-col md:flex-row p-6 md:p-8 items-center justify-between gap-6 relative">
        {/* Background Icons Decor */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Gift size={120} />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
          <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center shrink-0 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
            isBirthday ? 'border-white/50 bg-white/20' : 'border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/20'
          }`}>
            {nextMember.avatar ? (
              <img src={nextMember.avatar} alt={nextMember.name} className="w-full h-full object-cover" />
            ) : (
             <span className="text-2xl font-bold">{nextMember.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 inline-block shadow-sm backdrop-blur-md border ${
              isBirthday ? 'bg-white/30 text-white border-white/40' : 'bg-indigo-500 text-white border-indigo-400/30'
            }`}>
              {isBirthday ? 'CELEBRATING TODAY' : 'NEXT UP'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter drop-shadow-sm transition-all duration-300">
              {nextMember.name}'s Celebration
            </h2>
            <p className={`mt-1 font-bold uppercase tracking-widest text-[10px] md:text-sm ${isBirthday ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
              {isBirthday 
                ? `Happy Birthday! Today is the big day!` 
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
              <div key={unit.label} className="glass-panel rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[80px] flex flex-col items-center border border-white/30 dark:border-white/10 hover:glass-panel-heavy transition-all duration-300">
                <span className="text-xl md:text-2xl font-mono font-black text-slate-800 dark:text-white leading-none drop-shadow-sm">{String(unit.value).padStart(2, '0')}</span>
                <span className="text-[10px] md:text-xs uppercase font-black text-slate-500 dark:text-slate-400 mt-2 tracking-widest">{unit.label}</span>
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
