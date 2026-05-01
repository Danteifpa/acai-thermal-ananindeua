"use client";

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  ComposedChart,
  Dot
} from 'recharts';
import { motion } from 'framer-motion';

interface ThermalChartProps {
  k: number;
  isSafe: boolean;
  currentTemp: number;
}

const ThermalChart = ({ k, isSafe, currentTemp }: ThermalChartProps) => {
  const T0 = 80;
  const TENV = 25;
  const duration = 1200; 
  
  const data = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * duration;
    const temp = TENV + (T0 - TENV) * Math.exp(-k * t);
    return {
      time: Math.round(t / 60),
      temp: parseFloat(temp.toFixed(2)),
    };
  });

  // Cor dinâmica baseada na temperatura (Simulando espectro térmico)
  const getLineColor = () => {
    if (currentTemp > 70) return "#e41b13"; // Vermelho (Infravermelho)
    if (currentTemp > 52.5) return "#1E562F"; // Verde (Seguro)
    return "#3b82f6"; // Azul (Frio)
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
      className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm relative overflow-hidden"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Análise Espectral T(t)</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Timing: Cubic-Bezier (0.645, 0.045, 0.355, 1)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full animate-pulse-glow" style={{ backgroundColor: getLineColor() }} />
            <span className="text-[10px] font-black uppercase text-slate-400">Pico Ativo</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getLineColor()} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={getLineColor()} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
            />
            <YAxis 
              domain={[20, 85]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: 'black', color: '#1e293b', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="none"
              fill="url(#colorTemp)"
              animationDuration={800}
              animationEasing="cubic-in-out"
            />

            <ReferenceLine 
              y={52.5} 
              stroke="#94a3b8" 
              strokeDasharray="5 5" 
              label={{ position: 'right', value: 'LIMITE 52.5°C', fill: '#94a3b8', fontSize: 9, fontWeight: 'black' }} 
            />

            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke={getLineColor()} 
              strokeWidth={4} 
              dot={false}
              activeDot={{ r: 8, strokeWidth: 0, fill: getLineColor(), className: "animate-pulse" }}
              animationDuration={800}
              animationEasing="cubic-in-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Ponto Pulsante de Wien (Simulado no tempo atual) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
        <div className="w-64 h-64 rounded-full border border-slate-200 animate-ping" />
      </div>
    </motion.div>
  );
};

export default ThermalChart;