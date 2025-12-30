
import React, { useState, useRef, useEffect } from 'react';
import { ClassSyllabus, MonthSyllabus } from '../types';

interface SyllabusWheelProps {
  syllabus: ClassSyllabus;
}

const SyllabusWheel: React.FC<SyllabusWheelProps> = ({ syllabus }) => {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(-10); 
  const [selectedMonth, setSelectedMonth] = useState<MonthSyllabus | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const totalMonths = syllabus.months.length;
  const radius = window.innerWidth < 768 ? 240 : 380; 

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setLastPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - lastPos.x;
    const deltaY = clientY - lastPos.y;
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-45, Math.min(45, prev - deltaY * 0.5)));
    setLastPos({ x: clientX, y: clientY });
  };

  const handleEnd = () => setIsDragging(false);

  return (
    <div className="relative h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#0f172a] rounded-[3rem] shadow-2xl select-none group border-4 border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)]" />
      <div className="absolute top-12 text-center z-20 pointer-events-none">
        <div className="inline-block px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4 backdrop-blur-md">
          <span className="text-[10px] font-black text-indigo-400 tracking-[0.4em] uppercase">Interactive 360° Sphere</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Academic Orbit</h2>
      </div>

      <div 
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[2000px]"
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        <div className="relative transition-transform duration-700 ease-out" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)` }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600 rounded-full blur-[80px] opacity-30 animate-pulse" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-900 border-2 border-indigo-500/40 rounded-full flex flex-col items-center justify-center">
            <i className="fas fa-atom text-indigo-400 text-4xl"></i>
            <span className="text-[8px] font-black text-indigo-300 tracking-[0.3em] mt-2 uppercase">CLASS {syllabus.classLevel}</span>
          </div>

          {syllabus.months.map((m, idx) => {
            const angle = (idx / totalMonths) * Math.PI * 2;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            return (
              <div key={idx} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', transform: `translateX(${x}px) translateZ(${z}px)` }}>
                <button onClick={() => setSelectedMonth(m)} className="group relative flex flex-col items-center" style={{ transform: `rotateY(${-rotationY}deg) rotateX(${-rotationX}deg)` }}>
                  <div className="w-24 h-24 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-500 border-2 bg-slate-800/40 border-slate-700/50 hover:border-indigo-500/50 backdrop-blur-xl">
                    <span className="text-[10px] font-black text-indigo-400 tracking-widest mb-1 opacity-70">MONTH</span>
                    <span className="text-4xl font-black text-white">{m.month}</span>
                  </div>
                  <div className="mt-4 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all text-white font-black text-[10px] whitespace-nowrap tracking-wider uppercase">
                    {m.description}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`absolute inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transition-all duration-700 ${selectedMonth ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedMonth && (
          <div className="h-full flex flex-col p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">{selectedMonth.month}</div>
                <h3 className="text-xl font-black text-slate-800 uppercase">Month {selectedMonth.month}</h3>
              </div>
              <button onClick={() => setSelectedMonth(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500"><i className="fas fa-times"></i></button>
            </div>
            <h4 className="text-3xl font-black text-slate-800 leading-tight mb-8 uppercase">{selectedMonth.description}</h4>
            <div className="flex-1 overflow-y-auto space-y-6">
              {selectedMonth.content.map((sub, sIdx) => (
                <div key={sIdx}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{sub.icon}</span>
                    <h5 className="text-lg font-black text-slate-800 uppercase">{sub.subjectName}</h5>
                  </div>
                  <div className="space-y-2">
                    {sub.topics.map((t, tIdx) => (
                      <div key={tIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 text-sm">{t.name}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusWheel;
