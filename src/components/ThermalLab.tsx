"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Info, 
  Box, 
  FlaskConical,
  Flame,
  Droplets
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface ThermalLabProps {
  volume: number;
  material: string;
  temp: number;
  isSafe: boolean;
  k: number;
  q: number;
  onMaterialChange: (m: string) => void;
  onVolumeChange: (v: number) => void;
}

const Particle = ({ containerWidth, containerHeight, speed }: { containerWidth: number, containerHeight: number, speed: number }) => {
  const [pos, setPos] = useState({ x: Math.random() * containerWidth, y: Math.random() * containerHeight });
  const [vel, setVel] = useState({ 
    x: (Math.random() - 0.5) * speed, 
    y: (Math.random() - 0.5) * speed 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(prev => {
        let newX = prev.x + vel.x;
        let newY = prev.y + vel.y;
        let newVelX = vel.x;
        let newVelY = vel.y;

        if (newX < 0 || newX > containerWidth) newVelX *= -1;
        if (newY < 0 || newY > containerHeight) newVelY *= -1;
        
        setVel({ x: newVelX, y: newVelY });
        return { x: Math.max(0, Math.min(containerWidth, newX)), y: Math.max(0, Math.min(containerHeight, newY)) };
      });
    }, 30);
    return () => clearInterval(interval);
  }, [vel, containerWidth, containerHeight]);

  return (
    <div 
      className="absolute w-1 h-1 bg-white/80 rounded-full"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    />
  );
};

const ThermalLab = ({ 
  volume, 
  material, 
  temp, 
  isSafe, 
  k, 
  q,
  onMaterialChange
}: ThermalLabProps) => {
  const deltaT = Math.abs(temp - 80).toFixed(1);
  const specificHeat = material === 'Metal' ? 0.50 : 2.30;
  
  // PhET Logic: Speed scales with temperature (Kinetic Theory of Gases/Liquids)
  const particleSpeed = useMemo(() => {
    const baseSpeed = 0.5;
    const thermalFactor = (temp - 25) / 55; // Normalized 25-80 range
    return baseSpeed + (thermalFactor * 4);
  }, [temp]);

  const particleCount = 40;

  const getLiquidColor = () => {
    if (temp > 70) return 'bg-[#e41b13]'; // IFPA Red
    if (temp > 52.5) return 'bg-[#1E562F]'; // Deep IFPA Green
    return 'bg-blue-600';
  };

  return (
    <div className="relative w-full h-[700px] bg-white rounded-3xl border border-slate-200 overflow-hidden font-mono flex shadow-sm">
      
      {/* Scientific HUD - Left Side */}
      <div className="w-72 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 z-20">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-[#1E562F] uppercase tracking-widest">Painel de Dados</h3>
          <p className="text-xs text-slate-600 font-medium">Termodinâmica em Tempo Real</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-500 uppercase">ΔT (Variação)</p>
            <p className="text-2xl font-black text-slate-900 font-mono">{deltaT}°C</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-500 uppercase">Calor Específico (c)</p>
            <p className="text-2xl font-black text-[#1E562F] font-mono">{specificHeat.toFixed(2)} <span className="text-[10px] text-slate-500">kJ/kg·K</span></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-500 uppercase">Energia (Q)</p>
            <p className="text-2xl font-black text-orange-600 font-mono">{Math.floor(q).toLocaleString()} <span className="text-[10px] text-slate-500">J</span></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-500 uppercase">Status Biológico</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-[#1E562F] animate-pulse' : 'bg-[#e41b13]'}`} />
              <span className={`text-sm font-bold ${isSafe ? 'text-[#1E562F]' : 'text-[#e41b13]'}`}>
                {isSafe ? 'INATIVADO' : 'RISCO ATIVO'}
              </span>
            </div>
          </div>
        </div>

        {/* Controles de Bancada */}
        <div className="mt-auto pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1E562F]">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Controles de Bancada</span>
            </div>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-inner relative flex gap-1">
            <div 
              className={cn(
                "absolute top-2 bottom-2 w-[calc(50%-6px)] rounded-xl transition-all duration-300 ease-in-out z-0",
                material === 'Metal' 
                  ? "left-2 bg-gradient-to-br from-slate-200 to-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)]" 
                  : "left-[calc(50%+2px)] bg-[#1E562F] shadow-lg"
              )}
            />
            
            <button 
              onClick={() => onMaterialChange('Metal')}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all duration-200 z-10 active:scale-95",
                material === 'Metal' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <FlaskConical size={24} strokeWidth={material === 'Metal' ? 2.5 : 2} />
              <span className="text-[8px] font-black uppercase tracking-widest">Aço Inox</span>
            </button>

            <button 
              onClick={() => onMaterialChange('Plástico')}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all duration-200 z-10 active:scale-95",
                material === 'Plástico' ? "text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Box size={24} strokeWidth={material === 'Plástico' ? 2.5 : 2} />
              <span className="text-[8px] font-black uppercase tracking-widest">Polímero</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Experiment Area */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-50">
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <div className="absolute top-8 left-8 flex gap-4 z-30">
          <div className="w-14 h-14 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center shadow-sm">
            <Flame className="text-orange-600" size={28} />
          </div>
          <div className="w-14 h-14 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center shadow-sm">
            <Droplets className="text-blue-600" size={28} />
          </div>
        </div>

        <div className="relative group">
          <div className={`relative w-80 h-96 border-x-[6px] border-b-[6px] rounded-b-[40px] bg-white/90 backdrop-blur-sm transition-all duration-500 ${material === 'Metal' ? 'border-slate-400 shadow-2xl' : 'border-slate-200 shadow-lg'}`}>
            <div 
              className={`absolute bottom-0 left-0 right-0 rounded-b-[34px] transition-all duration-1000 ease-in-out overflow-hidden ${getLiquidColor()}`}
              style={{ height: `${Math.min(95, 20 + (volume / 50) * 75)}%` }}
            >
              <div className="absolute inset-0">
                {Array.from({ length: particleCount }).map((_, i) => (
                  <Particle key={i} containerWidth={320} containerHeight={380} speed={particleSpeed} />
                ))}
              </div>
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
            <div className="flex flex-col items-center">
              <div className="w-12 h-48 bg-white rounded-full border-4 border-slate-300 relative flex flex-col items-center py-4 shadow-2xl">
                <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800 mb-4">
                  <span className="text-[10px] font-black text-emerald-400 font-mono">{temp.toFixed(1)}°</span>
                </div>
                <div className="w-2 flex-1 bg-slate-100 rounded-full relative overflow-hidden">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${temp > 52.5 ? 'bg-[#e41b13]' : 'bg-[#1E562F]'}`}
                    style={{ height: `${((temp - 25) / 55) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-1 h-20 bg-slate-400" />
              <div className="w-4 h-4 bg-slate-400 rounded-full shadow-md" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ambiente de Laboratório Virtual</p>
          <p className="text-[8px] text-slate-400 font-bold uppercase">IFPA Campus Ananindeua • 2026</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-slate-200 flex items-center justify-center px-8 z-30">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Bacharelado em Ciência e Tecnologia - IFPA | Dante • Thais • Edenilson
        </p>
      </div>
    </div>
  );
};

export default ThermalLab;