"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ShieldCheck } from 'lucide-react';
import RecordsTable from './RecordsTable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface FullHistoryProps {
  records: any[];
}

const FullHistory = ({ records }: FullHistoryProps) => {
  const exportToPDF = (isCompliance = false) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('AçaíThermal: Relatório de Validação Térmica', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);

    const tableData = records.map(r => [
      format(new Date(r.created_at), 'dd/MM/yyyy HH:mm'),
      r.nome_batedouro,
      r.material,
      `${r.volume}L`,
      `${r.temp_final}°C`,
      r.status_sanitario
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Timestamp', 'Batedouro', 'Material', 'Volume', 'Temp. Final', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237] },
    });

    const fileName = 'relatorio-acai-thermal';
    doc.save(`${fileName}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Histórico de Validações</h1>
          <p className="text-slate-400 text-lg">Gestão de dados científicos e exportação de relatórios técnicos.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => exportToPDF(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-12 px-6 rounded-xl font-bold"
          >
            <FileDown size={20} />
            Exportar Relatório PDF
          </Button>
        </div>
      </header>

      <RecordsTable records={records} />
    </div>
  );
};

export default FullHistory;