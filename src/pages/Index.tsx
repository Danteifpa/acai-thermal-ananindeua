"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { ViewType } from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ThermalValidation from '@/components/ThermalValidation';
import RecordsTable from '@/components/RecordsTable';
import Settings from '@/components/Settings';
import DashboardStats from '@/components/DashboardStats';
import BatedoresDatabase from '@/components/BatedoresDatabase';
import FoodSafetyGuide from '@/components/FoodSafetyGuide';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [records, setRecords] = useState([]);
  const [selectedBatedor, setSelectedBatedor] = useState<any>(null);
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

  const handleSimulate = (batedor: any) => {
    setSelectedBatedor(batedor);
    setCurrentView('lab');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <header className="space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tight">Resumo de Atividades</h1>
              <p className="text-slate-400 text-lg">Visão geral das validações térmicas e monitoramento.</p>
            </header>
            <DashboardStats records={records} />
            <div className="pt-8 border-t border-slate-900">
              <RecordsTable records={records.slice(0, 10)} />
            </div>
          </div>
        );
      case 'lab':
        return (
          <div className="animate-in fade-in duration-500">
            <ThermalValidation 
              onRecordSaved={fetchRecords} 
              constants={thermalConstants}
              initialData={selectedBatedor}
            />
          </div>
        );
      case 'database':
        return (
          <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
            <BatedoresDatabase onSimulate={handleSimulate} />
          </div>
        );
      case 'safety_guide':
        return (
          <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
            <FoodSafetyGuide />
          </div>
        );
      case 'settings':
        return (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <Settings constants={thermalConstants} onUpdate={setThermalConstants} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar view={currentView} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-12 space-y-12">
            {renderView()}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;