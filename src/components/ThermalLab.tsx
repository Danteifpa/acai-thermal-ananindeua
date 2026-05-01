"use client";

import React, { useState, useEffect } from 'react';
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
      className="absolute w-1 h-1 bg-[#39FF14]/40 rounded-full"
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
  const particleCount = 30;

  const getLiquidColor = () => {
    if (temp > 70) return 'bg-red-600/40';
    if (temp > 52.5) return 'bg-[#39FF14]/20';
    return 'bg-blue-600/20';
  };

  const getBorderColor = () => {
    return material === 'Metal' ? 'border-slate-600' : 'border-slate-800';
  };

  return (
    <div className="relative w-full h-[400px] bg-black/20 rounded-[5px] border border-white/5 overflow-hidden flex items-center justify-center">
      {/* Grid Background Sutil */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      {/* Beaker */}
      <div className="relative scale-90">
        <div className={`relative w-56 h-72 border-x-2 border-b-2 rounded-b-[20px] bg-black/40 backdrop-blur-sm transition-all duration-500 ${getBorderColor()}`}>
          <div 
            className={`absolute bottom-0 left-0 right-0 rounded-b-[18px] transition-all duration-1000 ease-in-out overflow-hidden ${getLiquidColor()}`}
            style={{ height: `${Math.min(95, 20 + (volume / 50) * 75)}%` }}
          >
            <div className="absolute inset-0">
              {Array.from({ length: particleCount }).map((_, i) => (
                <Particle key={i} containerWidth={224} containerHeight={288} speed={particleSpeed} />
              ))}
            </div>
          </div>
        </div>

        {/* Thermometer Minimalista */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-32 bg-black/60 rounded-full border border-white/10 relative flex flex-col items-center py-2">
            <div className="w-1 flex-1 bg-slate-900 rounded-full relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-500 bg-[#39FF14]"
                style={{ height: `${((temp - 25) / 55) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-4">
        <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Simulação Ativa</p>
      </div>
    </div>
  );
};

export default ThermalLab;