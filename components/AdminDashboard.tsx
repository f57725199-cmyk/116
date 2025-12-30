
import React, { useState } from 'react';
import { ClassSyllabus, MonthSyllabus, TopicDetail } from '../types';

interface AdminDashboardProps {
  syllabus: ClassSyllabus;
  onSave: (data: ClassSyllabus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ syllabus, onSave }) => {
  const [editingSyllabus, setEditingSyllabus] = useState<ClassSyllabus>({ ...syllabus });
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    setEditingSyllabus({ ...syllabus });
  }, [syllabus]);

  const handleUpdateMonth = (index: number, updates: Partial<MonthSyllabus>) => {
    const newMonths = [...editingSyllabus.months];
    newMonths[index] = { ...newMonths[index], ...updates };
    setEditingSyllabus({ ...editingSyllabus, months: newMonths });
  };

  const handleSave = () => {
    onSave(editingSyllabus);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const activeMonth = editingSyllabus.months[selectedMonth];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-80 space-y-2">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Edit Roadmap</h4>
        {editingSyllabus.months.map((m, i) => (
          <button
            key={i}
            onClick={() => setSelectedMonth(i)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
              selectedMonth === i 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className={`text-[9px] font-black ${selectedMonth === i ? 'text-slate-400' : 'text-slate-400'}`}>MONTH {m.month}</span>
              <span className="font-bold truncate max-w-[150px] uppercase text-xs">{m.description}</span>
            </div>
            {m.isRevision && <i className="fas fa-sync-alt text-[10px] opacity-40"></i>}
          </button>
        ))}
      </aside>

      <div className="flex-1 bg-white rounded-[3rem] border shadow-sm p-8 md:p-12 space-y-10">
        <div className="flex items-center justify-between border-b pb-8 border-slate-50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">EDITOR: MONTH {activeMonth.month}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Class {editingSyllabus.classLevel} Administration</p>
          </div>
          <button 
            onClick={handleSave}
            className={`px-10 py-4 rounded-2xl font-black tracking-widest transition-all shadow-xl text-xs uppercase ${
              isSaved ? 'bg-green-500 text-white shadow-green-100' : 'bg-slate-900 text-white hover:bg-black active:scale-95'
            }`}
          >
            {isSaved ? 'SAVE SUCCESS ✓' : 'DEPLOY UPDATES'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Phase Description</label>
             <input 
              type="text"
              value={activeMonth.description}
              onChange={(e) => handleUpdateMonth(selectedMonth, { description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
             />
          </div>
          <div className="space-y-3">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">UI Status Style</label>
             <select 
              value={activeMonth.color}
              onChange={(e) => handleUpdateMonth(selectedMonth, { color: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer"
             >
               <option value="text-green-500">Green (Growth)</option>
               <option value="text-yellow-500">Yellow (Warning)</option>
               <option value="text-orange-500">Orange (Intense)</option>
               <option value="text-red-500">Red (Final)</option>
             </select>
          </div>
        </div>

        <div className="space-y-8 pt-8">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b pb-4 border-slate-50">Curriculum Mapping</h4>
          {activeMonth.content.map((sub, sIdx) => (
            <div key={sIdx} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
              <div className="flex items-center gap-5">
                <input 
                  type="text"
                  value={sub.icon}
                  onChange={(e) => {
                    const newContent = [...activeMonth.content];
                    newContent[sIdx] = { ...newContent[sIdx], icon: e.target.value };
                    handleUpdateMonth(selectedMonth, { content: newContent });
                  }}
                  className="w-16 h-16 text-center text-3xl bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-bold"
                />
                <div className="flex-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Subject Identity</label>
                  <input 
                    type="text"
                    value={sub.subjectName}
                    onChange={(e) => {
                      const newContent = [...activeMonth.content];
                      newContent[sIdx] = { ...newContent[sIdx], subjectName: e.target.value };
                      handleUpdateMonth(selectedMonth, { content: newContent });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 font-black text-slate-800 uppercase text-xs tracking-widest outline-none shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {sub.topics.map((t, tIdx) => (
                    <div key={tIdx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3">
                      <div className="flex-1 flex flex-col">
                        <label className="text-[7px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Topic Title</label>
                        <input 
                          type="text"
                          value={t.name}
                          onChange={(e) => {
                            const newTopics = [...sub.topics];
                            newTopics[tIdx] = { ...t, name: e.target.value };
                            const newContent = [...activeMonth.content];
                            newContent[sIdx] = { ...newContent[sIdx], topics: newTopics };
                            handleUpdateMonth(selectedMonth, { content: newContent });
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[7px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Hours</label>
                        <input 
                          type="number"
                          value={t.hours}
                          onChange={(e) => {
                            const newTopics = [...sub.topics];
                            newTopics[tIdx] = { ...t, hours: parseInt(e.target.value) || 0 };
                            const newContent = [...activeMonth.content];
                            newContent[sIdx] = { ...newContent[sIdx], topics: newTopics };
                            handleUpdateMonth(selectedMonth, { content: newContent });
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[7px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Days</label>
                        <input 
                          type="number"
                          value={t.days}
                          onChange={(e) => {
                            const newTopics = [...sub.topics];
                            newTopics[tIdx] = { ...t, days: parseInt(e.target.value) || 0 };
                            const newContent = [...activeMonth.content];
                            newContent[sIdx] = { ...newContent[sIdx], topics: newTopics };
                            handleUpdateMonth(selectedMonth, { content: newContent });
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newTopics = sub.topics.filter((_, idx) => idx !== tIdx);
                          const newContent = [...activeMonth.content];
                          newContent[sIdx] = { ...newContent[sIdx], topics: newTopics };
                          handleUpdateMonth(selectedMonth, { content: newContent });
                        }}
                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl self-end"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const newContent = [...activeMonth.content];
                    newContent[sIdx] = { ...newContent[sIdx], topics: [...sub.topics, { name: "New Core Topic", hours: 10, days: 2 }] };
                    handleUpdateMonth(selectedMonth, { content: newContent });
                  }}
                  className="w-full py-3 bg-white border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-500 font-black text-[10px] tracking-[0.2em] hover:bg-indigo-50 transition-colors uppercase"
                >
                  <i className="fas fa-plus-circle mr-2"></i> Append Module
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
