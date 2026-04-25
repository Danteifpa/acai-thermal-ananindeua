"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

const SafetyStandards = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Padrões de Segurança</h1>
        <p className="text-slate-400 text-lg">Normas técnicas para a eliminação de patógenos no processamento do Açaí.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-8 space-y-4">
          <div className="bg-purple-600/20 w-12 h-12 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-purple-500" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">A Regra dos 52.5°C</h3>
          <p className="text-slate-400 leading-relaxed">
            Para garantir a segurança biológica e a eliminação do <span className="text-white font-semibold italic">Trypanosoma cruzi</span> (causador da Doença de Chagas), o processo de branqueamento deve manter a polpa em uma temperatura mínima de <span className="text-purple-400 font-bold">52.5°C por pelo menos 10 minutos (600 segundos)</span>.
          </p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-8 space-y-4">
          <div className="bg-amber-600/20 w-12 h-12 rounded-xl flex items-center justify-center">
            <AlertCircle className="text-amber-500" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">Riscos Biológicos</h3>
          <p className="text-slate-400 leading-relaxed">
            Temperaturas abaixo do limite crítico não garantem a inativação térmica de patógenos, resultando em um produto com alto risco de contaminação. O monitoramento constante é essencial para a saúde pública.
          </p>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-8">
        <div className="flex items-start gap-4">
          <Info className="text-blue-400 mt-1" size={24} />
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Nota Técnica</h4>
            <p className="text-slate-400">
              Este simulador utiliza a Lei do Resfriamento de Newton para prever a temperatura final baseada no volume e material do recipiente, auxiliando batedouros artesanais a validarem seus processos de forma científica.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SafetyStandards;