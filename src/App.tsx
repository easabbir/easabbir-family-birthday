import { useState, useEffect, useCallback } from 'react';
import { AddMemberForm } from './components/AddMemberForm';
import { AgeCard } from './components/AgeCard';
import { YearTimeline } from './components/YearTimeline';
import { NextUpWidget } from './components/NextUpWidget';
import { AgeComparison } from './components/AgeComparison';
import { SyncSettings } from './components/SyncSettings';
import type { FamilyMember } from './types';
import { getRandomColor } from './utils/colors';
import { Plus, Users, Cloud, Sun, Moon, Download, Upload, LayoutDashboard, ArrowLeftRight, Settings } from 'lucide-react';
import { initSupabase, getSupabase } from './lib/supabase';
import confetti from 'canvas-confetti';
import { isSameDay } from 'date-fns';

function App() {
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const stored = localStorage.getItem('familyMembers');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'comparison'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [syncConfig, setSyncConfig] = useState(() => {
    const saved = localStorage.getItem('syncConfig');
    return saved ? JSON.parse(saved) : { 
      url: import.meta.env.VITE_SUPABASE_URL || '', 
      key: import.meta.env.VITE_SUPABASE_ANON_KEY || '', 
      familyId: 'default' 
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const syncWithSupabase = useCallback(async (data: FamilyMember[]) => {
    const supabase = getSupabase();
    if (!supabase || !syncConfig.familyId) return;
    setIsSyncing(true);
    try {
      const payload = data.map(m => ({ 
        ...m, family_id: syncConfig.familyId, last_updated: m.last_updated || Date.now() 
      }));
      const { error } = await supabase.from('family_members').upsert(payload);
      if (error) console.error('Sync error:', error);
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [syncConfig.familyId]);

  useEffect(() => {
    localStorage.setItem('syncConfig', JSON.stringify(syncConfig));
    const supabase = initSupabase(syncConfig.url, syncConfig.key);
    if (supabase && syncConfig.familyId) {
      setIsSyncing(true);
      supabase.from('family_members').select('*').eq('family_id', syncConfig.familyId)
      .then(({ data, error }) => {
        if (!error && data) {
          setMembers(prev => {
            const merged = [...prev];
            data.forEach((remote: any) => {
              const localIndex = merged.findIndex(m => m.id === remote.id);
              if (localIndex === -1) merged.push(remote as FamilyMember);
              else if ((remote.last_updated || 0) > (merged[localIndex].last_updated || 0)) {
                merged[localIndex] = remote as FamilyMember;
              }
            });
            return merged;
          });
        }
        setIsSyncing(false);
      });
    }
  }, [syncConfig.url, syncConfig.key, syncConfig.familyId]);

  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(members));
    const timer = setTimeout(() => syncWithSupabase(members), 2000);
    return () => clearTimeout(timer);
  }, [members, syncWithSupabase]);

  useEffect(() => {
    const now = new Date();
    const hasBirthday = members.some(m => {
      const d = new Date(m.dateOfBirth);
      return isSameDay(new Date(now.getFullYear(), d.getMonth(), d.getDate()), now);
    });
    if (hasBirthday) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const p = 50 * (timeLeft / duration);
        confetti({ particleCount: p, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, startVelocity: 30, spread: 360, zIndex: 1000 });
        confetti({ particleCount: p, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, startVelocity: 30, spread: 360, zIndex: 1000 });
      }, 250);
    }
  }, [members]);

  const handleSaveMember = (name: string, relation: string, dob: string, avatar?: string, id?: string) => {
    const now = Date.now();
    if (id) {
      setMembers(members.map(m => m.id === id ? { ...m, name, relation, dateOfBirth: dob, avatar, last_updated: now } : m));
    } else {
      setMembers([...members, {
        id: crypto.randomUUID(), name, relation, dateOfBirth: dob, color: getRandomColor(), avatar, last_updated: now,
      }]);
    }
    setShowAddForm(false);
    setEditingMember(null);
  };

  const handleRemoveMember = (id: string) => {
    if (window.confirm('Delete this family member?')) {
      const supabase = getSupabase();
      if (supabase) supabase.from('family_members').delete().eq('id', id).then();
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(members, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-data.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (Array.isArray(data) && window.confirm(`Merge ${data.length} members?`)) {
            setMembers(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const newOnes = data.filter(m => !existingIds.has(m.id)).map(m => ({...m, last_updated: Date.now()}));
              return [...prev, ...newOnes];
            });
          }
        } catch (err) { alert('Invalid file'); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 md:p-10 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative border-2 border-slate-100 dark:border-slate-800">
              <img src="/logo.png" alt="Logo" className="w-[110%] h-[110%] scale-105 object-cover object-top absolute" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-orange-500 to-rose-500 mb-1">
                Family Portal
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest text-[10px]">Real-time Precision Engine</p>
                <button 
                  onClick={() => setShowSyncSettings(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    getSupabase() ? 'bg-green-100 dark:bg-green-950/30 text-green-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Cloud size={12} className={isSyncing ? 'animate-pulse' : ''} />
                  {getSupabase() ? `Synced: ${syncConfig.familyId}` : 'Offline Sync'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 my-auto mx-1.5" />
              <button onClick={exportData} className="p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer" title="Export JSON">
                <Download size={20} />
              </button>
              <label className="p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer inline-flex items-center" title="Import JSON">
                <Upload size={20} />
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 my-auto mx-1.5" />
              <button onClick={() => setShowSyncSettings(true)} className="p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer" title="Sync Settings">
                <Settings size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              <Plus size={22} />
              Add Member
            </button>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 w-fit mb-12">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('comparison')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'comparison' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400'}`}>
            <ArrowLeftRight size={18} /> Comparison lab
          </button>
        </div>

        {/* Modals */}
        {showAddForm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 w-full max-w-md">
               <AddMemberForm initialData={editingMember} onSave={handleSaveMember} onClose={() => {setShowAddForm(false); setEditingMember(null);}} />
            </div>
          </div>
        )}
        {showSyncSettings && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 w-full max-w-lg">
               <SyncSettings currentConfig={syncConfig} onSave={setSyncConfig} onClose={() => setShowSyncSettings(false)} />
            </div>
          </div>
        )}

        {members.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                <NextUpWidget members={members} />
                <YearTimeline members={members} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {members.map((member) => (
                    <AgeCard key={member.id} member={member} onRemove={handleRemoveMember} onEdit={(m) => {setEditingMember(m); setShowAddForm(true);}} />
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'comparison' && <AgeComparison members={members} />}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-300 dark:border-slate-800 p-20 text-center max-w-2xl mx-auto mt-12 shadow-2xl">
            <Users size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-8" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter">Your Family Circle</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Add your first family member to see real-time infographics, milestones, and birthday countdowns.</p>
            <button onClick={() => setShowAddForm(true)} className="px-10 py-5 bg-orange-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer text-lg">Add First Member</button>
          </div>
        )}
      </div>
      <footer className="max-w-6xl mx-auto mt-24 pb-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
        Powered by Precision Engine v2.0 &bull; Built for Family Unity
      </footer>
    </div>
  );
}

export default App;
