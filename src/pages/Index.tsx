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
  const [currentView, setCurrentView] = useState<ViewType>('lab'); // Iniciando no Lab como solicitado
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
              <h1 className="text-4xl font-black text-white tracking-tight">Início</h1>
              <p className="text-slate-500 text-lg">Resumo das atividades de validação térmica.</p>
            </header>
            <DashboardStats records={records} />
            <div className="lab-card p-12 rounded-[2rem] text-center space-y-6">
              <h3 className="text-3xl font-bold text-[#55FF00]">Bem-vindo ao AçaíThermal</h3>
              <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-lg">
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
    <div className="flex min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-[#55FF00]/30">
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