"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { ShieldCheck, Droplets, Box } from 'lucide-react';

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
      label: 'Status Sanitário',
      value: `${complianceRate.toFixed(1)}% Seguro`,
      subtext: `${safeCount} de ${total} amostras`,
      icon: ShieldCheck,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Volume Médio',
      value: `${avgVolume.toFixed(1)} Litros`,
      subtext: 'Média Ananindeua/PA',
      icon: Droplets,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Material Predominante',
      value: predominantMaterial,
      subtext: 'Uso majoritário local',
      icon: Box,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border-slate-200 p-6 flex items-center gap-4 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
          <div className={`${stat.bg} p-3 rounded-xl`}>
            <stat.icon className={stat.color} size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-slate-400 text-xs mt-1">{stat.subtext}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;