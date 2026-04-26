"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { ViewType } from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ThermalValidation from '@/components/ThermalValidation';
import RecordsTable from '@/components/RecordsTable';
import SafetyStandards from '@/components/SafetyStandards';
import FullHistory from '@/components/FullHistory';
import Settings from '@/components/Settings';
import TechnicalMemorial from '@/components/TechnicalMemorial';
import DashboardStats from '@/components/DashboardStats';
import BatedoresDatabase from '@/components/BatedoresDatabase';
import FoodSafetyGuide from '@/components/FoodSafetyGuide';
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
            <DashboardStats records={records} />
            <ThermalValidation 
              onRecordSaved={fetchRecords} 
              constants={thermalConstants}
              initialData={selectedBatedor}
            />
            <div className="pt-8 border-t border-slate-900">
              <RecordsTable records={records.slice(0, 5)} />
            </div>
          </div>
        );
      case 'database':
        return <BatedoresDatabase onSimulate={handleSimulate} />;
      case 'safety_guide':
        return <FoodSafetyGuide />;
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
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar view={currentView} />
        
        <main className="flex-1 overflow-y-auto">
          <div className={currentView === 'memorial' ? "" : "max-w-[1600px] mx-auto p-8 space-y-10"}>
            {renderView()}
            {currentView !== 'memorial' && <Footer />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;