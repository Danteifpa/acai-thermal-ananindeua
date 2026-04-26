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
  ComposedChart
} from 'recharts';

interface ThermalChartProps {
  k: number;
  isSafe: boolean;
}

const ThermalChart = ({ k, isSafe }: ThermalChartProps) => {
  const T0 = 80;
  const TENV = 25;
  const duration = 1200; // 20 minutes in seconds
  
  // Generate data points based on Newton's Law of Cooling: T(t) = Tenv + (T0 - Tenv) * e^(-kt)
  const data = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * duration;
    const temp = TENV + (T0 - TENV) * Math.exp(-k * t);
    return {
      time: Math.round(t / 60), // minutes
      temp: parseFloat(temp.toFixed(2)),
      safetyThreshold: 52.5
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Curva de Resfriamento T(t)</h3>
          <p className="text-[10px] text-slate-500 font-medium">Modelo: Lei do Resfriamento de Newton</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold">
          <div className="flex items-center gap-1 text-[#1E562F]">
            <div className="w-2 h-2 bg-[#1E562F] rounded-full" />
            <span>Simulação</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <div className="w-2 h-0.5 bg-slate-300 border-t border-dashed border-slate-500" />
            <span>Limite 52.5°C</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              label={{ value: 'Tempo (min)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis 
              domain={[20, 85]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              formatter={(value: number) => [`${value}°C`, 'Temperatura']}
              labelFormatter={(label) => `${label} min`}
            />
            
            {/* Safety Zone Shading */}
            <Area 
              type="monotone" 
              dataKey="temp" 
              fill={isSafe ? "#1E562F" : "#e41b13"} 
              fillOpacity={0.05} 
              stroke="none" 
            />

            <ReferenceLine 
              y={52.5} 
              stroke="#94a3b8" 
              strokeDasharray="3 3" 
              label={{ position: 'right', value: '52.5°C', fill: '#94a3b8', fontSize: 10 }} 
            />

            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke={isSafe ? "#1E562F" : "#e41b13"} 
              strokeWidth={3} 
              dot={false}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThermalChart;