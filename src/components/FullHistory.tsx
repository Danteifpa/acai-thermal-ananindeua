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
    
    if (isCompliance) {
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('IFPA - INSTITUTO FEDERAL DO PARÁ', 14, 15);
      doc.text('SEMAD - SECRETARIA MUNICIPAL DE ADMINISTRAÇÃO', 14, 22);
      
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text('RELATÓRIO DE VIGILÂNCIA SANITÁRIA', 14, 35);
    } else {
      doc.setFontSize(20);
      doc.text('Relatório de Validação Térmica - AçaíThermal', 14, 22);
    }
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, isCompliance ? 45 : 30);

    const tableData = records.map(r => [
      format(new Date(r.created_at), 'dd/MM/yyyy HH:mm'),
      r.nome_batedouro,
      r.material,
      `${r.volume}L`,
      `${r.temp_final}°C`,
      r.status_sanitario
    ]);

    autoTable(doc, {
      startY: isCompliance ? 55 : 40,
      head: [['Data/Hora', 'Batedouro', 'Material', 'Volume', 'Temp. Final', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: isCompliance ? [22, 101, 52] : [124, 58, 237] },
    });

    if (isCompliance) {
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(10);
      doc.text('__________________________________________', 14, finalY + 30);
      doc.text('Assinatura do Responsável Técnico', 14, finalY + 35);
    }

    const fileName = isCompliance ? 'relatorio-vigilancia' : 'relatorio-acai-thermal';
    doc.save(`${fileName}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Histórico Completo</h1>
          <p className="text-slate-400 text-lg">Gestão de dados e exportação de relatórios técnicos.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => exportToPDF(true)}
            className="bg-green-600/10 border-green-600/20 text-green-500 hover:bg-green-600 hover:text-white gap-2 h-12 px-6 rounded-xl font-bold transition-all"
          >
            <ShieldCheck size={20} />
            Relatório Vigilância
          </Button>
          <Button 
            onClick={() => exportToPDF(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-12 px-6 rounded-xl font-bold"
          >
            <FileDown size={20} />
            Download PDF
          </Button>
        </div>
      </header>

      <RecordsTable records={records} />
    </div>
  );
};

export default FullHistory;