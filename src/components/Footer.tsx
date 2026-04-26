"use client";

import React from 'react';
import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  return (
    <footer className="pt-10 border-t border-slate-900 flex flex-col items-center gap-4 pb-8 mt-10">
      <div className="text-center space-y-2">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Bacharelado em Ciência e Tecnologia - IFPA
        </p>
        <p className="text-sm text-slate-300 font-medium">
          Dante Monteiro • Thais Chagas • Edenilson do Carmo
        </p>
        <p className="text-[10px] text-slate-600 opacity-60">
          © 2026 AçaíThermal - Campus Ananindeua
        </p>
      </div>
      <MadeWithDyad />
    </footer>
  );
};

export default Footer;