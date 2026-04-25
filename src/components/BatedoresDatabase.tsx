"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { batedoresData } from '@/data/batedores';
import { Database, MapPin, Beaker } from 'lucide-react';

const BatedoresDatabase = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Base de Dados: Batedores</h1>
        <p className="text-slate-400 text-lg">Mapeamento de unidades de processamento em Ananindeua/PA para fins de pesquisa.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-xl">
            <Database className="text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Total Mapeado</p>
            <p className="text-2xl font-black text-white">{batedoresData.length}</p>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl">
            <MapPin className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Região Foco</p>
            <p className="text-2xl font-black text-white">Ananindeua</p>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className="bg-green-500/10 p-3 rounded-xl">
            <Beaker className="text-green-400" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Status Pesquisa</p>
            <p className="text-2xl font-black text-white">Ativo</p>
          </div>
        </Card>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Nome do Batedouro</TableHead>
              <TableHead className="text-slate-400">Localização</TableHead>
              <TableHead className="text-slate-400">Material Atual</TableHead>
              <TableHead className="text-slate-400">Volume Típico</TableHead>
              <TableHead className="text-slate-400 text-right">Método</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batedoresData.map((batedor) => (
              <TableRow key={batedor.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                <TableCell className="text-white font-bold">{batedor.nome}</TableCell>
                <TableCell className="text-slate-400 text-sm">{batedor.localizacao}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    {batedor.material_atual}
                  </Badge>
                </TableCell>
                <TableCell className="text-purple-400 font-mono">{batedor.volume_atual}L</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-purple-600/10 text-purple-400 border-purple-600/20">
                    {batedor.metodo}
                  </Badge>
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