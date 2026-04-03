import React, { useState } from 'react';
import { Cloud, Key, X, ExternalLink, AlertCircle } from 'lucide-react';

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
    <div className="glass-panel-heavy p-8 rounded-[2.5rem] shadow-2xl border-white/40 dark:border-white/10 w-full max-w-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Cloud size={160} />
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2 drop-shadow-sm tracking-tighter">
            <Cloud className="text-indigo-500" size={32} />
            Cloud Sync
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time Data Persistence Engine</p>
        </div>
        <button onClick={onClose} className="p-2 glass-button rounded-full text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer">
          <X size={24} />
        </button>
      </div>

      <div className="mb-6 p-5 glass-panel border-indigo-400/20 dark:border-indigo-500/10 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-2xl flex gap-4 text-indigo-700 dark:text-indigo-300 text-sm backdrop-blur-md">
        <AlertCircle className="shrink-0 text-indigo-500" size={22} />
        <div>
          <p className="font-black uppercase tracking-widest text-[10px] mb-1">Architecture Overview</p>
          <p className="text-[11px] leading-relaxed opacity-80">Connected via Supabase Realtime. Use a unique **Family Key** to bridge data between devices instantly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Project Endpoint URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder-slate-400"
            placeholder="https://your-id.supabase.co"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">API Authentication Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder-slate-400"
            placeholder="Supabase Anon Key"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Family Key (Unique ID)</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500/50" size={18} />
            <input
              type="text"
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 glass-panel rounded-xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-mono font-black tracking-tighter dark:text-white"
              placeholder="e.g. MISSION-CONTROL-2026"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/30"
          >
            <Cloud size={20} />
            Establish Connection
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <a 
          href="https://supabase.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
        >
          Infrastructure by Supabase <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
