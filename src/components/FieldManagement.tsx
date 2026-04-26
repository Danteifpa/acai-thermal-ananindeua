"use client";

import React from 'react';
import BatedoresDatabase from './BatedoresDatabase';
import RecordsTable from './RecordsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, History } from 'lucide-react';

interface FieldManagementProps {
  records: any[];
  onSimulate: (batedor: any) => void;
}

const FieldManagement = ({ records, onSimulate }: FieldManagementProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Gestão de Campo</h1>
        <p className="text-slate-400 text-lg">Monitoramento de batedouros e histórico de validações.</p>
      </header>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 h-12 rounded-xl mb-8">
          <TabsTrigger value="database" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 px-6">
            <Database size={18} /> Base de Batedores
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 px-6">
            <History size={18} /> Histórico de Experimentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="mt-0">
          <BatedoresDatabase onSimulate={onSimulate} />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <RecordsTable records={records} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldManagement;