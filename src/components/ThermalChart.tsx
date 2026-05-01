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
  ComposedChart,
  ReferenceArea
} from 'recharts';

interface ThermalChartProps {
  k: number; // Aqui k representa o coeficiente de perda h
  isSafe: boolean;
}

const ThermalChart = ({ k, isSafe }: ThermalChartProps) => {
  const T0 = 80;
  const TENV = 25;
  const duration = 1200; 
  
  const data = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * duration;
    // Simulação de decaimento baseada no material (k)
    // Se k for muito baixo (Inox), a temperatura estabiliza no plateau
    const temp = TENV + (T0 - TENV) * Math.exp(-k * t);
    return {
      time: Math.round(t / 60),
      temp: parseFloat(temp.toFixed(2)),
    };
  });

  const color = isSafe ? "#1E562F" : "#e41b13";

  return (
    <div className="clinical-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="ifpa-title text-[10px]">Análise de Estabilidade Térmica</h3>
          <p className="text-[8px] text-slate-400 font-bold uppercase">Plateau vs Decaimento (Figura 3)</p>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="time" 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }}
              label={{ value: 'Minutos', position: 'insideBottomRight', offset: -5, fontSize: 8, fill: '#94a3b8' }}
            />
            <YAxis 
              domain={[20, 85]} 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#1E562F', fontWeight: 'bold' }}
            />
            
            <ReferenceArea 
              y1={52.5} 
              y2={85} 
              fill={isSafe ? "#1E562F" : "#e41b13"} 
              fillOpacity={0.03} 
            />

            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke={color} 
              strokeWidth={3} 
              dot={false}
              animationDuration={1500}
            />

            <ReferenceLine 
              y={52.5} 
              stroke={isSafe ? "#1E562F" : "#e41b13"} 
              strokeDasharray="5 5" 
              strokeWidth={1}
              label={{ position: 'right', value: 'CRITICAL 52.5°C', fill: isSafe ? '#1E562F' : '#e41b13', fontSize: 7, fontWeight: 'black' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThermalChart;