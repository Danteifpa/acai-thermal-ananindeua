"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { batedoresPesquisa } from '@/data/batedores';

interface BatedoresDatabaseProps {
  onSimulate: (batedor: any) => void;
}

const BatedoresDatabase = ({ onSimulate }: BatedoresDatabaseProps) => {
  const [batedores, setBatedores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('batedores').select('*');
        if (error || !data || data.length === 0) {
          // Se o Supabase estiver vazio, usa os dados da pesquisa local
          setBatedores(batedoresPesquisa);
        } else {
          setBatedores(data);
        }
      } catch (err) {
        setBatedores(batedoresPesquisa);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatus = (volume: number, material: string) => {
    if (volume < 8.5) return { label: '🔴 Risco: Volume Insuficiente', color: 'bg-red-50 text-red-600 border-red-100' };
    if (material !== 'Metal' && material !== 'Tambor') return { label: '⚠️ Atenção: Material Isolante', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: '✅ Conforme', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-blue-700">
        <Info size={20} />
        <p className="text-xs font-medium">Exibindo registros da pesquisa de campo (Ananindeua/PA). Clique em Simular para validar no laboratório.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-900 font-bold py-5 pl-6">Nome Fantasia</TableHead>
              <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
              <TableHead className="text-slate-900 font-bold">Recipiente</TableHead>
              <TableHead className="text-slate-900 font-bold">Volume (L)</TableHead>
              <TableHead className="text-slate-900 font-bold">Status Científico</TableHead>
              <TableHead className="text-slate-900 font-bold text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
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
                      <Play size={12} fill="currentColor" /> Simular
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