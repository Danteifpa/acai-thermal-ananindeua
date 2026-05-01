"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Microscope, 
  Thermometer, 
  FlaskConical, 
  Download, 
  ShieldCheck, 
  Info,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const TrainingAcademy = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Hero Header: Memorial Acadêmico */}
      <header className="text-center space-y-6 border-b border-slate-200 pb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#1E562F] px-4 py-1.5 rounded-full border border-emerald-100">
          <FileText size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Documentação Oficial</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Memorial Acadêmico</h1>
          <h2 className="text-2xl font-bold text-[#1E562F]">Validação Térmica do Processamento de Açaí</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Estudo da Inativação do <span className="italic">Trypanosoma cruzi</span> via Branqueamento e Choque Térmico.
          </p>
        </div>
        <div className="flex justify-center gap-8 pt-4">
          {['Dante Monteiro', 'Thais Chagas', 'Edenilson do Carmo'].map((name) => (
            <div key={name} className="text-center">
              <p className="text-sm font-bold text-slate-900">{name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Pesquisador BCT</p>
            </div>
          ))}
        </div>
      </header>

      {/* 2. Contexto Biológico (The Threat) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[#1E562F]">
            <Microscope size={28} />
            <h3 className="text-2xl font-black uppercase tracking-tight">Contexto Biológico</h3>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              O <span className="font-bold italic text-slate-900">Trypanosoma cruzi</span> é o agente etiológico da Doença de Chagas. Na Região Norte, a <span className="text-[#1E562F] font-bold">transmissão oral</span> tornou-se a principal via de infecção, ocorrendo através da ingestão de alimentos contaminados por fezes do inseto "barbeiro".
            </p>
            <p className="bg-slate-50 border-l-4 border-[#1E562F] p-6 italic rounded-r-xl">
              "A inativação térmica é o método mais eficaz para garantir a segurança do suco de açaí artesanal, exigindo precisão matemática no controle de temperatura."
            </p>
          </div>
        </div>
        <Card className="overflow-hidden border-slate-200 shadow-2xl rounded-3xl group">
          <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800" 
              alt="Microscopia Científica" 
              className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Microscopia Eletrônica</p>
              <p className="text-sm font-bold italic">Trypanosoma cruzi em amostra biológica</p>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Protocolo de Branqueamento (The Solution) */}
      <section className="space-y-10">
        <div className="flex items-center gap-3 text-[#1E562F]">
          <Thermometer size={28} />
          <h3 className="text-2xl font-black uppercase tracking-tight">Protocolo de Branqueamento</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-white border-slate-200 shadow-sm space-y-6 rounded-3xl">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800" 
                alt="Açaí in natura" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Matéria-Prima Selecionada</h4>
              <p className="text-sm text-slate-500">Frutos de <span className="italic">Euterpe oleracea</span> prontos para o processamento térmico.</p>
            </div>
          </Card>
          
          <div className="space-y-4">
            {[
              { step: "01", title: "Higienização", desc: "Remoção de sujidades e catação manual rigorosa." },
              { step: "02", title: "Aquecimento (80°C)", desc: "Elevação da temperatura da água para o choque térmico." },
              { step: "03", title: "Imersão (10s)", desc: "Tempo crítico para inativação superficial de patógenos." },
              { step: "04", title: "Resfriamento", desc: "Estabilização térmica monitorada pelo AçaíThermal." }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl hover:border-[#1E562F]/30 transition-all group">
                <span className="text-3xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors">{item.step}</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <ArrowRight className="ml-auto text-slate-200 group-hover:text-[#1E562F] transition-colors" size={20} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Base Teórica (Physics & Math) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-[#1E562F]">
          <FlaskConical size={28} />
          <h3 className="text-2xl font-black uppercase tracking-tight">Fundamentação Termodinâmica</h3>
        </div>
        <Card className="bg-slate-900 p-12 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <BookOpen size={200} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Equação Fundamental</h4>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                  <p className="text-4xl font-mono font-bold tracking-tighter">Q = m · c · ΔT</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-emerald-400">m</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Massa (Vol)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-emerald-400">c</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Calor Esp.</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-emerald-400">ΔT</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Gradiente</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Lei do Resfriamento de Newton</h4>
              <p className="text-slate-400 leading-relaxed">
                A taxa de transferência de calor é governada pela constante <span className="text-white font-bold">k</span>. 
                Em nossos testes, o <span className="text-emerald-400 font-bold">Aço Inox</span> apresentou uma condutividade significativamente superior ao <span className="text-emerald-400 font-bold">Polímero</span>, 
                exigindo ajustes no tempo de exposição para garantir que o núcleo da polpa atinja os 52.5°C necessários.
              </p>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Info className="text-emerald-400" size={20} />
                <p className="text-xs text-slate-300 italic">O modelo computacional integra estas variáveis para prever o sucesso biológico da amostra.</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Institutional Footer */}
      <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-sm font-black text-slate-900">Bacharelado em Ciência e Tecnologia</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">IFPA Campus Ananindeua | 2026</p>
        </div>
        
        <Button className="bg-[#1E562F] hover:bg-[#164023] text-white gap-3 h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#1E562F]/20 transition-all hover:scale-105">
          <Download size={20} />
          Versão PDF Completa
        </Button>
      </footer>
    </div>
  );
};

export default TrainingAcademy;