"use client";

import React from 'react';
import FoodSafetyGuide from './FoodSafetyGuide';
import SafetyStandards from './SafetyStandards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, BookOpen } from 'lucide-react';

const SafetyProtocols = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Protocolos de Segurança</h1>
        <p className="text-slate-500 text-lg">Diretrizes técnicas e biológicas para o processamento seguro.</p>
      </header>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1 h-12 rounded-xl mb-8 shadow-sm">
          <TabsTrigger value="guide" className="data-[state=active]:bg-[#1E562F] data-[state=active]:text-white rounded-lg gap-2 px-6 font-bold text-slate-600">
            <ShieldCheck size={18} /> Guia de Boas Práticas
          </TabsTrigger>
          <TabsTrigger value="standards" className="data-[state=active]:bg-[#1E562F] data-[state=active]:text-white rounded-lg gap-2 px-6 font-bold text-slate-600">
            <BookOpen size={18} /> Padrões Técnicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="mt-0">
          <FoodSafetyGuide />
        </TabsContent>

        <TabsContent value="standards" className="mt-0">
          <SafetyStandards />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafetyProtocols;