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
  BookOpen,
  Scale,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const TrainingAcademy = () => {
  const steps = [
    { title: "Recebimento", desc: "Pesagem e inspeção inicial dos frutos." },
    { title: "Seleção", desc: "Catação manual para remoção de impurezas." },
    { title: "Lavagem", desc: "Remoção de sujidades com água potável." },
    { title: "Sanitização", desc: "Imersão em solução clorada (150-200 ppm)." },
    { title: "Enxágue", desc: "Eliminação de resíduos de cloro." },
    { title: "Branqueamento", desc: "Choque térmico a 80°C por 10 segundos." },
    { title: "Resfriamento", desc: "Redução imediata da temperatura." },
    { title: "Despolpamento", desc: "Extração mecânica da polpa." },
    { title: "Envase", desc: "Acondicionamento em embalagens atóxicas." },
    { title: "Refrigeração", desc: "Armazenamento final entre 0°C e 5°C." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Hero Header */}
      <header className="text-center space-y-6 border-b border-slate-200 pb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#1E562F] px-4 py-1.5 rounded-full border border-emerald-100">
          <FileText size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Memorial Técnico-Científico</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Validação Térmica</h1>
          <h2 className="text-2xl font-bold text-[#1E562F]">Protocolo Embrapa Amapá (CT 151)</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Garantia da Segurança Alimentar e Conformidade com o Decreto nº 326/2012 - PA.
          </p>
        </div>
      </header>

      {/* 2. Base Normativa e Sanitária */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 bg-white border-slate-200 shadow-sm space-y-6 rounded-3xl">
          <div className="flex items-center gap-3 text-[#1E562F]">
            <Scale size={24} />
            <h3 className="text-xl font-black uppercase tracking-tight">Base Normativa e Sanitária</h3>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              O protocolo de branqueamento (80°C por 10 segundos) é a pedra angular da legislação paraense para o processamento de açaí. Este método é validado cientificamente para a inativação de patógenos críticos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-[#1E562F] uppercase mb-1">Legislação Estadual</p>
                <p className="text-sm font-bold text-slate-900">Decreto nº 326/2012 - PA</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-[#1E562F] uppercase mb-1">Referência Técnica</p>
                <p className="text-sm font-bold text-slate-900">Embrapa Amapá (CT 151)</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-[#1E562F] text-white space-y-6 rounded-3xl shadow-xl shadow-[#1E562F]/20">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            <h3 className="text-lg font-bold">Alvos Microbiológicos</h3>
          </div>
          <ul className="space-y-3">
            {['Trypanosoma cruzi', 'Salmonella spp.', 'Escherichia coli'].map((target) => (
              <li key={target} className="flex items-center gap-3 text-sm font-medium bg-white/10 p-3 rounded-xl border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="italic">{target}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-emerald-200/70 leading-relaxed">
            A inativação térmica garante a eliminação completa destes agentes sem alterar as propriedades organolépticas.
          </p>
        </Card>
      </section>

      {/* 3. Process Roadmap (10 Steps) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-[#1E562F]">
          <BookOpen size={28} />
          <h3 className="text-2xl font-black uppercase tracking-tight">Fluxograma de Processamento (BPF)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="group relative p-6 bg-white border border-slate-100 rounded-2xl hover:border-[#1E562F]/30 transition-all hover:shadow-md">
              <span className="absolute top-4 right-4 text-xs font-black text-slate-100 group-hover:text-emerald-50 transition-colors">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-2">{step.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</p>
              {i === 5 && (
                <div className="mt-3 inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border border-amber-100">
                  <Thermometer size={8} /> Ponto Crítico
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Base Teórica e Justificativa Inox */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-[#1E562F]">
          <FlaskConical size={28} />
          <h3 className="text-2xl font-black uppercase tracking-tight">Fundamentação e Materiais</h3>
        </div>
        <Card className="bg-slate-900 p-12 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-8 flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Fonte: Embrapa Amapá</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Modelo Matemático de Validação</h4>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                  <p className="text-4xl font-mono font-bold tracking-tighter">Q = m · c · ΔT</p>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={18} />
                  <h5 className="text-xs font-bold uppercase">Justificativa: Aço Inox</h5>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  O uso de <span className="text-white font-bold">Aço Inoxidável</span> é uma exigência das Boas Práticas de Fabricação (BPF). Sua superfície não porosa impede a formação de biofilmes e focos de contaminação, além de possuir alta condutividade térmica, essencial para o resfriamento rápido pós-branqueamento.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Inativação Térmica</h4>
              <p className="text-slate-400 leading-relaxed">
                A simulação computacional do AçaíThermal utiliza a constante <span className="text-white font-bold">k</span> para prever se a polpa atingiu o equilíbrio térmico necessário. O gradiente térmico (ΔT) entre a água a 80°C e a polpa in natura é o motor da inativação microbiológica.
              </p>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Info className="text-emerald-400" size={20} />
                <p className="text-xs text-slate-300 italic">O processo garante a eliminação de patógenos sem comprometer as antocianinas (pigmentos antioxidantes).</p>
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
        
        <div className="flex gap-4">
          <Button variant="outline" className="border-slate-200 text-slate-600 gap-2 h-14 px-6 rounded-2xl font-bold">
            <ExternalLink size={18} />
            Ver Decreto 326
          </Button>
          <Button className="bg-[#1E562F] hover:bg-[#164023] text-white gap-3 h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#1E562F]/20 transition-all hover:scale-105">
            <Download size={20} />
            Relatório Técnico
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default TrainingAcademy;