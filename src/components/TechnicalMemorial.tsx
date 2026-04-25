"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Database, Cpu, Sliders } from 'lucide-react';

const TechnicalMemorial = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-12 text-slate-900 font-serif animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12 bg-white p-16 shadow-xl border border-slate-200 rounded-sm">
        
        {/* Header */}
        <header className="text-center border-b-2 border-slate-900 pb-8">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Memorial Descritivo Técnico</h1>
          <h2 className="text-xl text-slate-600 italic">Sistema de Validação Térmica AçaíThermal</h2>
          <p className="mt-4 text-sm font-sans font-bold text-slate-500">DOCUMENTO ACADÊMICO - VERSÃO 1.0</p>
        </header>

        {/* 1. Mathematical Model */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4">1. Modelo Matemático</h3>
          <p className="leading-relaxed">
            O comportamento térmico da polpa de açaí durante o processo de resfriamento natural é modelado através da 
            <span className="font-bold"> Lei do Resfriamento de Newton</span>. Esta lei postula que a taxa de variação da temperatura de um corpo é proporcional à diferença entre a sua própria temperatura e a temperatura ambiente.
          </p>
          <div className="bg-slate-100 p-8 rounded-lg text-center my-6">
            <p className="text-2xl font-mono italic">T(t) = T<sub>env</sub> + (T<sub>0</sub> - T<sub>env</sub>)e<sup>-kt</sup></p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            <div className="space-y-1">
              <p><span className="font-bold">T(t):</span> Temperatura no instante t (°C)</p>
              <p><span className="font-bold">T<sub>env</sub>:</span> Temperatura ambiente (25°C)</p>
            </div>
            <div className="space-y-1">
              <p><span className="font-bold">T<sub>0</sub>:</span> Temperatura inicial (80°C)</p>
              <p><span className="font-bold">k:</span> Constante de resfriamento (s⁻¹)</p>
            </div>
          </div>
        </section>

        {/* 2. Material Constants */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4">2. Parâmetros de Condutividade</h3>
          <p className="leading-relaxed">
            A constante <span className="italic">k</span> é influenciada diretamente pelas propriedades físicas do recipiente e pelo volume da amostra. O sistema assume os seguintes valores de referência para a condutividade térmica:
          </p>
          <Table className="border border-slate-200">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-slate-900 font-bold">Material do Recipiente</TableHead>
                <TableHead className="text-slate-900 font-bold">Constante (k) Base</TableHead>
                <TableHead className="text-slate-900 font-bold">Propriedade Térmica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Aço Inoxidável / Metal</TableCell>
                <TableCell>0.0040</TableCell>
                <TableCell>Alta Dissipação</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Polietileno / Plástico</TableCell>
                <TableCell>0.0015</TableCell>
                <TableCell>Isolante Térmico</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        {/* 3. Biological Safety */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4">3. Fundamentação Biológica</h3>
          <p className="leading-relaxed">
            O processamento do açaí exige rigoroso controle térmico para a inativação do <span className="italic">Trypanosoma cruzi</span>. 
            De acordo com as normas sanitárias vigentes, o processo de branqueamento (choque térmico) deve garantir que a polpa atinja e mantenha uma temperatura crítica.
          </p>
          <p className="bg-slate-900 text-white p-6 rounded-sm italic leading-relaxed">
            "A manutenção da temperatura em 52.5°C por um período mínimo de 10 minutos (600 segundos) é o parâmetro técnico validado para a eliminação completa de patógenos sem comprometer as propriedades organolépticas do fruto."
          </p>
        </section>

        {/* 4. Software Architecture */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4">4. Arquitetura do Software</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
            <div className="flex flex-col items-center gap-2 text-center w-32">
              <div className="bg-slate-100 p-4 rounded-full border border-slate-300"><Sliders size={24} /></div>
              <span className="text-xs font-bold uppercase">Interface (Inputs)</span>
            </div>
            <ArrowRight className="hidden md:block text-slate-300" />
            <div className="flex flex-col items-center gap-2 text-center w-32">
              <div className="bg-slate-900 p-4 rounded-full text-white"><Cpu size={24} /></div>
              <span className="text-xs font-bold uppercase">Motor de Física</span>
            </div>
            <ArrowRight className="hidden md:block text-slate-300" />
            <div className="flex flex-col items-center gap-2 text-center w-32">
              <div className="bg-slate-100 p-4 rounded-full border border-slate-300"><Database size={24} /></div>
              <span className="text-xs font-bold uppercase">Supabase (Cloud)</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            O fluxo de dados inicia-se na captura de parâmetros via UI (React), processados em tempo real pelo motor de simulação que aplica a Lei de Newton, e finalmente persistidos em um banco de dados relacional via Supabase para auditoria e geração de relatórios.
          </p>
        </section>

        <footer className="pt-12 border-t border-slate-200 text-center text-xs text-slate-400 uppercase tracking-widest">
          © 2024 Projeto Acadêmico - Engenharia de Alimentos & Software
        </footer>
      </div>
    </div>
  );
};

export default TechnicalMemorial;