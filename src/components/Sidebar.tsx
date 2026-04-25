"use client";

import React from 'react';
import { LayoutDashboard, History, Settings, Thermometer, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Thermometer, label: 'Validações', active: false },
    { icon: History, label: 'Histórico', active: false },
    { icon: ShieldCheck, label: 'Segurança', active: false },
    { icon: Settings, label: 'Configurações', active: false },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-purple-600 p-2 rounded-lg">
          <Thermometer className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">AçaíThermal</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              item.active 
                ? "bg-purple-600/10 text-purple-400 border border-purple-600/20" 
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase font-bold mb-2">Status do Sistema</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-slate-300">Monitoramento Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;