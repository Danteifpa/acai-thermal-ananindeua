"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Bug, 
  CheckCircle2, 
  Droplets, 
  Thermometer, 
  HeartPulse, 
  ShieldAlert,
  Search
} from 'lucide-react';

const FoodSafetyGuide = () => {
  const steps = [
    {
      title: "Passo 1: Catação",
      desc: "Seleção rigorosa dos frutos para remover sujidades e insetos.",
      icon: Search,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Passo 2: Lavagem",
      desc: "Imersão em água clorada para eliminação de microrganismos superficiais.",
      icon: Droplets,
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },
    {
      title: "Passo 3: Branqueamento",
      desc: "Choque térmico validado por este App (52.5°C por 10 min).",
      icon: Thermometer,
      color: "text-[#1E562F]",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Guia de Segurança Alimentar</h1>
        <p className="text-slate-500 text-lg">Protocolos científicos para a erradicação da Doença de Chagas.</p>
      </header>

      {/* O Perigo do Barbeiro */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-slate-200 p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-[#e41b13]">
            <Bug size={28} />
            <h3 className="text-2xl font-bold">O Perigo do Barbeiro</h3>
          </div>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              O <span className="text-slate-900 font-bold italic">Trypanosoma cruzi</span> chega ao suco de açaí quando o inseto "barbeiro" é processado acidentalmente junto com os frutos. Suas fezes contaminadas contêm o parasita que causa a Doença de Chagas.
            </p>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-4">
              <HeartPulse className="text-[#e41b13] shrink-0" size={24} />
              <div>
                <p className="text-sm font-bold text-[#e41b13] uppercase mb-1">Sintomas Agudos</p>
                <p className="text-xs text-slate-600">Febre prolongada, dor de cabeça, fraqueza intensa e inchaço no rosto ou pernas. A fase crônica pode levar a problemas cardíacos graves.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-[#1E562F]">
            <CheckCircle2 size={28} />
            <h3 className="text-2xl font-bold">Boas Práticas</h3>
          </div>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className={`${step.bg} ${step.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                  <step.icon size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold">{step.title}</h4>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Riscos e Consequências */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600">
          <ShieldAlert size={24} />
          <h3 className="text-xl font-bold uppercase tracking-wider">Análise de Riscos e Consequências</h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-900 font-bold">Fator de Risco</TableHead>
                <TableHead className="text-slate-900 font-bold">Consequência Biológica</TableHead>
                <TableHead className="text-slate-900 font-bold text-right">Nível de Alerta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-slate-200">
                <TableCell className="text-slate-900 font-medium">Processo abaixo de 52.5°C</TableCell>
                <TableCell className="text-slate-600">Sobrevivência do <span className="italic">T. cruzi</span> e risco de surto epidemiológico.</TableCell>
                <TableCell className="text-right"><Badge className="bg-red-50 text-[#e41b13] border-red-100">Crítico</Badge></TableCell>
              </TableRow>
              <TableRow className="border-slate-200">
                <TableCell className="text-slate-900 font-medium">Recipientes sem higienização</TableCell>
                <TableCell className="text-slate-600">Contaminação cruzada por bactérias coliformes e fungos.</TableCell>
                <TableCell className="text-right"><Badge className="bg-amber-50 text-amber-600 border-amber-100">Alto</Badge></TableCell>
              </TableRow>
              <TableRow className="border-slate-200">
                <TableCell className="text-slate-900 font-medium">Ausência de catação manual</TableCell>
                <TableCell className="text-slate-600">Presença de fragmentos de insetos e sujidades físicas no produto.</TableCell>
                <TableCell className="text-right"><Badge className="bg-blue-50 text-blue-600 border-blue-100">Moderado</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default FoodSafetyGuide;