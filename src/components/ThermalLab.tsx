"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Bug, ShieldCheck, Zap, Timer } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ThermalLabProps {
  volume: number;
  material: string;
  temp: number;
  isSafe: boolean;
  particleSpeed: number;
  isBlanching?: boolean;
  blanchingTimer?: number;
}

const Trypanosoma = ({ containerWidth, containerHeight, speed, isDissolving }: { 
  containerWidth: number, 
  containerHeight: number, 
  speed: number,
  isDissolving: boolean 
}) => {
  const [pos, setPos] = useState({ x: Math.random() * containerWidth, y: Math.random() * containerHeight });
  const [vel, setVel] = useState({ 
    x: (Math.random() - 0.5) * speed, 
    y: (Math.random() - 0.5) * speed 
  });

  useEffect(() => {
    if (isDissolving) return;

    const interval = setInterval(() => {
      setPos(prev => {
        let newX = prev.x + vel.x;
        let newY = prev.y + vel.y;
        let newVelX = vel.x;
        let newVelY = vel.y;

        if (newX < 10 || newX > containerWidth - 10) newVelX *= -1;
        if (newY < 10 || newY > containerHeight - 10) newVelY *= -1;
        
        setVel({ x: newVelX, y: newVelY });
        return { x: Math.max(0, Math.min(containerWidth, newX)), y: Math.max(0, Math.min(containerHeight, newY)) };
      });
    }, 30);
    return () => clearInterval(interval);
  }, [vel, containerWidth, containerHeight, isDissolving, speed]);

  return (
    <div 
      className={cn(
        "absolute transition-all duration-[2000ms] ease-out",
        isDissolving ? "text-emerald-400/0 scale-150 opacity-0 rotate-180" : "text-red-500/80 scale-100 opacity-100"
      )}
      style={{ 
        transform: `translate(${pos.x}px, ${pos.y}px) ${isDissolving ? 'scale(1.5) rotate(180deg)' : ''}`,
        filter: isDissolving ? 'blur(8px)' : 'none'
      }}
    >
      <Bug size={12} className={cn(!isDissolving && "animate-pulse")} />
    </div>
  );
};

const ThermalLab = ({ 
  volume, 
  material, 
  temp, 
  isSafe,
  isBlanching,
  blanchingTimer = 0
}: ThermalLabProps) => {
  const speed = useMemo(() => isSafe ? 0 : 0.2 + (temp / 80) * 4, [temp, isSafe]);
  const [showInactivation, setShowInactivation] = useState(false);

  useEffect(() => {
    if (isSafe) {
      setShowInactivation(true);
    } else {
      setShowInactivation(false);
    }
  }, [isSafe]);

  return (
    <div className="relative w-full h-[450px] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
      {/* Grid de Laboratório */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1E562F 1px, transparent 1px), linear-gradient(90deg, #1E562F 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      {/* Badge BCT */}
      <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-30">
        <Zap size={12} className="text-[#1E562F]" />
        <span className="text-[9px] font-black text-[#1E562F] uppercase tracking-widest">BCT - Termodinâmica Aplicada</span>
      </div>

      {/* Beaker Container */}
      <div className="relative scale-100">
        <div className="absolute -left-6 top-0 w-8 h-full bg-gradient-to-r from-white/30 to-transparent blur-md rounded-full z-20 pointer-events-none" />
        
        <div className={cn(
          "relative w-64 h-80 border-x-[4px] border-b-[4px] rounded-b-[40px] backdrop-blur-[1px] transition-all duration-700 z-10",
          material === 'Metal' 
            ? 'border-slate-400 bg-gradient-to-b from-slate-200 to-slate-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]' 
            : 'border-slate-200 bg-white/40 shadow-xl'
        )}>
          {/* Líquido Açaí */}
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-b-[36px] transition-all duration-1000 ease-in-out overflow-hidden bg-[#4A148C] shadow-inner"
            style={{ height: `${Math.min(95, 25 + (volume / 30) * 70)}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-6 bg-white/10" />
            
            <div className="absolute inset-0 p-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Trypanosoma 
                  key={i} 
                  containerWidth={220} 
                  containerHeight={240} 
                  speed={speed} 
                  isDissolving={showInactivation} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Termômetro */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-56 bg-white rounded-full border-2 border-slate-200 relative flex flex-col items-center py-3 shadow-lg">
            <div className="w-2 flex-1 bg-slate-100 rounded-full relative overflow-hidden">
              <div 
                className={cn(
                  "absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out",
                  temp >= 52.5 ? "bg-[#1E562F]" : "bg-[#e41b13]"
                )}
                style={{ 
                  height: `${((temp - 25) / 55) * 100}%`,
                  boxShadow: temp > 70 ? `0 0 20px ${temp >= 52.5 ? '#1E562F' : '#e41b13'}` : 'none'
                }}
              />
            </div>
          </div>
          <div className="mt-2 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm">
            <span className="text-[10px] font-black lcd-display">{temp.toFixed(1)}°C</span>
          </div>
        </div>

        {/* Overlay de Segurança */}
        {showInactivation && (
          <div className="absolute inset-0 -top-12 flex flex-col items-center justify-center z-40 animate-in zoom-in fade-in duration-700">
            <div className="bg-emerald-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/50 animate-bounce">
              <ShieldCheck size={48} />
            </div>
            <div className="mt-4 bg-white/90 backdrop-blur-md border-2 border-emerald-500 px-6 py-2 rounded-2xl shadow-xl">
              <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">Seguro para Consumo</p>
            </div>
          </div>
        )}
      </div>

      {/* Reference Tag */}
      <div className="absolute bottom-4 right-6 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
        Protocolo baseado em Embrapa Amapá 2017 (COT 151)
      </div>
    </div>
  );
};

export default ThermalLab;