"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface ImpactComparisonProps {
  currentTemp: number;
  optimizedTemp: number;
}

const ImpactComparison = ({ currentTemp, optimizedTemp }: ImpactComparisonProps) => {
  const gain = (optimizedTemp - currentTemp).toFixed(1);

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-400">
          <TrendingUp size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Medição de Impacto</h3>
        </div>
        <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
          +{gain}°C de Ganho
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Método Atual</span>
            <span>{currentTemp}°C</span>
          </div>
          <div className="h-4 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(currentTemp / 85) * 100}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>AçaíThermal</span>
            <span>{optimizedTemp.toFixed(1)}°C</span>
          </div>
          <div className="h-4 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(optimizedTemp / 85) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-500" size={20} />
          <p className="text-xs text-slate-400 leading-relaxed">
            A otimização sugerida garante a margem de segurança biológica necessária.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ImpactComparison;