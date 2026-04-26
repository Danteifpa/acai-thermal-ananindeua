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
import BatedoresDatabase from '@/components/BatedoresDatabase';
import ChallengeMode from '@/components/ChallengeMode';
import About from '@/components/About';
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
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black text-white tracking-tight">AçaíThermal</h1>
                <p className="text-slate-400 text-lg">Scientific Dashboard • IFPA Ananindeua</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20">Dante Monteiro</span>
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20">Thais Chagas</span>
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20">Edenilson do Carmo</span>
                </div>
              </div>
              <div className="w-full md:w-72">
                <ChallengeMode />
              </div>
            </header>
            
            <DashboardStats records={records} />
            
            <ThermalValidation 
              onRecordSaved={fetchRecords} 
              constants={thermalConstants}
              initialData={selectedBatedor}
            />
            <RecordsTable records={records.slice(0, 5)} />
          </div>
        );
      case 'database':
        return <BatedoresDatabase onSimulate={handleSimulate} />;
      case 'security':
        return <SafetyStandards />;
      case 'history':
        return <FullHistory records={records} />;
      case 'memorial':
        return <TechnicalMemorial />;
      case 'about':
        return <About />;
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
          {currentView !== 'memorial' && <Footer />}
        </div>
      </main>
    </div>
  );
};

export default Index;