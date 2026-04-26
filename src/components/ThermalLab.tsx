"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
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
  // 1. Hooks at the top level
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resizing and initial dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation Logic
  useEffect(() => {
    // 3. Safety Check: Ensure container and canvas exist
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const getLiquidColor = (t: number) => {
      if (t < 52.5) {
        const ratio = (t - 25) / (52.5 - 25);
        const r = Math.floor(59 + (234 - 59) * ratio);
        const g = Math.floor(130 + (179 - 130) * ratio);
        const b = Math.floor(246 + (37 - 246) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        const ratio = Math.min(1, (t - 52.5) / (80 - 52.5));
        const r = Math.floor(234 + (239 - 234) * ratio);
        const g = Math.floor(179 + (68 - 179) * ratio);
        const b = Math.floor(37 + (68 - 37) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const liquidColor = getLiquidColor(temp);
      const fillHeight = Math.min(0.9, 0.2 + (volume / 50) * 0.7);
      const rectHeight = canvas.height * fillHeight;
      const startY = canvas.height - rectHeight;

      // Draw Liquid
      ctx.fillStyle = liquidColor;
      ctx.beginPath();
      ctx.moveTo(0, startY);
      
      // Wave effect
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = startY + Math.sin(x * 0.05 + offset) * 3;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Add some "bubbles" for heat effect
      if (temp > 50) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 5; i++) {
          const bx = (Math.sin(offset + i) * 0.5 + 0.5) * canvas.width;
          const by = canvas.height - ((offset * 50 + i * 100) % rectHeight);
          ctx.beginPath();
          ctx.arc(bx, by, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      offset += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, temp, volume]);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden font-mono shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Physics HUD - Left */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Zap size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Troca de Energia (Q)</span>
          </div>
          <div className="text-2xl font-black text-white">
            {q.toLocaleString()} <span className="text-xs font-normal text-slate-500">J</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Activity size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Condutividade (k)</span>
          </div>
          <div className="text-2xl font-black text-white">
            {k.toFixed(5)} <span className="text-xs font-normal text-slate-500">s⁻¹</span>
          </div>
        </div>
      </div>

      {/* Physics HUD - Right */}
      <div className="absolute top-6 right-6 z-10 space-y-4">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Timer size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Timer de Inativação</span>
          </div>
          <div className="text-2xl font-black text-white">
            {isSafe ? (600 - timeToCritical).toFixed(0) : "0"} <span className="text-xs font-normal text-slate-500">s</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-1">Tempo acima de 52.5°C</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-56 shadow-lg">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Thermometer size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Temperatura Final</span>
          </div>
          <div className="text-2xl font-black text-white">
            {temp.toFixed(1)} <span className="text-xs font-normal text-slate-500">°C</span>
          </div>
        </div>
      </div>

      {/* 2D Schematic Container */}
      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <div className="relative w-64 h-80">
          {/* Container Walls */}
          <div className={`absolute inset-0 border-x-4 border-b-4 rounded-b-3xl z-20 ${material === 'Metal' ? 'border-slate-400 bg-slate-400/10' : 'border-slate-600 bg-slate-600/10'}`}>
            <canvas 
              ref={canvasRef}
              width={256}
              height={320}
              className="absolute inset-0 rounded-b-[20px]"
            />
            {/* Material Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
              Recipiente: {material === 'Metal' ? 'Aço Inox' : 'Polietileno'}
            </div>
          </div>

          {/* Volume Indicator */}
          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between py-4 text-[10px] text-slate-600 font-bold">
            <span>50L</span>
            <span>25L</span>
            <span>0L</span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Status: {isSafe ? 'Seguro' : 'Risco Biológico'}
            </span>
          </div>
        </div>
        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
          Simulação Física v2.0 | IFPA BCT
        </div>
      </div>
    </div>
  );
};

export default ThermalLab;