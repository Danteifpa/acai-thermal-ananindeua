"use client";

import React, { useMemo } from 'react';
import { 
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
  targetTemp: number;
  isSimulating: boolean;
  currentTime: number;
}

const ThermalChart = ({ targetTemp, isSimulating, currentTime }: ThermalChartProps) => {
  const data = useMemo(() => {
    const points = [];
    const wn = 0.45;
    const zeta = 0.75;
    const T0 = 25;
    const deltaT = targetTemp - T0;

    for (let t = 0; t <= 60; t++) {
      // Resposta de 2ª Ordem: T(t) = T0 + deltaT * (1 - exp(-zeta*wn*t) * (cos(wd*t) + (zeta*wn/wd)*sin(wd*t)))
      // Simplificado para amortecimento crítico/subcrítico
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      const response = 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta * wn / wd) * Math.sin(wd * t));
      const currentT = T0 + deltaT * response;

      points.push({
        time: t,
        temp: t <= currentTime || !isSimulating ? parseFloat(currentT.toFixed(2)) : null,
        threshold: 52.5
      });
    }
    return points;
  }, [targetTemp, currentTime, isSimulating]);

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-[#1E562F]">Resposta do Núcleo (2ª Ordem)</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#1E562F] rounded-full" />
            <span className="text-[8px] font-bold text-slate-400">NÚCLEO</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={[20, 85]} hide />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              labelStyle={{ display: 'none' }}
            />
            
            <ReferenceArea y1={52.5} y2={85} fill="#1E562F" fillOpacity={0.05} />
            
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#1E562F" 
              strokeWidth={3} 
              dot={false} 
              animationDuration={0}
            />

            <ReferenceLine 
              y={52.5} 
              stroke="#1E562F" 
              strokeDasharray="5 5" 
              label={{ position: 'right', value: '52.5°C', fill: '#1E562F', fontSize: 10, fontWeight: 'black' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[8px] text-slate-400 font-bold text-center uppercase tracking-widest">Tempo de Resposta: 60 Segundos</p>
    </div>
  );
};

export default ThermalChart;