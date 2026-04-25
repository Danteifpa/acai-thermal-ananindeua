"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ThermalValidation from '@/components/ThermalValidation';
import RecordsTable from '@/components/RecordsTable';
import { supabase } from '@/lib/supabase';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [records, setRecords] = useState([]);

  const fetchRecords = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('amostras_termicas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error("Erro ao buscar registros:", err);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          <header className="flex flex-col gap-1">
            <h1 className="text-4xl font-black text-white tracking-tight">Validação Térmica</h1>
            <p className="text-slate-400 text-lg">Monitoramento de segurança biológica para processamento de Açaí.</p>
          </header>

          <ThermalValidation onRecordSaved={fetchRecords} />

          <RecordsTable records={records} />
          
          <footer className="pt-10 border-t border-slate-900">
            <MadeWithDyad />
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;