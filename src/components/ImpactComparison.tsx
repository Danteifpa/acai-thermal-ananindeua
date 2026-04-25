"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card } from "@/components/ui/card";
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface ImpactComparisonProps {
  currentTemp: number;
  optimizedTemp: number;
}

const ImpactComparison = ({ currentTemp, optimizedTemp }: ImpactComparisonProps) => {
  const data = [
    { name: 'Método Atual', temp: currentTemp, color: '#ef4444' },
    { name: 'AçaíThermal', temp: optimizedTemp, color: '#a855f7' }
  ];

  const gain = (optimizedTemp - currentTemp).toFixed(1);

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-400">
          <TrendingUp size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Medição de Impacto</h3>
        </div>
        <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
          +{gain}°C de Ganho Térmico
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" domain={[0, 85]} hide />
            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            />
            <Bar dataKey="temp" radius={[0, 4, 4, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="temp" position="right" fill="#fff" fontSize={12} formatter={(val: number) => `${val}°C`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-500" size={20} />
          <p className="text-xs text-slate-400 leading-relaxed">
            A otimização sugerida eleva a temperatura final em <span className="text-white font-bold">{gain}°C</span>, 
            garantindo a margem de segurança biológica necessária para o artigo científico.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ImpactComparison;