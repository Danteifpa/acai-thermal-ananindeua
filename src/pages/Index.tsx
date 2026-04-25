"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { ViewType } from '@/components/Sidebar';
import ThermalValidation from '@/components/ThermalValidation';
import RecordsTable from '@/components/RecordsTable';
import SafetyStandards from '@/components/SafetyStandards';
import FullHistory from '@/components/FullHistory';
import Settings from '@/components/Settings';
import TechnicalMemorial from '@/components/TechnicalMemorial';
import DashboardStats from '@/components/DashboardStats';
import { supabase } from '@/lib/supabase';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [records, setRecords] = useState([]);
  const [thermalConstants, setThermalConstants] = useState({
    metal: 0.004,
    plastic: 0.0015
  });

  const fetchRecords = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('amostras_termicas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error("Erro ao buscar registros:", err);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col gap-1">
              <h1 className="text-4xl font-black text-white tracking-tight">Validação Térmica</h1>
              <p className="text-slate-400 text-lg">Monitoramento de segurança biológica para processamento de Açaí.</p>
            </header>
            
            <DashboardStats records={records} />
            
            <ThermalValidation 
              onRecordSaved={fetchRecords} 
              constants={thermalConstants}
            />
            <RecordsTable records={records.slice(0, 5)} />
          </div>
        );
      case 'security':
        return <SafetyStandards />;
      case 'history':
        return <FullHistory records={records} />;
      case 'memorial':
        return <TechnicalMemorial />;
      case 'settings':
        return <Settings constants={thermalConstants} onUpdate={setThermalConstants} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto">
        <div className={currentView === 'memorial' ? "" : "max-w-6xl mx-auto p-8 space-y-10"}>
          {renderView()}
          
          {currentView !== 'memorial' && (
            <footer className="pt-10 border-t border-slate-900">
              <MadeWithDyad />
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;