import { useState, useEffect } from 'react';
import { AddMemberForm } from './components/AddMemberForm';
import { AgeCard } from './components/AgeCard';
import { YearTimeline } from './components/YearTimeline';
import type { FamilyMember } from './types';
import { getRandomColor } from './utils/colors';
import { Plus, Users } from 'lucide-react';

function App() {
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const stored = localStorage.getItem('familyMembers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(members));
  }, [members]);

  const handleSaveMember = (name: string, relation: string, dob: string, avatar?: string, id?: string) => {
    if (id) {
      setMembers(members.map(m => m.id === id ? { ...m, name, relation, dateOfBirth: dob, avatar } : m));
    } else {
      const newMember: FamilyMember = {
        id: crypto.randomUUID(),
        name,
        relation,
        dateOfBirth: dob,
        color: getRandomColor(),
        avatar,
      };
      setMembers([...members, newMember]);
    }
    setShowAddForm(false);
    setEditingMember(null);
  };

  const openAddForm = () => {
    setEditingMember(null);
    setShowAddForm(true);
  };

  const openEditForm = (member: FamilyMember) => {
    setEditingMember(member);
    setShowAddForm(true);
  };

  const handleRemoveMember = (id: string) => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white shadow flex items-center justify-center overflow-hidden shrink-0 relative border-2 border-orange-500/20">
              <img src="/logo.png" alt="Family Birthday Tracker Logo" className="w-[115%] h-[115%] object-cover object-top absolute" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-orange-500 mb-1">
                Family Birthday Tracker
              </h1>
              <p className="text-slate-500 mt-1 text-lg max-w-xl font-medium">
                Track precise ages and stay ahead of every upcoming celebration.
              </p>
            </div>
          </div>
          
          <button
            onClick={openAddForm}
            className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3.5 md:py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-slate-200 cursor-pointer"
          >
            <Plus size={20} />
            Add Member
          </button>
        </header>

        {showAddForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="animate-in fade-in zoom-in-95 duration-200 w-full max-w-md">
               <AddMemberForm initialData={editingMember} onSave={handleSaveMember} onClose={() => {setShowAddForm(false); setEditingMember(null);}} />
            </div>
          </div>
        )}

        {members.length > 0 && <YearTimeline members={members} />}

        {members.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Family Members Yet</h3>
            <p className="text-slate-500 mb-8">Add your first family member to see their real-time age infographic.</p>
            <button
               onClick={openAddForm}
               className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 sm:py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              <Plus size={20} />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {members.map((member) => (
              <AgeCard key={member.id} member={member} onRemove={handleRemoveMember} onEdit={openEditForm} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
