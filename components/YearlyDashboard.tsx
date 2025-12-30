
import React from 'react';
import { ClassSyllabus, UserProgress } from '../types';

interface YearlyDashboardProps {
  syllabus: ClassSyllabus;
  progress: UserProgress;
  onStartMcq: (id: string, name: string) => void;
}

const YearlyDashboard: React.FC<YearlyDashboardProps> = ({ syllabus, progress, onStartMcq }) => {
  const topicLatestScoreMap: Record<string, number> = {};
  progress.mcqResults.forEach(r => {
    topicLatestScoreMap[r.topicId] = r.score;
  });

  const incompleteByMonth = syllabus.months.map((m, mIdx) => {
    const list: { subject: string; topic: string; id: string; status: 'unread' | 'untested' }[] = [];
    m.content.forEach(sub => {
      sub.topics.forEach(t => {
        const id = `${syllabus.classLevel}_m${mIdx}_${sub.subjectName}_${t.name}`;
        if (!progress.completedTopics.includes(id)) list.push({ subject: sub.subjectName, topic: t.name, id, status: 'unread' });
        else if (!progress.testedTopics.includes(id)) list.push({ subject: sub.subjectName, topic: t.name, id, status: 'untested' });
      });
    });
    return { month: m, incomplete: list };
  });

  const totalIncomplete = incompleteByMonth.reduce((acc, curr) => acc + curr.incomplete.length, 0);
  const avgScore = progress.mcqResults.length > 0 
    ? Math.round(progress.mcqResults.reduce((sum, r) => sum + r.score, 0) / progress.mcqResults.length) : 0;

  return (
    <div className="space-y-10 pb-32">
      <section className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden border-4 border-slate-800">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div className="flex-1">
              <h4 className="text-[10px] font-black tracking-[0.6em] text-indigo-400 mb-6 uppercase">Progress Scoreboard</h4>
              <h2 className="text-6xl font-black tracking-tighter leading-none mb-6 uppercase">Student Stats</h2>
              <p className="text-slate-400 font-bold max-w-xl text-lg leading-relaxed">
                Track your board readiness. Aim for <span className="text-white">100% Score</span> in all your weak topics to secure your future.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center backdrop-blur-xl">
                <span className="text-6xl font-black block text-indigo-400 mb-2">{avgScore}%</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Average Mastery</span>
              </div>
              <div className={`p-10 rounded-[3rem] border text-center backdrop-blur-xl ${totalIncomplete > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                <span className={`text-6xl font-black block mb-2 ${totalIncomplete > 0 ? 'text-red-500' : 'text-green-500'}`}>{totalIncomplete}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pending Topics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-red-50 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-8 mb-12 relative z-10">
          <div className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center text-white text-3xl shadow-2xl shadow-red-200"><i className="fas fa-notes-medical"></i></div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Weak Topics</h3>
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest mt-2">Subjects requiring immediate attention</p>
          </div>
        </div>
        {progress.weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {progress.weakTopics.map((id, idx) => {
              const parts = id.split('_');
              const topicName = parts[parts.length - 1];
              const score = topicLatestScoreMap[id] || 0;
              return (
                <div key={idx} className="p-10 bg-red-50/50 rounded-[3.5rem] border-2 border-red-100 flex flex-col justify-between">
                   <div className="mb-8">
                      <div className="flex justify-between items-center mb-6">
                         <span className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-red-100">DANGER ZONE</span>
                         <span className="text-4xl font-black text-red-600">{score}%</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{topicName}</h4>
                   </div>
                   <button onClick={() => onStartMcq(id, topicName)} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black tracking-widest hover:bg-red-600 uppercase transition-all shadow-xl text-xs"><i className="fas fa-file-pen mr-2"></i> UPDATE SCORE</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <i className="fas fa-shield-heart text-6xl text-slate-200 mb-6"></i>
             <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">All Topics are Secured</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default YearlyDashboard;
