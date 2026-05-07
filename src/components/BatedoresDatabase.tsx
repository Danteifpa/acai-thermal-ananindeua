"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Play, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BatedorForm from './BatedorForm';
import { cn } from "@/lib/utils";

interface Batedor {
  id: string;
  nome: string;
  bairro: string;
  material: string;
  volume_padrao: number;
  x?: number;
  y?: number;
}

interface BatedoresDatabaseProps {
  onSimulate: (batedor: any) => void;
}

const BatedoresDatabase = ({ onSimulate }: BatedoresDatabaseProps) => {
  const [batedores, setBatedores] = useState<Batedor[]>([]);
  const [filteredBatedores, setFilteredBatedores] = useState<Batedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bairroFilter, setBairroFilter] = useState('todos');

  const TABLE_NAME = 'batedouros';

  const fetchBatedores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('created_at', { ascending: false });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-1 gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Buscar batedouro..." 
              className="pl-10 h-12 rounded-xl border-slate-200 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={bairroFilter} onValueChange={setBairroFilter}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl border-slate-200 bg-white">
              <Filter className="mr-2 text-slate-400" size={16} />
              <SelectValue placeholder="Bairro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {bairros.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <BatedorForm onSuccess={fetchBatedores} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-900 font-bold py-5 pl-6">Batedouro</TableHead>
              <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
              <TableHead className="text-slate-900 font-bold">Armazenamento</TableHead>
              <TableHead className="text-slate-900 font-bold">Volume</TableHead>
              <TableHead className="text-slate-900 font-bold text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
            ) : filteredBatedores.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400">Nenhum batedouro cadastrado.</TableCell></TableRow>
            ) : filteredBatedores.map((b) => (
              <TableRow key={b.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                <TableCell className="text-slate-900 font-bold pl-6">{b.nome}</TableCell>
                <TableCell className="text-slate-500 text-sm">{b.bairro}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "border-slate-200",
                    b.material === 'Inox' ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50"
                  )}>
                    {b.material}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#1E562F] font-mono font-bold">{b.volume_padrao}L</TableCell>
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