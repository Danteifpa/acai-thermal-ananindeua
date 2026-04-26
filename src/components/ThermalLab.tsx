"use client";

import React, { useMemo } from 'react';
import { Thermometer, Zap, Timer, Activity } from 'lucide-react';

interface ThermalLabProps {
  volume: number;
  material: string;
  temp: number;
  isSafe: boolean;
  k: number;
  q: number;
  timeToCritical: number;
}

const ThermalLab = ({ volume, material, temp, isSafe, k, q, timeToCritical }: ThermalLabProps) => {
  // Calculate color based on temperature (25C to 80C)
  // Blue (25) -> Yellow (52.5) -> Red (80)
  const getLiquidColor = (t: number) => {
    if (t < 52.5) {
      const ratio = (t - 25) / (52.5 - 25);
      const r = Math.floor(59 + (234 - 59) * ratio);
      const g = Math.floor(130 + (179 - 130) * ratio);
      const b = Math.floor(246 + (37 - 246) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const ratio = Math.min(1, (t - 52.5) / (80 - 52.5));
      const r = Math.floor(234 + (239 - 234) * ratio);
      const g = Math.floor(179 + (68 - 179) * ratio);
      const b = Math.floor(37 + (68 - 37) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const liquidColor = getLiquidColor(temp);
  const fillHeight = Math.min(90, 20 + (volume / 50) * 70);

  return (
    <div className="relative w-full h-[450px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden font-mono shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', size: '20px 20px', backgroundSize: '40px 40px' }} />

      {/* Physics HUD - Left */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Zap size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Troca de Energia (Q)</span>
          </div>
          <div className="text-2xl font-black text-white">
            {q.toLocaleString()} <span className="text-xs font-normal text-slate-500">J</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Activity size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Condutividade (k)</span>
          </div>
          <div className="text-2xl font-black text-white">
            {k.toFixed(5)} <span className="text-xs font-normal text-slate-500">s⁻¹</span>
          </div>
        </div>
      </div>

      {/* Physics HUD - Right */}
      <div className="absolute top-6 right-6 z-10 space-y-4">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Timer size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Timer de Inativação</span>
          </div>
          <div className="text-2xl font-black text-white">
            {isSafe ? (600 - timeToCritical).toFixed(0) : "0"} <span className="text-xs font-normal text-slate-500">s</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-1">Tempo acima de 52.5°C</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Thermometer size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Temperatura Final</span>
          </div>
          <div className="text-2xl font-black text-white">
            {temp.toFixed(1)} <span className="text-xs font-normal text-slate-500">°C</span>
          </div>
        </div>
      </div>

      {/* 2D Schematic Container */}
      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <div className="relative w-64 h-80">
          {/* Container Walls */}
          <div className={`absolute inset-0 border-x-4 border-b-4 rounded-b-3xl z-20 ${material === 'Metal' ? 'border-slate-400 bg-slate-400/10' : 'border-slate-600 bg-slate-600/10'}`}>
            {/* Material Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
              Recipiente: {material === 'Metal' ? 'Aço Inox' : 'Polietileno'}
            </div>
          </div>

          {/* Liquid Fill */}
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-b-[20px] transition-all duration-700 ease-in-out overflow-hidden"
            style={{ 
              height: `${fillHeight}%`, 
              backgroundColor: liquidColor,
              boxShadow: `inset 0 10px 30px rgba(0,0,0,0.2), 0 0 40px ${liquidColor}44`
            }}
          >
            {/* Liquid Surface Wave Effect */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse" />
            
            {/* Bubbles/Particles */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full animate-bounce"
                  style={{
                    width: Math.random() * 4 + 2 + 'px',
                    height: Math.random() * 4 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    bottom: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 2 + 's',
                    animationDuration: Math.random() * 3 + 2 + 's'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Volume Indicator */}
          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between py-4 text-[10px] text-slate-600 font-bold">
            <span>50L</span>
            <span>25L</span>
            <span>0L</span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Status: {isSafe ? 'Seguro' : 'Risco Biológico'}
            </span>
          </div>
        </div>
        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
          Simulação Física v2.0 | IFPA BCT
        </div>
      </div>
    </div>
  );
};

export default ThermalLab;