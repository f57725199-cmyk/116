
import React, { useState, useRef, useEffect } from 'react';
import { ClassSyllabus, MonthSyllabus } from '../types';

interface SyllabusTreeProps {
  syllabus: ClassSyllabus;
  currentMonth: number;
}

const SyllabusTree: React.FC<SyllabusTreeProps> = ({ syllabus, currentMonth }) => {
  const [scale, setScale] = useState(0.85);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isSpinning, setIsSpinning] = useState(false);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => direction === 'in' ? Math.min(prev + 0.15, 2) : Math.max(prev - 0.15, 0.4));
  };

  const handleSpin360 = () => {
    setIsSpinning(true);
    setRotation(prev => prev + 360);
    setTimeout(() => setIsSpinning(false), 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      className="relative h-[85vh] w-full bg-[#f8fafc] rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="absolute top-6 right-6 z-30 flex flex-col gap-3 no-drag">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <button onClick={() => handleZoom('in')} className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
              <i className="fas fa-plus text-lg"></i>
            </button>
            <button onClick={() => handleZoom('out')} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-indigo-600 hover:bg-slate-50 border border-indigo-100 transition-all shadow-md active:scale-95">
              <i className="fas fa-minus text-lg"></i>
            </button>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          <div className="flex flex-col items-center gap-2">
            <button onClick={handleSpin360} className={`w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm ${isSpinning ? 'animate-spin' : ''}`}>
              <i className="fas fa-sync-alt"></i>
            </button>
            <div className="relative group py-2">
              <input type="range" min="0" max="360" value={rotation % 360} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 -rotate-90 translate-y-8" />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-50 shadow-sm">
                {Math.round(rotation % 360)}°
              </span>
            </div>
          </div>
          <div className="h-px bg-slate-100 w-full mt-10" />
          <button onClick={() => { setScale(0.85); setPosition({x:0, y:0}); setRotation(0); }} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 transition-all shadow-sm">
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>

      <div className="absolute top-8 left-10 z-20 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-white shadow-xl">
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">
              <i className="fas fa-tree"></i>
            </span>
            Growth Pathway
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 pl-11">Path to 365 Mastery</p>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={`w-full h-full flex flex-col items-center origin-center transition-transform ${isSpinning ? 'duration-1000 ease-in-out' : 'duration-75 ease-out'}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)` }}
      >
        <div className="pt-40 pb-60 flex flex-col items-center">
          <div className="relative mb-20">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl ring-8 ring-white">
              <i className="fas fa-seedling text-3xl animate-pulse"></i>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-slate-400 font-black text-[10px] tracking-[0.3em]">STUDY START</div>
          </div>

          <div className="relative flex flex-col items-center">
            {syllabus.months.map((m, idx) => {
              const isActive = m.month === currentMonth;
              const isCompleted = m.month < currentMonth;
              const isLocked = m.month > currentMonth;
              const isLeft = idx % 2 === 0;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-3 h-32 rounded-full mb-[-2px] relative ${isCompleted ? 'bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1/2 ${isLeft ? 'right-full mr-2' : 'left-full ml-2'} w-8 h-3 rounded-full ${isCompleted ? 'bg-indigo-300' : 'bg-slate-100'} rotate-45`}></div>
                  </div>

                  <div className={`relative z-10 transition-all duration-700 ${isActive ? 'scale-125' : 'scale-100'} ${isLocked ? 'grayscale opacity-60' : ''}`}>
                    <div className={`absolute top-1/2 ${isLeft ? 'right-full flex-row-reverse' : 'left-full flex-row'} flex items-center group`}>
                      <div className={`h-1 w-16 transition-colors duration-500 ${isCompleted ? 'bg-indigo-400' : isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                      <div className={`w-72 p-6 rounded-[2rem] bg-white border-2 shadow-2xl transition-all duration-500 no-drag ${isActive ? 'border-indigo-600 translate-y-0 opacity-100' : 'border-slate-100 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ transform: `rotate(${-rotation}deg)` }}>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {isActive ? 'CURRENT PHASE' : `MONTH ${m.month}`}
                          </span>
                          {isCompleted && <i className="fas fa-check-circle text-green-500"></i>}
                        </div>
                        <h4 className="text-xl font-black text-slate-800 leading-tight mb-3">{m.description}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {m.content.map((sub, sIdx) => (
                            <div key={sIdx} className="bg-slate-50 rounded-xl p-2 flex items-center gap-2">
                              <span className="text-lg">{sub.icon}</span>
                              <span className="text-[10px] font-bold text-slate-600 truncate">{sub.subjectName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`w-32 h-32 rounded-[3rem] flex flex-col items-center justify-center transition-all duration-500 border-8 relative cursor-pointer ${
                      isActive ? 'bg-white border-indigo-600 shadow-[0_30px_60px_rgba(79,70,229,0.3)]' : 
                      isCompleted ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'bg-slate-100 border-slate-200 text-slate-300'
                    }`}>
                      <div style={{ transform: `rotate(${-rotation}deg)` }} className="flex flex-col items-center">
                        <span className={`text-[10px] font-black tracking-widest mb-1 ${isCompleted ? 'text-indigo-200' : 'text-slate-400'}`}>MONTH</span>
                        <span className="text-4xl font-black">{m.month}</span>
                      </div>
                      {isActive && <div className="absolute inset-0 rounded-[3rem] bg-indigo-500/20 animate-ping pointer-events-none"></div>}
                      {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-[3rem]"><i className="fas fa-lock text-slate-400"></i></div>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="w-3 h-40 bg-slate-200 rounded-full flex flex-col items-center">
              <div className="w-32 h-32 mt-20 bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-white shadow-2xl relative">
                <div style={{ transform: `rotate(${-rotation}deg)` }} className="flex flex-col items-center">
                  <i className="fas fa-trophy text-4xl text-yellow-400 animate-bounce mb-2"></i>
                  <span className="text-[10px] font-black tracking-widest">FINISH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusTree;
