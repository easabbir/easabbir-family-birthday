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
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 mb-12 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowLeftRight className="text-orange-500" size={24} />
            Age Comparison Lab
          </h2>
          <p className="text-slate-500 font-medium">Compare relative ages and life ratios.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2">Center Person</span>
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20"
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {comparisons.map((comp) => (
          <div key={comp.member.id} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 overflow-hidden shadow-sm" style={{ borderColor: comp.member.color }}>
              {comp.member.avatar ? (
                <img src={comp.member.avatar} alt={comp.member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold" style={{ color: comp.member.color }}>{comp.member.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">{comp.member.name}</h4>
              <p className="text-xs text-slate-500 font-medium">{comp.member.relation}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 font-black text-slate-900">
                <TrendingUp size={16} className={comp.isOlder ? 'text-orange-500' : 'text-blue-500 rotate-180'} />
                <span className="text-xl">{comp.ratio.toFixed(2)}x</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {comp.isOlder ? `Older than ${comp.member.name}` : `Younger than ${comp.member.name}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {comparisons.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
           <Users size={48} className="mx-auto text-slate-300 mb-4" />
           <p className="text-slate-500 font-medium">Add more family members to compare ages!</p>
        </div>
      )}
    </div>
  );
};
