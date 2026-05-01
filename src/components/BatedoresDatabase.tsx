"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Play, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Batedor {
  id: string;
  nome: string;
  bairro: string;
  material_padrao: string;
  volume_padrao: number;
}

interface BatedoresDatabaseProps {
  onSimulate: (batedor: any) => void;
}

const BatedoresDatabase = ({ onSimulate }: BatedoresDatabaseProps) => {
  const [batedores, setBatedores] = useState<Batedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const getStatus = (volume: number, material: string) => {
    if (volume < 8.5) return { label: '🔴 Risco (Volume)', color: 'bg-red-50 text-red-600 border-red-100' };
    if (material !== 'Metal' && material !== 'Tambor') return { label: '⚠️ Atenção (Material)', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: '✅ Conforme', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-blue-700">
        <Info size={20} />
        <p className="text-xs font-medium">Base de dados sincronizada com a pesquisa de campo (132 registros mapeados em Ananindeua).</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-900 font-bold py-5 pl-6">Nome Fantasia</TableHead>
              <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
              <TableHead className="text-slate-900 font-bold">Recipiente</TableHead>
              <TableHead className="text-slate-900 font-bold">Volume (L)</TableHead>
              <TableHead className="text-slate-900 font-bold">Status</TableHead>
              <TableHead className="text-slate-900 font-bold text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
            ) : batedores.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">Nenhum batedouro encontrado no banco de dados.</TableCell></TableRow>
            ) : batedores.map((b) => {
              const status = getStatus(b.volume_padrao, b.material_padrao);
              return (
                <TableRow key={b.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="text-slate-900 font-bold pl-6">{b.nome}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{b.bairro}</TableCell>
                  <TableCell><Badge variant="outline" className="border-slate-200 text-slate-600">{b.material_padrao}</Badge></TableCell>
                  <TableCell className="text-[#1E562F] font-mono font-bold">{b.volume_padrao}L</TableCell>
                  <TableCell><Badge className={status.color}>{status.label}</Badge></TableCell>
                  <TableCell className="text-right pr-6">
                    <Button 
                      size="sm" 
                      onClick={() => onSimulate(b)} 
                      className="bg-[#1E562F] hover:bg-[#164023] text-white gap-2 rounded-xl transition-all shadow-sm"
                    >
                      <Play size={12} fill="currentColor" /> Simular no Laboratório
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BatedoresDatabase;