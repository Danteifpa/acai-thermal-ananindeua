"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Thermometer, Zap, Timer, Activity, Search, ShieldCheck, AlertCircle, Box, FlaskConical } from 'lucide-react';

interface ThermalLabProps {
  volume: number;
  material: string;
  temp: number;
  isSafe: boolean;
  k: number;
  q: number;
  timeToCritical: number;
  onMaterialChange: (m: string) => void;
  onVolumeChange: (v: number) => void;
}

const ThermalLab = ({ 
  volume, 
  material, 
  temp, 
  isSafe, 
  k, 
  q, 
  timeToCritical,
  onMaterialChange,
  onVolumeChange
}: ThermalLabProps) => {
  const [showMicro, setShowMicro] = useState(false);
  const [displayQ, setDisplayQ] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // Energy Counter
  useEffect(() => {
    const target = q || 0;
    const start = displayQ;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 400, 1);
      setDisplayQ(Math.floor(start + (target - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [q]);

  if (!isMounted) return null;

  const fillPercentage = Math.min(90, 20 + (volume / 50) * 70);

  // Inverse Calculation for Thermometer Drag
  const handleThermometerDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const percentage = 1 - (y / rect.height);
    const targetTemp = 25 + (percentage * 55); // Range 25 to 80
    
    // Inverse Physics: V = (k_base / (cp * k_target))^5
    const cp = material === 'Metal' ? 0.5 : 2.3;
    const kBase = material === 'Metal' ? 0.004 : 0.0015;
    const kTarget = -Math.log((targetTemp - 25) / 55) / 600;
    
    if (kTarget > 0) {
      const calculatedV = Math.pow(kBase / (cp * kTarget), 5);
      onVolumeChange(Math.max(1, Math.min(50, Math.round(calculatedV))));
    }
  };

  return (
    <div className={`relative w-full h-[600px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden font-mono transition-all duration-700 ${isSafe ? 'shadow-[0_0_60px_rgba(34,197,94,0.2)]' : 'shadow-[0_0_60px_rgba(239,68,68,0.2)]'}`}>
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isSafe ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
            <span className="text-xs font-black text-white uppercase tracking-widest">Sistema de Monitoramento</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onMaterialChange('Plástico')}
              className={`p-2 rounded-lg transition-all ${material === 'Plástico' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              title="Balde de Plástico"
            >
              <Box size={20} />
            </button>
            <button 
              onClick={() => onMaterialChange('Metal')}
              className={`p-2 rounded-lg transition-all ${material === 'Metal' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              title="Panela de Inox"
            >
              <FlaskConical size={20} />
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowMicro(!showMicro)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${showMicro ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          <Search size={16} />
          Vista Microscópica
        </button>
      </div>

      {/* Main Lab Area */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        {/* Interactive Thermometer */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase vertical-text">Arraste para ajustar alvo</div>
          <div 
            className="relative w-8 h-64 bg-slate-900 rounded-full border-2 border-slate-800 cursor-ns-resize group"
            onMouseDown={handleThermometerDrag}
          >
            <div 
              className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ${temp >= 52.5 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ height: `${((temp - 25) / 55) * 100}%` }}
            />
            <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-600 py-2">
              <span>80°C</span>
              <span>52.5°C</span>
              <span>25°C</span>
            </div>
          </div>
        </div>

        {/* Container Visualizer */}
        <div className="relative">
          {/* SAFE Stamp */}
          {isSafe && (
            <div className="absolute -top-20 -right-20 z-40 animate-in zoom-in duration-500 rotate-12">
              <div className="border-4 border-green-500 text-green-500 px-6 py-2 rounded-xl font-black text-3xl uppercase tracking-tighter bg-slate-950/80 backdrop-blur-sm">
                SEGURO
              </div>
            </div>
          )}

          {/* Container */}
          <div className={`relative w-64 h-72 border-x-4 border-b-4 rounded-b-3xl bg-slate-900/40 overflow-hidden backdrop-blur-sm transition-colors duration-500 ${material === 'Metal' ? 'border-slate-400' : 'border-slate-700'}`}>
            <div 
              className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${temp >= 52.5 ? 'bg-purple-700' : 'bg-purple-900'}`}
              style={{ height: `${fillPercentage}%` }}
            >
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Microscopic View Pop-up */}
        {showMicro && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-slate-900 rounded-full border-4 border-blue-500/30 overflow-hidden shadow-2xl z-40 animate-in zoom-in duration-300">
            <div className="absolute inset-0 bg-blue-900/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              {!isSafe ? (
                <div className="relative w-full h-full">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i}
                      className="absolute w-8 h-4 bg-green-400/40 rounded-full blur-[1px] animate-bounce"
                      style={{ 
                        top: `${20 + Math.random() * 60}%`, 
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                  <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-bold text-red-400 uppercase">Patógenos Ativos</div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <ShieldCheck className="text-green-500 mx-auto" size={48} />
                  <div className="text-[10px] font-bold text-green-400 uppercase">Inativados</div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 border-[20px] border-slate-950/50 rounded-full pointer-events-none" />
          </div>
        )}
      </div>

      {/* HUD Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-8 z-30">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Energia (Q)</p>
          <p className="text-xl font-black text-white">{displayQ.toLocaleString()} J</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Temp. Final</p>
          <p className={`text-xl font-black ${isSafe ? 'text-green-400' : 'text-red-400'}`}>{temp.toFixed(1)} °C</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
            {isSafe ? <ShieldCheck className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
            <span className={`text-xs font-bold uppercase ${isSafe ? 'text-green-500' : 'text-red-500'}`}>
              {isSafe ? 'Seguro' : 'Risco'}
            </span>
          </div>
        </div>
      </div>

      {/* Academic Signature */}
      <div className="absolute bottom-2 right-4 text-[8px] text-slate-600 font-bold uppercase tracking-widest opacity-50">
        Dante • Thais • Edenilson | BCT IFPA 2026
      </div>
    </div>
  );
};

export default ThermalLab;