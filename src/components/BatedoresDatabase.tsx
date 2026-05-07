"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Play, Upload, Database, Search, Filter, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { showSuccess, showError } from '@/utils/toast';

interface Batedor {
  id: string;
  nome: string;
  bairro: string;
  material: string;
  volume_padrao: number;
  status_risco?: string;
}

interface BatedoresDatabaseProps {
  onSimulate: (batedor: any) => void;
}

const BatedoresDatabase = ({ onSimulate }: BatedoresDatabaseProps) => {
  const [batedores, setBatedores] = useState<Batedor[]>([]);
  const [filteredBatedores, setFilteredBatedores] = useState<Batedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bairroFilter, setBairroFilter] = useState('todos');

  const fetchBatedores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('batedouros_ananindeua').select('*').order('nome');
      if (error) throw error;
      setBatedores(data || []);
      setFilteredBatedores(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar batedores:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBatedores(); }, []);

  useEffect(() => {
    let result = batedores;
    if (searchTerm) {
      result = result.filter(b => b.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (bairroFilter !== 'todos') {
      result = result.filter(b => b.bairro === bairroFilter);
    }
    setFilteredBatedores(result);
  }, [searchTerm, bairroFilter, batedores]);

  const bairros = Array.from(new Set(batedores.map(b => b.bairro))).sort();

  // Função de Normalização de Materiais (Conforme solicitado)
  const normalizeMaterial = (rawMaterial: string): string => {
    const m = rawMaterial?.toLowerCase() || '';
    if (m.includes('plástico') || m.includes('balde') || m.includes('polietileno')) return 'Plástico';
    if (m.includes('inox') || m.includes('metal') || m.includes('aço')) return 'Metal';
    if (m.includes('isopor')) return 'Isopor (Isolante)';
    return 'Outro';
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
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws);

        // Limpa a tabela antes da nova migração (Opcional, dependendo do fluxo)
        await supabase.from('batedouros_ananindeua').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const formattedData = rawData.map((row: any) => {
          const nome = row['1- Nome Fantasia'] || row['Nome'];
          const volumeStr = String(row['Unidade (Litros/Lata)'] || row['Volume'] || '0');
          const volume = parseFloat(volumeStr.replace(',', '.'));
          const rawMaterial = row['Armazenamento do fruto'] || row['Material'] || 'Não Informado';
          
          if (!nome || isNaN(volume)) return null;

          return {
            nome,
            bairro: row['Bairro'] || 'Não Informado',
            material: normalizeMaterial(rawMaterial),
            volume_padrao: volume,
            status_risco: volume < 8.5 ? '🔴 Risco Térmico' : '✅ Conforme'
          };
        }).filter(Boolean);

        // Bulk Insert no Supabase
        const { error } = await supabase.from('batedouros_ananindeua').insert(formattedData);
        if (error) throw error;

        showSuccess(`${formattedData.length} batedouros normalizados e migrados.`);
        fetchBatedores();
      } catch (err: any) {
        showError("Erro na normalização/migração: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Buscar batedouro por nome..." 
              className="pl-10 h-12 rounded-xl border-slate-200 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={bairroFilter} onValueChange={setBairroFilter}>
            <SelectTrigger className="w-[200px] h-12 rounded-xl border-slate-200 bg-white">
              <Filter className="mr-2 text-slate-400" size={16} />
              <SelectValue placeholder="Filtrar Bairro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Bairros</SelectItem>
              {bairros.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-3">
          <input type="file" id="csv-migrator" className="hidden" accept=".csv, .xlsx" onChange={handleFileUpload} />
          <Button asChild disabled={isProcessing} className="w-full bg-[#1E562F] hover:bg-[#164023] h-12 rounded-xl font-bold gap-2 cursor-pointer shadow-sm">
            <label htmlFor="csv-migrator">
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
              Importar Dados Pesquisa
            </label>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-900 font-bold py-5 pl-6">Batedouro</TableHead>
              <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
              <TableHead className="text-slate-900 font-bold">Material Normalizado</TableHead>
              <TableHead className="text-slate-900 font-bold">Volume (L)</TableHead>
              <TableHead className="text-slate-900 font-bold">Status Prévio</TableHead>
              <TableHead className="text-slate-900 font-bold text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
            ) : filteredBatedores.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">Nenhum batedouro encontrado.</TableCell></TableRow>
            ) : filteredBatedores.map((b) => (
              <TableRow key={b.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                <TableCell className="text-slate-900 font-bold pl-6">{b.nome}</TableCell>
                <TableCell className="text-slate-500 text-sm">{b.bairro}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "border-slate-200",
                    b.material === 'Metal' ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50"
                  )}>
                    {b.material}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#1E562F] font-mono font-bold">{b.volume_padrao}L</TableCell>
                <TableCell>
                  <Badge className={b.status_risco?.includes('🔴') ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}>
                    {b.status_risco}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button 
                    size="sm" 
                    onClick={() => onSimulate(b)} 
                    className="bg-[#1E562F] hover:bg-[#164023] text-white gap-2 rounded-xl"
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