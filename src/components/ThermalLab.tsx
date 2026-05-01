"use client";

import React, { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ThermalLabProps {
  volume: number;
  material: string;
  temp: number;
  isSafe: boolean;
  particleSpeed: number;
}

const Pathogen = ({ containerWidth, containerHeight, speed }: { containerWidth: number, containerHeight: number, speed: number }) => {
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
      className="absolute text-red-600/60"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <Bug size={8} />
    </div>
  );
};

const ThermalLab = ({ 
  volume, 
  material, 
  temp, 
  particleSpeed 
}: ThermalLabProps) => {
  const pathogenCount = temp < 52.5 ? 15 : 0;

  const getBorderColor = () => {
    return material === 'Metal' ? 'border-slate-300 bg-slate-100' : 'border-slate-200 bg-white/50';
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
      {/* Grid de Laboratório */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      {/* Beaker */}
      <div className="relative scale-90">
        {/* Reflexo do Vidro */}
        <div className="absolute -left-4 top-0 w-4 h-full bg-white/20 blur-sm rounded-full z-20 pointer-events-none" />
        
        <div className={`relative w-56 h-72 border-x-2 border-b-2 rounded-b-[30px] backdrop-blur-[2px] transition-all duration-500 z-10 ${getBorderColor()}`}>
          {/* Líquido Açaí */}
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-b-[28px] transition-all duration-1000 ease-in-out overflow-hidden bg-[#4A148C]"
            style={{ height: `${Math.min(95, 20 + (volume / 50) * 75)}%` }}
          >
            {/* Patógenos (Trypanosoma cruzi) */}
            <div className="absolute inset-0">
              {Array.from({ length: pathogenCount }).map((_, i) => (
                <Pathogen key={i} containerWidth={224} containerHeight={288} speed={particleSpeed} />
              ))}
            </div>
            
            {/* Efeito de Brilho no Líquido */}
            <div className="absolute top-0 left-0 w-full h-4 bg-white/10" />
          </div>
        </div>

        {/* Termômetro Clínico */}
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-6 h-48 bg-white rounded-full border border-slate-200 relative flex flex-col items-center py-2 shadow-sm">
            <div className="w-1.5 flex-1 bg-slate-100 rounded-full relative overflow-hidden">
              <div 
                className={cn(
                  "absolute bottom-0 left-0 right-0 transition-all duration-500",
                  temp >= 52.5 ? "bg-[#1E562F]" : "bg-[#e41b13]"
                )}
                style={{ height: `${((temp - 25) / 55) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#1E562F] rounded-full animate-pulse" />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Simulação em Tempo Real</p>
      </div>
    </div>
  );
};

export default ThermalLab;