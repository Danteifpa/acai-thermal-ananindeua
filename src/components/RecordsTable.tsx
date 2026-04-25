"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface Record {
  id: string;
  created_at: string;
  nome_batedouro: string;
  material: string;
  volume: number;
  temp_final: number;
  status_sanitario: string;
}

const RecordsTable = ({ records }: { records: Record[] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Últimos Registros</h2>
        <Badge variant="outline" className="text-slate-400 border-slate-700">
          {records.length} Amostras
        </Badge>
      </div>
      <Table>
        <TableHeader className="bg-slate-950">
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Data/Hora</TableHead>
            <TableHead className="text-slate-400">Batedouro</TableHead>
            <TableHead className="text-slate-400">Material</TableHead>
            <TableHead className="text-slate-400">Volume</TableHead>
            <TableHead className="text-slate-400">Temp. Final</TableHead>
            <TableHead className="text-slate-400 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                <TableCell className="text-slate-300 font-mono text-xs">
                  {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell className="text-white font-medium">{record.nome_batedouro}</TableCell>
                <TableCell className="text-slate-400">{record.material}</TableCell>
                <TableCell className="text-slate-400">{record.volume}L</TableCell>
                <TableCell className="text-purple-400 font-bold">{record.temp_final}°C</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    className={record.status_sanitario === 'Processo Seguro' 
                      ? "bg-green-500/10 text-green-500 border-green-500/20" 
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                    }
                  >
                    {record.status_sanitario}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecordsTable;