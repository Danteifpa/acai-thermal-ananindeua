"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Database, 
  ShieldCheck, 
  Settings,
  Thermometer
} from 'lucide-react';
import { cn } from "@/lib/utils";
import ChallengeMode from './ChallengeMode';

export type ViewType = 'dashboard' | 'lab' | 'database' | 'safety_guide' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'lab' as ViewType, icon: FlaskConical, label: 'Laboratório Virtual' },
    { id: 'database' as ViewType, icon: Database, label: 'Cadastro de Batedores' },
    { id: 'safety_guide' as ViewType, icon: ShieldCheck, label: 'Guia de Segurança' },
    { id: 'settings' as ViewType, icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-xl">
            <Thermometer className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">AçaíThermal</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
              currentView === item.id 
                ? "bg-purple-600/10 text-purple-400 border border-purple-600/20" 
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-900 space-y-6">
        <ChallengeMode />
        <div className="text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">BCT / IFPA 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;