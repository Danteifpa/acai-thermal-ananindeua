"use client";

import React, { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Calculate color based on temperature
  const getLiquidColor = (t: number) => {
    const currentT = t || 25;
    if (currentT < 52.5) {
      return 'bg-blue-500';
    } else if (currentT < 70) {
      return 'bg-purple-500';
    } else {
      return 'bg-red-500';
    }
  };

  const fillPercentage = Math.min(90, 20 + (volume / 50) * 70);

  return (
    <div className="relative w-full h-[450px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden font-mono shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* HUD - Left */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-4 rounded-xl w-56">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Zap size={14} />
            <span className="text-[10px] font-bold uppercase">Energia (Q)</span>
          </div>
          <div className="text-xl font-black text-white">{(q || 0).toLocaleString()} J</div>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-4 rounded-xl w-56">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase">Condutividade (k)</span>
          </div>
          <div className="text-xl font-black text-white">{(k || 0).toFixed(5)} s⁻¹</div>
        </div>
      </div>

      {/* HUD - Right */}
      <div className="absolute top-6 right-6 z-10 space-y-4">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-4 rounded-xl w-56">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Timer size={14} />
            <span className="text-[10px] font-bold uppercase">Inativação</span>
          </div>
          <div className="text-xl font-black text-white">
            {isSafe ? (600 - (timeToCritical || 0)).toFixed(0) : "0"} s
          </div>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-4 rounded-xl w-56">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Thermometer size={14} />
            <span className="text-[10px] font-bold uppercase">Temp. Final</span>
          </div>
          <div className="text-xl font-black text-white">{(temp || 25).toFixed(1)} °C</div>
        </div>
      </div>

      {/* CSS Visualizer */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="relative w-64 h-72 border-x-4 border-b-4 border-slate-700 rounded-b-3xl bg-slate-900/20 overflow-hidden">
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${getLiquidColor(temp)}`}
            style={{ height: `${fillPercentage}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-white/10 animate-pulse" />
          </div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Recipiente: {material}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[9px] font-bold text-slate-400 uppercase">Status: {isSafe ? 'Seguro' : 'Risco'}</span>
        </div>
        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Simulação Estável v3.0</div>
      </div>
    </div>
  );
};

export default ThermalLab;