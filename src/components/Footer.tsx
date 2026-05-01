"use client";

import React from 'react';
import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  return (
    <footer className="pt-16 border-t border-slate-800 flex flex-col items-center gap-6 pb-12 mt-16">
      <div className="text-center space-y-3">
        <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">
          BACHARELADO EM CIÊNCIA E TECNOLOGIA - IFPA CAMPUS ANANINDEUA | 2026
        </p>
        <p className="text-sm text-white font-bold tracking-tight">
          Dante Monteiro • Thais Chagas • Edenilson do Carmo
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="h-[1px] w-12 bg-slate-800" />
          <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
            Projeto Integrador de Física Térmica
          </p>
          <div className="h-[1px] w-12 bg-slate-800" />
        </div>
      </div>
      <MadeWithDyad />
    </footer>
  );
};

export default Footer;