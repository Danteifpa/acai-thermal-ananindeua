"use client";

import React from 'react';
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
  // 1. Hooks called unconditionally at the top
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [offset, setOffset] = React.useState(0);

  // Handle mounting state
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation loop with Safe Mount Pattern
  React.useEffect(() => {
    if (!isMounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const getLiquidColor = (t: number) => {
      // Fallback to 25 if temp is undefined
      const currentT = t || 25;
      if (currentT < 52.5) {
        const ratio = Math.max(0, (currentT - 25) / (52.5 - 25));
        const r = Math.floor(59 + (234 - 59) * ratio);
        const g = Math.floor(130 + (179 - 130) * ratio);
        const b = Math.floor(246 + (37 - 246) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        const ratio = Math.min(1, (currentT - 52.5) / (80 - 52.5));
        const r = Math.floor(234 + (239 - 234) * ratio);
        const g = Math.floor(179 + (68 - 179) * ratio);
        const b = Math.floor(37 + (68 - 37) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const liquidColor = getLiquidColor(temp);
      const fillPercentage = Math.min(0.9, 0.2 + (volume / 50) * 0.7);
      const h = canvas.height * fillPercentage;
      const y = canvas.height - h;

      // Draw Liquid
      ctx.fillStyle = liquidColor;
      ctx.fillRect(0, y, canvas.width, h);

      // Wave Overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.lineTo(x, y + Math.sin(x * 0.05 + offset) * 5);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMounted, temp, volume, offset]);

  // Wave offset timer
  React.useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      setOffset(prev => prev + 0.1);
    }, 50);
    return () => clearInterval(interval);
  }, [isMounted]);

  // 3. Fallback while initializing
  if (!isMounted) {
    return (
      <div className="w-full h-[450px] bg-slate-950 rounded-3xl border-2 border-slate-800 flex items-center justify-center">
        <div className="text-slate-500 font-mono animate-pulse">Inicializando Laboratório...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden font-mono shadow-2xl">
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

      {/* Schematic */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="relative w-64 h-72 border-x-4 border-b-4 border-slate-700 rounded-b-3xl bg-slate-900/20">
          <canvas 
            ref={canvasRef}
            width={256}
            height={288}
            className="absolute inset-0 rounded-b-[20px]"
          />
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
        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Simulação Física v2.2</div>
      </div>
    </div>
  );
};

export default ThermalLab;