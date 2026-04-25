"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ThermalChartProps {
  data: { time: number; temp: number }[];
}

const ThermalChart = ({ data }: ThermalChartProps) => {
  return (
    <div className="h-[300px] w-full bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
      <h3 className="text-slate-400 text-sm font-medium mb-4">Curva de Resfriamento (Simulação 600s)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            domain={[20, 85]}
            label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#a855f7' }}
          />
          <ReferenceLine y={52.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Limite Crítico', fill: '#ef4444', fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="#a855f7" 
            strokeWidth={3} 
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThermalChart;