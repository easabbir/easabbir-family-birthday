import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X, Camera } from 'lucide-react';
import type { FamilyMember } from '../types';

interface Props {
  initialData?: FamilyMember | null;
  onSave: (name: string, relation: string, dob: string, avatar?: string, id?: string) => void;
  onClose: () => void;
}

export const AddMemberForm: React.FC<Props> = ({ initialData, onSave, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [relation, setRelation] = useState(initialData?.relation || '');
  const [dobDate, setDobDate] = useState('');
  const [dobTime, setDobTime] = useState('');
  const [avatar, setAvatar] = useState(initialData?.avatar || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRelation(initialData.relation);
      try {
        const d = new Date(initialData.dateOfBirth);
        if (!isNaN(d.getTime())) {
          setDobDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
          setDobTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
        }
      } catch (e) {}
      setAvatar(initialData.avatar || '');
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Image too large (max 2MB)");
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation || !dobDate) return;
    const timeStr = dobTime || '00:00';
    const finalDateStr = `${dobDate}T${timeStr}:00`;
    const parsedDate = new Date(finalDateStr);
    if (isNaN(parsedDate.getTime())) return alert("Please enter a valid date.");
    onSave(name, relation, parsedDate.toISOString(), avatar, initialData?.id);
  };

  return (
    <div className="glass-panel-heavy p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden w-full max-w-md border-white/40 dark:border-white/10">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white drop-shadow-sm">
          {initialData ? 'Update Profile' : 'New Member'}
        </h3>
        <button onClick={onClose} className="p-2 glass-button rounded-full text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-5 glass-panel p-4 rounded-2xl border-white/20 dark:border-white/5 bg-white/5 dark:bg-black/10">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl glass-panel-heavy flex items-center justify-center border-2 border-dashed border-white/40 dark:border-white/10 overflow-hidden group-hover:scale-105 transition-all">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera size={24} className="text-slate-400" />
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Profile Photo</label>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Tap to upload (Max 2MB)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Full Name</label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder-slate-400"
              placeholder="e.g. John Smith"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Relationship</label>
            <input
              type="text" required value={relation} onChange={(e) => setRelation(e.target.value)}
              className="w-full px-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder-slate-400"
              placeholder="e.g. Brother, Cousin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Birth Date</label>
              <input
                type="date" required max={new Date().toISOString().split('T')[0]} value={dobDate} onChange={(e) => setDobDate(e.target.value)}
                className="w-full px-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Time (Optional)</label>
              <input
                type="time" value={dobTime} onChange={(e) => setDobTime(e.target.value)}
                className="w-full px-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/30"
          >
            {initialData ? <Save size={20} /> : <PlusCircle size={20} />}
            <span>{initialData ? 'Save Changes' : 'Confirm Membership'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
