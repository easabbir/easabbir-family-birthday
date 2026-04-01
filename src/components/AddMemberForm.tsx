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
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 via-orange-500 to-rose-500"></div>
      
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
          {initialData ? 'Update Member' : 'New Member'}
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera size={24} className="text-slate-300" />
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Profile Photo</label>
            <p className="text-[10px] text-slate-500">Tap to upload (Max 2MB)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white"
              placeholder="e.g. John Smith"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Relationship</label>
            <input
              type="text" required value={relation} onChange={(e) => setRelation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white"
              placeholder="e.g. Brother, Cousin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Birth Date</label>
              <input
                type="date" required max={new Date().toISOString().split('T')[0]} value={dobDate} onChange={(e) => setDobDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Time (Optional)</label>
              <input
                type="time" value={dobTime} onChange={(e) => setDobTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {initialData ? <Save size={20} /> : <PlusCircle size={20} />}
            <span>{initialData ? 'Save Changes' : 'Add Member'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
