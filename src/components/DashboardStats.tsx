"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle2, BarChart3, Zap, Users } from 'lucide-react';
import { isToday } from 'date-fns';

interface DashboardStatsProps {
  records: any[];
}

const DashboardStats = ({ records }: DashboardStatsProps) => {
  const todayRecords = records.filter(r => isToday(new Date(r.created_at)));
  
  const complianceRate = records.length > 0 
    ? (records.filter(r => r.status_sanitario === 'Processo Seguro').length / records.length) * 100 
    : 0;

  const materialStats = records.reduce((acc: any, curr) => {
    if (!acc[curr.material]) acc[curr.material] = { count: 0, safe: 0 };
    acc[curr.material].count++;
    if (curr.status_sanitario === 'Processo Seguro') acc[curr.material].safe++;
    return acc;
  }, {});

  const mostEfficient = Object.entries(materialStats).sort((a: any, b: any) => 
    (b[1].safe / b[1].count) - (a[1].safe / a[1].count)
  )[0]?.[0] || 'N/A';

  const stats = [
    {
      label: 'Validações Hoje',
      value: todayRecords.length,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      label: 'Taxa de Conformidade',
      value: `${complianceRate.toFixed(1)}%`,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      label: 'Material Eficiente',
      value: mostEfficient,
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className={`${stat.bg} p-3 rounded-xl`}>
            <stat.icon className={stat.color} size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;