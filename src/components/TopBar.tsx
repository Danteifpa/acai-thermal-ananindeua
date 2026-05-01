"use client";

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Clock } from 'lucide-react';

const TopBar = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-[#39FF14]/30 bg-black flex items-center justify-between px-8 sticky top-0 z-50 font-mono overflow-hidden scanline-effect">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#39FF14]/50 font-bold uppercase tracking-widest">Status do Reator</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#39FF14] animate-pulse shadow-[0_0_8px_#39FF14]" />
            <span className="text-xs font-black text-[#39FF14] neon-text-glow">SISTEMA ATIVO</span>
          </div>
        </div>
        
        <div className="h-8 w-[1px] bg-[#39FF14]/20" />

        <div className="flex flex-col">
          <span className="text-[10px] text-[#00FFFF]/50 font-bold uppercase tracking-widest">Protocolo de Segurança</span>
          <span className="text-xs font-black text-[#00FFFF] cyan-text-glow">GERSON_MOUTINHO_V10</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#39FF14]/50 font-bold uppercase tracking-widest">Tempo de Missão (UTC)</span>
          <div className="flex items-center gap-2 text-[#39FF14]">
            <Clock size={14} />
            <span className="text-sm font-black">{time}</span>
          </div>
        </div>
        
        <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 px-4 py-1">
          <span className="text-[10px] font-black text-[#39FF14]">NASA_IFPA_STATION</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;