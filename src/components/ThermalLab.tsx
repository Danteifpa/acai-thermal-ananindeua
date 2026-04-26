"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Zap, Timer, Activity, Wind } from 'lucide-react';

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
  const [displayQ, setDisplayQ] = useState(0);
  const [displayInactivation, setDisplayInactivation] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Live Counter Effect for Q (Energy)
  useEffect(() => {
    const target = q || 0;
    const duration = 500;
    const start = displayQ;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      setDisplayQ(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [q]);

  // Live Counter Effect for Inactivation Time
  useEffect(() => {
    const target = isSafe ? (600 - (timeToCritical || 0)) : 0;
    const duration = 500;
    const start = displayInactivation;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      setDisplayInactivation(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isSafe, timeToCritical]);

  if (!isMounted) return null;

  const getLiquidColor = (t: number) => {
    if (t < 52.5) return 'bg-blue-500';
    if (t < 70) return 'bg-purple-600';
    return 'bg-red-600';
  };

  const getGlowColor = (t: number) => {
    if (t < 52.5) return 'shadow-[0_0_50px_rgba(59,130,246,0.3)]';
    if (isSafe) return 'shadow-[0_0_50px_rgba(34,197,94,0.3)]';
    return 'shadow-[0_0_50px_rgba(239,68,68,0.3)]';
  };

  const fillPercentage = Math.min(90, 20 + (volume / 50) * 70);
  const showSteam = temp > 50;

  return (
    <div className={`relative w-full h-[500px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden font-mono transition-shadow duration-1000 ${getGlowColor(temp)}`}>
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* HUD - Left */}
      <div className="absolute top-6 left-6 z-20 space-y-4">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Energia Térmica (Q)</span>
          </div>
          <div className="text-xl font-black text-white">{displayQ.toLocaleString()} J</div>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Condutividade (k)</span>
          </div>
          <div className="text-xl font-black text-white">{(k || 0).toFixed(5)} s⁻¹</div>
        </div>
      </div>

      {/* HUD - Right */}
      <div className="absolute top-6 right-6 z-20 space-y-4">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Timer size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Tempo de Inativação</span>
          </div>
          <div className="text-xl font-black text-white">{displayInactivation} s</div>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Thermometer size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Temperatura Final</span>
          </div>
          <div className="text-xl font-black text-white">{(temp || 25).toFixed(1)} °C</div>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <div className="relative">
          {/* Steam Effect */}
          {showSteam && (
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none z-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="absolute bottom-0 bg-white/20 rounded-full blur-xl animate-steam"
                  style={{
                    left: `${20 + i * 15}%`,
                    width: `${20 + Math.random() * 20}px`,
                    height: `${20 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Container */}
          <div className="relative w-64 h-72 border-x-4 border-b-4 border-slate-700 rounded-b-3xl bg-slate-900/40 overflow-hidden backdrop-blur-sm">
            {/* Liquid */}
            <div 
              className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${getLiquidColor(temp)}`}
              style={{ height: `${fillPercentage}%` }}
            >
              {/* Surface Wave Effect */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse" />
              
              {/* Bubbles for high temp */}
              {temp > 60 && (
                <div className="absolute inset-0 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="absolute bottom-0 w-2 h-2 bg-white/30 rounded-full animate-bubble"
                      style={{
                        left: `${20 + i * 25}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Material Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
              Recipiente: {material}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isSafe ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} animate-pulse`} />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Status Sanitário: {isSafe ? 'Processo Seguro' : 'Risco Biológico'}
          </span>
        </div>
        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          IFPA Ananindeua • BCT 2026
        </div>
      </div>

      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100px) scale(2); opacity: 0; }
        }
        @keyframes bubble {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-200px); opacity: 0; }
        }
        .animate-steam {
          animation: steam linear infinite;
        }
        .animate-bubble {
          animation: bubble 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ThermalLab;