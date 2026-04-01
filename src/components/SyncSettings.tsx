import React, { useState } from 'react';
import { Cloud, Key, Save, X, ExternalLink, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSave: (config: { url: string; key: string; familyId: string }) => void;
  currentConfig: { url: string; key: string; familyId: string };
}

export const SyncSettings: React.FC<Props> = ({ onClose, onSave, currentConfig }) => {
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [familyId, setFamilyId] = useState(currentConfig.familyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ url, key, familyId });
    onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Cloud className="text-blue-500" size={28} />
            Cloud Sync Settings
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Keep your family data synced across all devices.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors opacity-50 hover:opacity-100 cursor-pointer">
          <X size={24} />
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex gap-3 text-blue-700 dark:text-blue-300 text-sm">
        <AlertCircle className="shrink-0" size={20} />
        <div>
          <p className="font-bold mb-1">How it works:</p>
          <p>Provide your Supabase credentials and a **Family Key**. Members with the same Family Key will see and sync the same family data.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Supabase Project URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            placeholder="https://xyz.supabase.co"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Supabase Anon Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Family Key (Shared Code)</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono font-bold"
              placeholder="e.g. THE-SMITH-FAMILY-2024"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={20} />
            Save & Connect
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <a 
          href="https://supabase.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1.5"
        >
          Setup Supabase for free <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
