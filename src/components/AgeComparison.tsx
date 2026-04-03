import React, { useState } from 'react';
import type { FamilyMember } from '../types';
import { getExactAge } from '../utils/date';
import { Users, ArrowLeftRight, TrendingUp } from 'lucide-react';

interface Props {
  members: FamilyMember[];
}

export const AgeComparison: React.FC<Props> = ({ members }) => {
  const [centerId, setCenterId] = useState<string>(members[0]?.id || '');
  
  const centerMember = members.find(m => m.id === centerId);
  const now = new Date();

  const comparisons = members
    .filter(m => m.id !== centerId)
    .map(other => {
      const centerAge = getExactAge(new Date(centerMember!.dateOfBirth), now);
      const otherAge = getExactAge(new Date(other.dateOfBirth), now);
      
      const centerTotalDays = (now.getTime() - new Date(centerMember!.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24);
      const otherTotalDays = (now.getTime() - new Date(other.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24);
      
      const ratio = centerTotalDays / otherTotalDays;
      const isOlder = centerTotalDays > otherTotalDays;
      const ageDiffYears = Math.abs(centerAge.years - otherAge.years);

      return {
        member: other,
        ratio,
        isOlder,
        ageDiffYears
      };
    }).sort((a, b) => b.ratio - a.ratio);

  if (!centerMember) return null;

  return (
    <div className="glass-panel rounded-[2.5rem] p-6 md:p-10 mb-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <ArrowLeftRight size={160} />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2 drop-shadow-sm tracking-tighter">
            <ArrowLeftRight className="text-indigo-500" size={28} />
            Comparison Lab
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Relative Age & Perspective Engine</p>
        </div>
        
        <div className="flex items-center gap-3 glass-panel p-2 rounded-2xl border-white/30 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-3">Focus Person</span>
          <select 
            className="bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl px-4 py-2 font-black text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-md cursor-pointer transition-all hover:bg-white/20"
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
          >
            {members.map(m => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {comparisons.map((comp) => (
          <div key={comp.member.id} className="flex items-center gap-4 p-5 rounded-2xl glass-panel border-white/20 dark:border-white/5 bg-white/5 dark:bg-black/10 hover:glass-panel-heavy transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border-2 overflow-hidden shadow-lg transform transition-transform group-hover:scale-105" style={{ borderColor: comp.member.color }}>
              {comp.member.avatar ? (
                <img src={comp.member.avatar} alt={comp.member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold" style={{ color: comp.member.color }}>{comp.member.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-black text-slate-800 dark:text-white tracking-tight">{comp.member.name}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{comp.member.relation}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 font-black text-slate-900 dark:text-white">
                <TrendingUp size={16} className={comp.isOlder ? 'text-indigo-500' : 'text-rose-500 rotate-180'} />
                <span className="text-2xl tracking-tighter">{comp.ratio.toFixed(2)}x</span>
              </div>
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mt-1">
                {comp.isOlder ? `Older relative` : `Younger relative`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {comparisons.length === 0 && (
        <div className="text-center py-20 glass-panel-heavy rounded-2xl">
           <Users size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-6 drop-shadow-sm" />
           <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-sm">Add family members to activate the lab</p>
        </div>
      )}
    </div>
  );
};
