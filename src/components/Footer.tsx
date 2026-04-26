"use client";

import React from 'react';
import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  return (
    <footer className="pt-10 border-t border-slate-200 flex flex-col items-center gap-4 pb-8 mt-10">
      <div className="text-center space-y-2">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
          Bacharelado em Ciência e Tecnologia - IFPA Campus Ananindeua | 2026
        </p>
        <p className="text-sm text-slate-800 font-bold">
          Dante Monteiro • Thais Chagas • Edenilson do Carmo
        </p>
        <p className="text-[10px] text-slate-400 opacity-60">
          © 2026 AçaíThermal - Projeto Acadêmico
        </p>
      </div>
      <MadeWithDyad />
    </footer>
  );
};

export default Footer;