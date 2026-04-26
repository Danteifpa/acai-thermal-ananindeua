"use client";

import React from 'react';
import { 
  Home, 
  FlaskConical, 
  FolderOpen, 
  ShieldAlert, 
  GraduationCap,
  Thermometer
} from 'lucide-react';
import { cn } from "@/lib/utils";

export type ViewType = 'home' | 'lab' | 'field' | 'protocols' | 'academy';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'home' as ViewType, icon: Home, label: 'Início' },
    { id: 'lab' as ViewType, icon: FlaskConical, label: 'Laboratório Virtual' },
    { id: 'field' as ViewType, icon: FolderOpen, label: 'Gestão de Campo' },
    { id: 'protocols' as ViewType, icon: ShieldAlert, label: 'Protocolos de Segurança' },
    { id: 'academy' as ViewType, icon: GraduationCap, label: 'Academia de Treinamento' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <Thermometer className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">AçaíThermal</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
              currentView === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">BCT / IFPA 2026</p>
      </div>
    </div>
  );
};

export default Sidebar;