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
  ComposedChart
} from 'recharts';

interface ThermalChartProps {
  k: number;
  isSafe: boolean;
}

const ThermalChart = ({ k, isSafe }: ThermalChartProps) => {
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

  const color = isSafe ? "#55FF00" : "#ef4444";

  return (
    <div className="lab-card p-6 space-y-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="lab-title text-[10px]">Curva de Resfriamento</h3>
          <p className="text-[8px] text-slate-600 font-bold uppercase">Modelo: Newton_Cooling_v1</p>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#475569', fontWeight: 'bold' }}
            />
            <YAxis 
              domain={[20, 85]} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#475569', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #55FF00', color: '#55FF00', fontSize: '10px', borderRadius: '8px' }}
              itemStyle={{ color: '#55FF00' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke={color} 
              strokeWidth={2} 
              dot={false}
              animationDuration={1000}
            />

            <ReferenceLine 
              y={52.5} 
              stroke="rgba(255, 255, 255, 0.2)" 
              strokeDasharray="3 3" 
              label={{ position: 'right', value: '52.5°C', fill: 'rgba(255, 255, 255, 0.3)', fontSize: 8, fontWeight: 'bold' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThermalChart;