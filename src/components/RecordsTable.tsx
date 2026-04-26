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
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Registros Científicos</h2>
        <Badge variant="outline" className="text-slate-500 border-slate-200">
          {records.length} Amostras
        </Badge>
      </div>
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="text-slate-900 font-bold">ID</TableHead>
            <TableHead className="text-slate-900 font-bold">Timestamp</TableHead>
            <TableHead className="text-slate-900 font-bold">Material</TableHead>
            <TableHead className="text-slate-900 font-bold">Volume</TableHead>
            <TableHead className="text-slate-900 font-bold">Temp. Final</TableHead>
            <TableHead className="text-slate-900 font-bold text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                Nenhum dado científico encontrado.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                <TableCell className="text-slate-400 font-mono text-[10px]">
                  {record.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="text-slate-600 font-mono text-xs">
                  {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm:ss')}
                </TableCell>
                <TableCell className="text-slate-900 font-medium">{record.material}</TableCell>
                <TableCell className="text-slate-600">{record.volume}L</TableCell>
                <TableCell className="text-[#1E562F] font-bold">{record.temp_final}°C</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    className={record.status_sanitario === 'Processo Seguro' 
                      ? "bg-emerald-50 text-[#1E562F] border-emerald-100" 
                      : "bg-red-50 text-[#e41b13] border-red-100"
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