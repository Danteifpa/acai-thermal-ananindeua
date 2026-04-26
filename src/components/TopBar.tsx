"use client";

import React from 'react';
import { ChevronRight, Activity, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  view: string;
}

const TopBar = ({ view }: TopBarProps) => {
  const viewLabels: Record<string, string> = {
    dashboard: 'Simulação Térmica',
    database: 'Base de Batedores',
    safety_guide: 'Guia de Segurança',
    security: 'Padrões Técnicos',
    history: 'Histórico',
    memorial: 'Memorial Técnico',
    about: 'Sobre o Projeto',
    settings: 'Configurações'
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-slate-200 font-bold">{viewLabels[view] || view}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motor de Física: Ativo</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800" />
        <div className="flex items-center gap-2 text-purple-400">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Protocolo 52.5°C</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;