"use client";

import React from 'react';
import DashboardStats from './DashboardStats';
import FeatureCards from './FeatureCards';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, History } from 'lucide-react';
import { format } from 'date-fns';

interface HomeDashboardProps {
  records: any[];
  onStartSimulation: () => void;
}

const HomeDashboard = ({ records, onStartSimulation }: HomeDashboardProps) => {
  // Mock data para preencher se não houver registros reais suficientes
  const mockRecords = [
    { id: '1', created_at: new Date().toISOString(), volume: 15, material: 'Plástico', status_sanitario: 'Processo Seguro' },
    { id: '2', created_at: new Date().toISOString(), volume: 20, material: 'Metal', status_sanitario: 'Processo Seguro' },
    { id: '3', created_at: new Date().toISOString(), volume: 10, material: 'Plástico', status_sanitario: 'Risco Biológico' },
    { id: '4', created_at: new Date().toISOString(), volume: 25, material: 'Metal', status_sanitario: 'Processo Seguro' },
    { id: '5', created_at: new Date().toISOString(), volume: 12, material: 'Plástico', status_sanitario: 'Processo Seguro' },
  ];

  const displayRecords = records.length > 0 ? records.slice(0, 5) : mockRecords;

  return (
    <div className="space-y-12 relative">
      {/* Background Pattern (Açaí Leaves) */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M100 20C120 50 150 80 150 120C150 160 120 180 100 180C80 180 50 160 50 120C50 80 80 50 100 20Z" fill="#1E562F" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Dashboard Operacional</h1>
          <p className="text-slate-500 text-lg font-medium">Monitoramento científico e validação de segurança térmica.</p>
        </div>
        <Button 
          onClick={onStartSimulation}
          className="bg-[#1E562F] hover:bg-[#164023] text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#1E562F]/20 transition-all hover:scale-105 gap-3"
        >
          <Play size={20} fill="currentColor" />
          Iniciar Nova Simulação
        </Button>
      </header>

      <DashboardStats records={records} />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-[#1E562F] rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pilares do Projeto</h2>
        </div>
        <FeatureCards />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="text-[#1E562F]" size={24} />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Registro Recente de Simulações</h2>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold">Últimas 5 Amostras</Badge>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-slate-900 font-bold py-6 pl-8">Amostra ID</TableHead>
                <TableHead className="text-slate-900 font-bold">Data/Hora</TableHead>
                <TableHead className="text-slate-900 font-bold">Volume</TableHead>
                <TableHead className="text-slate-900 font-bold">Material</TableHead>
                <TableHead className="text-slate-900 font-bold text-right pr-8">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRecords.map((record, i) => (
                <TableRow key={i} className="border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="font-mono text-xs text-slate-400 pl-8">
                    #{record.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-slate-900 font-bold">{record.volume}L</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-200 text-slate-500">{record.material}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Badge 
                      className={record.status_sanitario === 'Processo Seguro' 
                        ? "bg-emerald-50 text-[#1E562F] border-emerald-100" 
                        : "bg-red-50 text-[#e41b13] border-red-100"
                      }
                    >
                      {record.status_sanitario}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default HomeDashboard;