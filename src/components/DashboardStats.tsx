"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { ShieldCheck, Droplets, Box, BarChart3, CheckCircle2 } from 'lucide-react';

interface DashboardStatsProps {
  records: any[];
}

const DashboardStats = ({ records }: DashboardStatsProps) => {
  const total = records.length;
  const safeCount = records.filter(r => r.status_sanitario === 'Processo Seguro').length;
  const complianceRate = total > 0 ? (safeCount / total) * 100 : 0;
  
  const avgVolume = total > 0 
    ? records.reduce((acc, curr) => acc + curr.volume, 0) / total 
    : 0;

  const materialCounts = records.reduce((acc: any, curr) => {
    acc[curr.material] = (acc[curr.material] || 0) + 1;
    return acc;
  }, {});
  
  const predominantMaterial = Object.entries(materialCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';

  const stats = [
    {
      label: 'Total de Lotes',
      value: total.toString(),
      subtext: 'Validações realizadas',
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Eficiência Média',
      value: `${complianceRate.toFixed(1)}%`,
      subtext: 'Processos seguros',
      icon: CheckCircle2,
      color: 'text-[#1E562F]',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Status Sanitário',
      value: safeCount.toString(),
      subtext: 'Amostras aprovadas',
      icon: ShieldCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Volume Médio',
      value: `${avgVolume.toFixed(1)}L`,
      subtext: 'Média por amostra',
      icon: Droplets,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Material Base',
      value: predominantMaterial,
      subtext: 'Uso majoritário',
      icon: Box,
      color: 'text-slate-600',
      bg: 'bg-slate-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border-slate-200 p-5 flex flex-col gap-3 hover:border-[#1E562F]/30 transition-all shadow-sm rounded-2xl">
          <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-slate-500 text-[10px] font-medium">{stat.subtext}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;