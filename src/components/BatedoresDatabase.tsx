"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, MapPin, Play, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

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

  const getSafetyStatus = (volume: number, material: string) => {
    if (volume < 8.5) return { label: '🔴 RISCO: Volume Insuficiente', color: 'bg-red-50 text-red-600 border-red-100' };
    if (material === 'Plástico') return { label: '⚠️ ATENÇÃO: Perda Térmica Alta', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: '✅ PADRÃO: Seguro', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Base de Dados: 132 Batedouros</h1>
          <p className="text-slate-500 text-lg">Mapeamento de Ananindeua/PA - Pesquisa de Campo.</p>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-900 font-bold">Nome Fantasia</TableHead>
              <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
              <TableHead className="text-slate-900 font-bold">Material</TableHead>
              <TableHead className="text-slate-900 font-bold">Volume (L)</TableHead>
              <TableHead className="text-slate-900 font-bold">Status de Segurança</TableHead>
              <TableHead className="text-slate-900 font-bold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
            ) : batedores.map((b) => {
              const status = getSafetyStatus(b.volume_padrao, b.material_padrao);
              return (
                <TableRow key={b.id} className="border-slate-200 hover:bg-slate-50 transition-colors">
                  <TableCell className="text-slate-900 font-bold">{b.nome}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{b.bairro}</TableCell>
                  <TableCell><Badge variant="outline" className="border-slate-200 text-slate-600">{b.material_padrao}</Badge></TableCell>
                  <TableCell className="text-[#1E562F] font-mono font-bold">{b.volume_padrao}L</TableCell>
                  <TableCell><Badge className={status.color}>{status.label}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onSimulate(b)} className="bg-emerald-50 text-[#1E562F] hover:bg-[#1E562F] hover:text-white border border-emerald-100 gap-2 rounded-lg transition-all">
                      <Play size={14} /> Simular
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