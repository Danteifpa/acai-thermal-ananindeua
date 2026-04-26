"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Droplets } from 'lucide-react';

interface ThermalLabProps {
  volume: number;
  material: string;
  temp: number;
  isSafe: boolean;
  particleSpeed: number;
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
  particleSpeed 
}: ThermalLabProps) => {
  const particleCount = 40;

  const getLiquidColor = () => {
    if (temp > 70) return 'bg-[#e41b13]'; // IFPA Red
    if (temp > 52.5) return 'bg-[#1E562F]'; // Deep IFPA Green
    return 'bg-blue-600';
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Lab Icons */}
      <div className="absolute top-6 left-6 flex gap-3">
        <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center shadow-sm">
          <Flame className="text-orange-600" size={20} />
        </div>
        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shadow-sm">
          <Droplets className="text-blue-600" size={20} />
        </div>
      </div>

      {/* Beaker and Thermometer */}
      <div className="relative group scale-110">
        <div className={`relative w-64 h-80 border-x-[6px] border-b-[6px] rounded-b-[40px] bg-white/90 backdrop-blur-sm transition-all duration-500 ${material === 'Metal' ? 'border-slate-400 shadow-2xl' : 'border-slate-200 shadow-lg'}`}>
          <div 
            className={`absolute bottom-0 left-0 right-0 rounded-b-[34px] transition-all duration-1000 ease-in-out overflow-hidden ${getLiquidColor()}`}
            style={{ height: `${Math.min(95, 20 + (volume / 50) * 75)}%` }}
          >
            <div className="absolute inset-0">
              {Array.from({ length: particleCount }).map((_, i) => (
                <Particle key={i} containerWidth={256} containerHeight={320} speed={particleSpeed} />
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Thermometer */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-40">
          <div className="flex flex-col items-center">
            <div className="w-10 h-40 bg-white rounded-full border-4 border-slate-300 relative flex flex-col items-center py-3 shadow-2xl">
              <div className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 mb-3">
                <span className="text-[9px] font-black text-emerald-400 font-mono">{temp.toFixed(1)}°</span>
              </div>
              <div className="w-1.5 flex-1 bg-slate-100 rounded-full relative overflow-hidden">
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${temp > 52.5 ? 'bg-[#e41b13]' : 'bg-[#1E562F]'}`}
                  style={{ height: `${((temp - 25) / 55) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-0.5 h-16 bg-slate-400" />
            <div className="w-3 h-3 bg-slate-400 rounded-full shadow-md" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 text-right">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Visualização em Tempo Real</p>
      </div>
    </div>
  );
};

export default ThermalLab;