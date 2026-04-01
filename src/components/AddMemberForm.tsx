import React, { useState, useEffect } from 'react';
import { PlusCircle, Save } from 'lucide-react';
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
          // Format local date correctly for input
          setDobDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
          setDobTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
        }
      } catch (e) {
        // Fallback
      }
      setAvatar(initialData.avatar || '');
    } else {
      setName('');
      setRelation('');
      setDobDate('');
      setDobTime('');
      setAvatar('');
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        alert("Image too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation || !dobDate) return;
    
    // Combine date and time (default to midnight if no time)
    const timeStr = dobTime || '00:00';
    const finalDateStr = `${dobDate}T${timeStr}:00`;
    
    // Ensure the date is valid before saving
    const parsedDate = new Date(finalDateStr);
    if (isNaN(parsedDate.getTime())) {
      alert("Please enter a valid date.");
      return;
    }

    onSave(name, relation, parsedDate.toISOString(), avatar, initialData?.id);
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
      <h3 className="text-xl font-bold font-mono text-slate-800 mb-4">{initialData ? 'Edit Family Member' : 'Add Family Member'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-slate-400 font-medium">Pic</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">Upload Picture (Optional, max 2MB)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Relation</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Brother, Mother, etc."
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-[2]">
            <label className="block text-sm font-medium text-slate-600 mb-1">Date of Birth</label>
            <input
              type="date"
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={dobDate}
              onChange={(e) => setDobDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">Time (Opt.)</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={dobTime}
              onChange={(e) => setDobTime(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 cursor-pointer"
          >
            {initialData ? <Save size={18} /> : <PlusCircle size={18} />}
            <span>{initialData ? 'Save Changes' : 'Add Member'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
