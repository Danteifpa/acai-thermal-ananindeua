"use client";

import React from 'react';

interface ThermalChartProps {
  k: number;
  isSafe: boolean;
}

const ThermalChart = ({ k, isSafe }: ThermalChartProps) => {
  const T0 = 80;
  const TENV = 25;
  const duration = 1200; // 20 minutes in seconds
  
  const points = Array.from({ length: 50 }, (_, i) => {
    const t = (i / 49) * duration;
    const temp = TENV + (T0 - TENV) * Math.exp(-k * t);
    return { t, temp };
  });

  const xScale = (t: number) => (t / duration) * 100;
  const yScale = (temp: number) => 100 - ((temp - 20) / 70) * 100;

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(p.t)} ${yScale(p.temp)}`
  ).join(' ');

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Curva de Resfriamento T(t)</h3>
        <div className="flex gap-4 text-[10px] font-bold">
          <div className="flex items-center gap-1 text-purple-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>Simulação Atual</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <div className="w-2 h-0.5 bg-slate-700" />
            <span>Limite 52.5°C</span>
          </div>
        </div>
      </div>

      <div className="relative h-40 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="#1e293b" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#1e293b" strokeWidth="0.5" />
          
          {/* Safety Threshold Line */}
          <line 
            x1="0" y1={yScale(52.5)} 
            x2="100" y2={yScale(52.5)} 
            stroke="#334155" 
            strokeWidth="1" 
            strokeDasharray="2,2" 
          />

          {/* Temperature Curve */}
          <path
            d={pathData}
            fill="none"
            stroke={isSafe ? "#a855f7" : "#ef4444"}
            strokeWidth="2"
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Labels */}
        <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[8px] font-bold text-slate-600">
          <span>90°C</span>
          <span>55°C</span>
          <span>20°C</span>
        </div>
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-600">
          <span>0 min</span>
          <span>10 min</span>
          <span>20 min</span>
        </div>
      </div>
    </div>
  );
};

export default ThermalChart;