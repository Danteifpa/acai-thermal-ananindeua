import React from 'react';
import { Card } from "@/components/ui/card";
import { Users, GraduationCap, Info } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Sobre o AçaíThermal</h1>
        <p className="text-slate-400 text-lg">Tecnologia e Ciência para a Segurança Alimentar.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 text-purple-400">
            <Users size={24} />
            <h3 className="text-xl font-bold">Equipe de Desenvolvimento</h3>
          </div>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <span className="font-medium">Dante Monteiro</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <span className="font-medium">Thais Chagas</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <span className="font-medium">Edenilson do Carmo</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 text-blue-400">
            <GraduationCap size={24} />
            <h3 className="text-xl font-bold">Objetivo Acadêmico</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Projeto desenvolvido para a <span className="text-white font-semibold">Feira de Física do IFPA 2026</span>, 
            focado na validação térmica do processamento de açaí. O sistema utiliza modelos matemáticos para garantir a segurança biológica do produto final.
          </p>
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Info size={16} />
              <span>Versão 1.0 - 2026</span>
            </div>
          </div>
        </Card>
      </div>

      <footer className="pt-12 text-center">
        <p className="text-slate-500 text-sm font-medium">
          © 2026 - Desenvolvido no IFPA Campus Ananindeua
        </p>
      </footer>
    </div>
  );
};

export default About;