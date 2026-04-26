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
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      title: "Passo 2: Lavagem",
      desc: "Imersão em água clorada para eliminação de microrganismos superficiais.",
      icon: Droplets,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10"
    },
    {
      title: "Passo 3: Branqueamento",
      desc: "Choque térmico validado por este App (52.5°C por 10 min).",
      icon: Thermometer,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Guia de Segurança Alimentar</h1>
        <p className="text-slate-400 text-lg">Protocolos científicos para a erradicação da Doença de Chagas.</p>
      </header>

      {/* O Perigo do Barbeiro */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 text-red-500">
            <Bug size={28} />
            <h3 className="text-2xl font-bold">O Perigo do Barbeiro</h3>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              O <span className="text-white font-bold italic">Trypanosoma cruzi</span> chega ao suco de açaí quando o inseto "barbeiro" é processado acidentalmente junto com os frutos. Suas fezes contaminadas contêm o parasita que causa a Doença de Chagas.
            </p>
            <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl flex gap-4">
              <HeartPulse className="text-red-500 shrink-0" size={24} />
              <div>
                <p className="text-sm font-bold text-red-400 uppercase mb-1">Sintomas Agudos</p>
                <p className="text-xs text-slate-400">Febre prolongada, dor de cabeça, fraqueza intensa e inchaço no rosto ou pernas. A fase crônica pode levar a problemas cardíacos graves.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 text-green-500">
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
                  <h4 className="text-white font-bold">{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Riscos e Consequências */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-500">
          <ShieldAlert size={24} />
          <h3 className="text-xl font-bold uppercase tracking-wider">Análise de Riscos e Consequências</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-950">
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400 font-bold">Fator de Risco</TableHead>
                <TableHead className="text-slate-400 font-bold">Consequência Biológica</TableHead>
                <TableHead className="text-slate-400 font-bold text-right">Nível de Alerta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-slate-800">
                <TableCell className="text-white font-medium">Processo abaixo de 52.5°C</TableCell>
                <TableCell className="text-slate-400">Sobrevivência do <span className="italic">T. cruzi</span> e risco de surto epidemiológico.</TableCell>
                <TableCell className="text-right"><Badge className="bg-red-500/10 text-red-500 border-red-500/20">Crítico</Badge></TableCell>
              </TableRow>
              <TableRow className="border-slate-800">
                <TableCell className="text-white font-medium">Recipientes sem higienização</TableCell>
                <TableCell className="text-slate-400">Contaminação cruzada por bactérias coliformes e fungos.</TableCell>
                <TableCell className="text-right"><Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Alto</Badge></TableCell>
              </TableRow>
              <TableRow className="border-slate-800">
                <TableCell className="text-white font-medium">Ausência de catação manual</TableCell>
                <TableCell className="text-slate-400">Presença de fragmentos de insetos e sujidades físicas no produto.</TableCell>
                <TableCell className="text-right"><Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Moderado</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <footer className="pt-12 border-t border-slate-900 text-center space-y-2">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Bacharelado em Ciência e Tecnologia - IFPA
        </p>
        <p className="text-sm text-slate-400 font-medium">
          Dante Monteiro • Thais Chagas • Edenilson do Carmo
        </p>
      </footer>
    </div>
  );
};

export default FoodSafetyGuide;