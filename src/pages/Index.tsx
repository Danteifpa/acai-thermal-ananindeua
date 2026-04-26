"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { ViewType } from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ThermalValidation from '@/components/ThermalValidation';
import DashboardStats from '@/components/DashboardStats';
import FieldManagement from '@/components/FieldManagement';
import SafetyProtocols from '@/components/SafetyProtocols';
import TrainingAcademy from '@/components/TrainingAcademy';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
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
      case 'home':
        return (
          <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <header className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Início</h1>
              <p className="text-slate-500 text-lg">Resumo das atividades de validação térmica.</p>
            </header>
            <DashboardStats records={records} />
            <div className="bg-white border border-slate-200 p-10 rounded-3xl text-center space-y-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Bem-vindo ao AçaíThermal</h3>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Este sistema foi desenvolvido para auxiliar batedores de açaí na validação científica do processo de branqueamento, 
                garantindo a eliminação do Trypanosoma cruzi através de modelos termodinâmicos rigorosos.
              </p>
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
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-100">
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