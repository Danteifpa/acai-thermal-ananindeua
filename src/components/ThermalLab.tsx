"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Flame, 
  Info, 
  Box, 
  FlaskConical
} from 'lucide-react';

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

  useEffect(() => {
    setVel(v => ({
      x: (v.x / (Math.abs(v.x) || 1)) * (Math.random() * speed),
      y: (v.y / (Math.abs(v.y) || 1)) * (Math.random() * speed)
    }));
  }, [speed]);

  return (
    <div 
      className="absolute w-1 h-1 bg-white/60 rounded-full"
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
  onMaterialChange,
  onVolumeChange
}: ThermalLabProps) => {
  const deltaT = Math.abs(temp - 80).toFixed(1);
  const specificHeat = material === 'Metal' ? 0.50 : 2.30;
  const particleSpeed = useMemo(() => 1 + (temp / 20), [temp]);
  const particleCount = 40;

  const getLiquidColor = () => {
    if (temp > 70) return 'bg-red-500/80';
    if (temp > 52.5) return 'bg-purple-600/80';
    return 'bg-blue-500/80';
  };

  return (
    <div className="relative w-full h-[700px] bg-white rounded-3xl border border-slate-200 overflow-hidden font-mono flex shadow-sm">
      
      {/* Scientific HUD - Left Side */}
      <div className="w-72 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 z-20">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Painel de Dados</h3>
          <p className="text-xs text-slate-500">Termodinâmica em Tempo Real</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase">ΔT (Variação)</p>
            <p className="text-2xl font-black text-slate-900">{deltaT}°C</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Calor Específico (c)</p>
            <p className="text-2xl font-black text-blue-600">{specificHeat.toFixed(2)} <span className="text-[10px] text-slate-400">kJ/kg·K</span></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Energia (Q)</p>
            <p className="text-2xl font-black text-amber-500">{Math.floor(q).toLocaleString()} <span className="text-[10px] text-slate-400">J</span></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Status Biológico</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-sm font-bold ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
                {isSafe ? 'INATIVADO' : 'RISCO ATIVO'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 text-slate-400 mb-4">
            <Info size={14} />
            <span className="text-[9px] font-bold uppercase">Controles de Bancada</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onMaterialChange('Metal')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${material === 'Metal' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <FlaskConical size={20} />
              <span className="text-[8px] font-bold uppercase">Inox</span>
            </button>
            <button 
              onClick={() => onMaterialChange('Plástico')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${material === 'Plástico' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Box size={20} />
              <span className="text-[8px] font-bold uppercase">Polímero</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Experiment Area */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-50">
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <div className="absolute top-8 left-8 flex gap-4 z-30">
          <motion.div 
            drag 
            dragConstraints={{ left: 0, right: 400, top: 0, bottom: 400 }}
            className="w-14 h-14 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm"
          >
            <Flame className="text-orange-500" size={28} />
          </motion.div>
          <motion.div 
            drag 
            dragConstraints={{ left: 0, right: 400, top: 0, bottom: 400 }}
            className="w-14 h-14 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm"
          >
            <Droplets className="text-blue-500" size={28} />
          </motion.div>
        </div>

        <div className="relative group">
          <div className={`relative w-80 h-96 border-x-[6px] border-b-[6px] rounded-b-[40px] bg-white/80 backdrop-blur-sm transition-all duration-500 ${material === 'Metal' ? 'border-slate-300 shadow-lg' : 'border-slate-200 shadow-sm'}`}>
            <div 
              className={`absolute bottom-0 left-0 right-0 rounded-b-[34px] transition-all duration-1000 ease-in-out overflow-hidden ${getLiquidColor()}`}
              style={{ height: `${Math.min(95, 20 + (volume / 50) * 75)}%` }}
            >
              <div className="absolute inset-0">
                {Array.from({ length: particleCount }).map((_, i) => (
                  <Particle key={i} containerWidth={320} containerHeight={380} speed={particleSpeed} />
                ))}
              </div>
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/10 animate-pulse" />
            </div>
          </div>

          <motion.div 
            drag
            dragConstraints={{ left: -150, right: 150, top: -100, bottom: 250 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 z-40 cursor-grab active:cursor-grabbing"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-48 bg-white rounded-full border-4 border-slate-200 relative flex flex-col items-center py-4 shadow-xl">
                <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800 mb-4">
                  <span className="text-[10px] font-black text-green-400">{temp.toFixed(1)}°</span>
                </div>
                <div className="w-2 flex-1 bg-slate-100 rounded-full relative overflow-hidden">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${temp > 52.5 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ height: `${((temp - 25) / 55) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-1 h-20 bg-slate-300" />
              <div className="w-4 h-4 bg-slate-300 rounded-full shadow-md" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 right-8 text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ambiente de Laboratório Virtual</p>
          <p className="text-[8px] text-slate-300 font-bold uppercase">IFPA Campus Ananindeua • 2026</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-slate-200 flex items-center justify-center px-8 z-30">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Bacharelado em Ciência e Tecnologia - IFPA | Dante Monteiro • Thais Chagas • Edenilson do Carmo
        </p>
      </div>
    </div>
  );
};

export default ThermalLab;