"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Upload, Database, Trash2, AlertCircle } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const clearDatabase = async () => {
    const { error } = await supabase.from('batedores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);

        // 1. Limpeza Obrigatória
        await clearDatabase();

        // 2. Mapeamento Rígido e Tratamento de Erros
        const formattedData = rawData.map((row: any) => {
          const nome = row['1- Nome Fantasia'];
          const volumeRaw = row['Unidade (Litros/Lata)'];
          const volume = typeof volumeRaw === 'number' ? volumeRaw : parseFloat(String(volumeRaw).replace(',', '.'));
          const material = row['Armazenamento do fruto'] || 'Não Informado';
          const bairro = row['Bairro'] || 'Não Informado';

          // Pula se não houver nome ou volume válido
          if (!nome || isNaN(volume)) return null;

          let status = '✅ Conforme';
          if (volume < 8.5) status = '🔴 Risco: Volume Insuficiente';
          else if (material !== 'Metal' && material !== 'Tambores') status = '⚠️ Atenção: Material Isolante';

          return {
            nome,
            bairro,
            material_padrao: material,
            volume_padrao: volume,
            status_risco: status
          };
        }).filter(Boolean);

        // 3. Injeção via API (Upsert/Insert)
        const { error } = await supabase.from('batedores').insert(formattedData);
        if (error) throw error;

        showSuccess(`Sucesso! ${formattedData.length} registros importados e validados.`);
        fetchBatedores();
      } catch (err: any) {
        showError("Falha no processamento: " + err.message);
      } finally {
        setIsProcessing(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-[#1E562F] p-4 rounded-2xl text-white shadow-lg shadow-[#1E562F]/20">
            <Database size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Base de Dados da Pesquisa</h3>
            <p className="text-sm text-slate-500 font-medium">
              {batedores.length} batedouros sincronizados com o Supabase.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="file"
            id="csv-upload-strict"
            className="hidden"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
          />
          <Button 
            asChild
            disabled={isProcessing}
            className="flex-1 md:flex-none bg-[#1E562F] hover:bg-[#164023] text-white gap-3 h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#1E562F]/20 transition-all hover:scale-105 cursor-pointer"
          >
            <label htmlFor="csv-upload-strict">
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              Reiniciar Importação
            </label>
          </Button>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="text-slate-900 font-black uppercase tracking-widest text-[10px] py-6 pl-10">Nome Fantasia</TableHead>
              <TableHead className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Bairro</TableHead>
              <TableHead className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Recipiente</TableHead>
              <TableHead className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Volume</TableHead>
              <TableHead className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Status de Risco</TableHead>
              <TableHead className="text-slate-900 font-black uppercase tracking-widest text-[10px] text-right pr-10">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-32"><Loader2 className="animate-spin mx-auto text-[#1E562F]" size={40} /></TableCell></TableRow>
            ) : batedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-32">
                  <div className="flex flex-col items-center gap-4 text-slate-300">
                    <AlertCircle size={64} strokeWidth={1} />
                    <p className="text-lg font-bold">Nenhum dado persistido. Inicie a importação acima.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : batedores.map((b) => (
              <TableRow key={b.id} className="border-slate-100 hover:bg-slate-50 transition-colors group">
                <TableCell className="text-slate-900 font-bold pl-10 py-5">{b.nome}</TableCell>
                <TableCell className="text-slate-500 text-sm font-medium">{b.bairro}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold px-3 py-1 rounded-lg">
                    {b.material_padrao}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#1E562F] font-mono font-black text-lg">{b.volume_padrao}L</TableCell>
                <TableCell>
                  <Badge className={
                    b.status_risco?.includes('🔴') ? "bg-red-50 text-red-600 border-red-100 px-4 py-1.5 rounded-full font-bold" :
                    b.status_risco?.includes('⚠️') ? "bg-amber-50 text-amber-600 border-amber-100 px-4 py-1.5 rounded-full font-bold" :
                    "bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 rounded-full font-bold"
                  }>
                    {b.status_risco || '✅ Conforme'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <Button 
                    onClick={() => onSimulate(b)} 
                    className="bg-[#1E562F] hover:bg-[#164023] text-white gap-2 h-11 px-6 rounded-xl transition-all shadow-md hover:scale-105 font-bold"
                  >
                    <Play size={14} fill="currentColor" /> Simular
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