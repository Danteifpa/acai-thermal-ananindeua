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
  const duration = 1200; 
  
  const data = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * duration;
    const temp = TENV + (T0 - TENV) * Math.exp(-k * t);
    return {
      time: Math.round(t / 60),
      temp: parseFloat(temp.toFixed(2)),
    };
  });

  const color = isSafe ? "#39FF14" : "#FF3131";

  return (
    <div className="nasa-panel p-6 space-y-4 relative overflow-hidden oscilloscope-grid">
      <div className="flex justify-between items-center relative z-10">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-[#39FF14] uppercase tracking-[0.3em] neon-text-glow">Telemetria Térmica</h3>
          <p className="text-[9px] text-[#39FF14]/50 font-bold uppercase">Sensor: Newton_Cooling_Probe_01</p>
        </div>
        <div className="text-[9px] font-black text-[#39FF14]/30 uppercase">Frequência: 60Hz</div>
      </div>

      <div className="h-64 w-full font-mono relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="rgba(57, 255, 20, 0.1)" />
            <XAxis 
              dataKey="time" 
              axisLine={{ stroke: '#39FF14', strokeWidth: 1 }} 
              tickLine={{ stroke: '#39FF14' }} 
              tick={{ fontSize: 10, fill: '#39FF14', fontWeight: 'bold' }}
            />
            <YAxis 
              domain={[20, 85]} 
              axisLine={{ stroke: '#39FF14', strokeWidth: 1 }} 
              tickLine={{ stroke: '#39FF14' }} 
              tick={{ fontSize: 10, fill: '#39FF14', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #39FF14', color: '#39FF14' }}
              itemStyle={{ color: '#39FF14', fontSize: '10px' }}
              labelStyle={{ color: '#39FF14', fontWeight: 'bold', fontSize: '10px' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke={color} 
              strokeWidth={2} 
              dot={false}
              animationDuration={2000}
              style={{ filter: `drop-shadow(0 0 5px ${color})` }}
            />

            <ReferenceLine 
              y={52.5} 
              stroke="#00FFFF" 
              strokeDasharray="3 3" 
              label={{ position: 'right', value: 'CRITICAL_LIMIT', fill: '#00FFFF', fontSize: 8, fontWeight: 'bold' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-2 right-4 text-[8px] text-[#39FF14]/20 font-black uppercase">
        NASA_SCIENTIFIC_VISUALIZATION_ENGINE
      </div>
    </div>
  );
};

export default ThermalChart;