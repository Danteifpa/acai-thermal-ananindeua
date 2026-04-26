"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Thermometer, 
  ShieldCheck, 
  BookOpen, 
  Database, 
  Info,
  GraduationCap
} from 'lucide-react';
import { cn } from "@/lib/utils";
import ChallengeMode from './ChallengeMode';

export type ViewType = 'dashboard' | 'validations' | 'history' | 'security' | 'settings' | 'memorial' | 'database' | 'about' | 'safety_guide';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'database' as ViewType, icon: Database, label: 'Batedores' },
    { id: 'safety_guide' as ViewType, icon: GraduationCap, label: 'Segurança' },
    { id: 'security' as ViewType, icon: ShieldCheck, label: 'Padrões' },
    { id: 'history' as ViewType, icon: History, label: 'Histórico' },
    { id: 'memorial' as ViewType, icon: BookOpen, label: 'Memorial' },
    { id: 'about' as ViewType, icon: Info, label: 'Sobre' },
    { id: 'settings' as ViewType, icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-6 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg shrink-0">
            <Thermometer className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight hidden lg:block">AçaíThermal</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              currentView === item.id 
                ? "bg-purple-600/10 text-purple-400 border border-purple-600/20" 
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
            title={item.label}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4 border-t border-slate-800 hidden lg:block">
        <ChallengeMode />
        <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-800/50">
          <p className="text-[8px] text-slate-500 uppercase font-bold mb-2 text-center tracking-widest">BCT / IFPA 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;