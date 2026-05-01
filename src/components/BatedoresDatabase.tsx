"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Upload, Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { showSuccess, showError } from '@/utils/toast';

interface Batedor {
  id: string;
  nome: string;
  bairro: string;
  material_padrao: string;
  volume_padrao: number;
  status_risco?: string;
}

interface BatedoresDatabaseProps {
  onSimulate: (batedor: any) => void;
}

const BatedoresDatabase = ({ onSimulate }: BatedoresDatabaseProps) => {
  const [batedores, setBatedores] = useState<Batedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  const fetchBatedores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('batedores').select('*').order('nome');
      if (error) throw error;
      setBatedores(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar batedores:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBatedores(); }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const formattedData = data.map((row: any) => {
          const volume = parseFloat(row['Unidade (Litros/Lata)']) || 0;
          const material = row['Armazenamento do fruto'] || 'Não Informado';
          
          let status = '✅ Conforme';
          if (volume < 8.5) status = '🔴 Risco: Volume Insuficiente';
          else if (material !== 'Metal' && material !== 'Tambores') status = '⚠️ Atenção: Material Isolante';

          return {
            nome: row['1- Nome Fantasia'] || 'Sem Nome',
            bairro: row['Bairro'] || 'Não Informado',
            material_padrao: material,
            volume_padrao: volume,
            status_risco: status
          };
        });

        const { error } = await supabase.from('batedores').insert(formattedData);
        if (error) throw error;

        showSuccess(`${formattedData.length} batedouros importados com sucesso!`);
        fetchBatedores();
      } catch (err: any) {
        showError("Erro na importação: " + err.message);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-[#1E562F]">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Base de Dados Científica</h3>
            <p className="text-xs text-slate-500 font-medium">{batedores.length} batedouros registrados no Supabase.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <input
            type="file"
            id="csv-upload"
            className="hidden"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
          />
          <Button 
            asChild
            variant="outline" 
            className="border-slate-200 text-slate-600 gap-2 h-12 px-6 rounded-xl font-bold cursor-pointer"
          >
            <label htmlFor="csv-upload">
              {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              Importar Pesquisa (CSV/XLSX)
            </label>
          </Button>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-900 font-bold py-5 pl-6">Nome Fantasia</TableHead>
              <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
              <TableHead className="text-slate-900 font-bold">Recipiente</TableHead>
              <TableHead className="text-slate-900 font-bold">Volume (L)</TableHead>
              <TableHead className="text-slate-900 font-bold">Status de Risco</TableHead>
              <TableHead className="text-slate-900 font-bold text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
            ) : batedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Database size={48} strokeWidth={1} />
                    <p className="font-medium">Nenhum dado no Supabase. Use o botão de importação acima.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : batedores.map((b) => (
              <TableRow key={b.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                <TableCell className="text-slate-900 font-bold pl-6">{b.nome}</TableCell>
                <TableCell className="text-slate-500 text-sm">{b.bairro}</TableCell>
                <TableCell><Badge variant="outline" className="border-slate-200 text-slate-600">{b.material_padrao}</Badge></TableCell>
                <TableCell className="text-[#1E562F] font-mono font-bold">{b.volume_padrao}L</TableCell>
                <TableCell>
                  <Badge className={
                    b.status_risco?.includes('🔴') ? "bg-red-50 text-red-600 border-red-100" :
                    b.status_risco?.includes('⚠️') ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }>
                    {b.status_risco || '✅ Conforme'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button 
                    size="sm" 
                    onClick={() => onSimulate(b)} 
                    className="bg-[#1E562F] hover:bg-[#164023] text-white gap-2 rounded-xl transition-all shadow-sm"
                  >
                    <Play size={12} fill="currentColor" /> Simular
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BatedoresDatabase;