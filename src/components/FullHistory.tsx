"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Info } from 'lucide-react';
import RecordsTable from './RecordsTable';

interface FullHistoryProps {
  records: any[];
}

const FullHistory = ({ records }: FullHistoryProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Histórico de Validações</h1>
          <p className="text-slate-400 text-lg">Gestão de dados científicos e monitoramento de amostras.</p>
        </div>
      </header>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-3 text-blue-400">
        <Info size={20} />
        <p className="text-sm font-medium">A exportação de relatórios PDF está temporariamente desativada para manutenção do servidor.</p>
      </div>

      <RecordsTable records={records} />
    </div>
  );
};

export default FullHistory;