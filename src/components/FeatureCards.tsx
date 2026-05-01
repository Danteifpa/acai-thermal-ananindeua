"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { ShieldCheck, Thermometer, Scale } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      title: "Segurança Biológica",
      desc: "Foco na inativação total do Trypanosoma cruzi e Salmonella spp.",
      icon: ShieldCheck,color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Precisão Térmica",
      desc: "Cálculos baseados na Lei de Resfriamento de Newton e condutividade térmica.",
      icon: Thermometer,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Conformidade Legal",
      desc: "Protocolo alinhado ao Comunicado Técnico 151 da Embrapa Amapá.",
      icon: Scale,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <Card key={i} className="bg-white border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all rounded-3xl group">
          <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
            <f.icon size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCards;