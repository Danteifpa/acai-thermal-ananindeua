"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { ViewType } from '@/components/Sidebar';
import ThermalValidation from '@/components/ThermalValidation';
import HomeDashboard from '@/components/HomeDashboard';
import FieldManagement from '@/components/FieldManagement';
import SafetyProtocols from '@/components/SafetyProtocols';
import TrainingAcademy from '@/components/TrainingAcademy';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [records, setRecords] = useState([]);
  const [selectedBatedor, setSelectedBatedor] = useState<any>(null);

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
      case 'home':
        return (
          <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <HomeDashboard 
              records={records} 
              onStartSimulation={() => {
                setSelectedBatedor(null);
                setCurrentView('lab');
              }} 
            />
          </div>
        );
      case 'lab':
        return (
          <div className="animate-in fade-in duration-500">
            <ThermalValidation 
              onRecordSaved={fetchRecords} 
              initialData={selectedBatedor}
            />
          </div>
        );
      case 'field':
        return (
          <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
            <FieldManagement records={records} onSimulate={handleSimulate} />
          </div>
        );
      case 'protocols':
        return (
          <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
            <SafetyProtocols />
          </div>
        );
      case 'academy':
        return (
          <div className="animate-in fade-in duration-500">
            <TrainingAcademy />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#1E562F]/10">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col min-w-0">
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