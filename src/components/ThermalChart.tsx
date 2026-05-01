"use client";

import React from 'react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ComposedChart,
  ReferenceArea,
  Legend
} from 'recharts';

interface ThermalChartProps {
  k: number; 
  isSafe: boolean;
}

const ThermalChart = ({ k, isSafe }: ThermalChartProps) => {
  const T0_WATER = 80;
  const T0_ACAI = 25;
  const TENV = 25;
  const duration = 1200; 
  
  const data = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * duration;
    
    // Temperatura da Água (Decaimento externo)
    const waterTemp = TENV + (T0_WATER - TENV) * Math.exp(-k * t);
    
    // Temperatura do Núcleo do Açaí (Aquecimento interno até o equilíbrio)
    // Simplificado: tende ao equilíbrio térmico calculado
    const equilibrium = 52.5; // Alvo científico
    const acaiTemp = T0_ACAI + (equilibrium - T0_ACAI) * (1 - Math.exp(-0.005 * t));

    return {
      time: Math.round(t / 60),
      waterTemp: parseFloat(waterTemp.toFixed(2)),
      acaiTemp: parseFloat(acaiTemp.toFixed(2)),
    };
  });

  return (
    <div className="clinical-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="ifpa-title text-[10px]">Estabilidade Térmica: Água vs Núcleo</h3>
          <p className="text-[8px] text-slate-400 font-bold uppercase">Análise de Penetração de Calor</p>
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
            />
            <YAxis 
              domain={[20, 85]} 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '10px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
            
            <ReferenceArea 
              y1={52.5} 
              y2={85} 
              fill={isSafe ? "#1E562F" : "#e41b13"} 
              fillOpacity={0.03} 
            />

            <Line 
              name="Temp. Água (Externa)"
              type="monotone" 
              dataKey="waterTemp" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false}
            />

            <Line 
              name="Temp. Açaí (Núcleo)"
              type="monotone" 
              dataKey="acaiTemp" 
              stroke={isSafe ? "#1E562F" : "#e41b13"} 
              strokeWidth={3} 
              dot={false}
            />

            <ReferenceLine 
              y={52.5} 
              stroke="#1E562F" 
              strokeDasharray="5 5" 
              strokeWidth={1}
              label={{ position: 'right', value: '52.5°C THRESHOLD', fill: '#1E562F', fontSize: 7, fontWeight: 'black' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThermalChart;