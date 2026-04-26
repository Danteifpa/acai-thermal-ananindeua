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
    { 
      id: 'home' as ViewType, 
      icon: Home, 
      label: 'Início',
      iconClass: (active: boolean) => active ? "animate-pulse-soft" : ""
    },
    { 
      id: 'lab' as ViewType, 
      icon: FlaskConical, 
      label: 'Laboratório Virtual',
      iconClass: () => "animate-bobbing-hover"
    },
    { 
      id: 'field' as ViewType, 
      icon: FolderOpen, 
      label: 'Gestão de Campo',
      iconClass: () => "animate-bounce-hover"
    },
    { 
      id: 'protocols' as ViewType, 
      icon: ShieldAlert, 
      label: 'Protocolos de Segurança',
      iconClass: () => "" 
    },
    { 
      id: 'academy' as ViewType, 
      icon: GraduationCap, 
      label: 'Academia de Treinamento',
      iconClass: () => "animate-rotate-hover"
    },
  ];

  return (
    <div className="w-64 bg-[#1E562F] flex flex-col h-screen sticky top-0 shadow-2xl z-50">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <Thermometer className="text-[#1E562F]" size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">AçaíThermal</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm group",
                isActive 
                  ? "bg-white text-[#1E562F] shadow-xl" 
                  : "text-white/90 hover:bg-white/10 hover:text-white hover:scale-[1.03]"
              )}
            >
              <item.icon 
                size={18} 
                className={cn("transition-transform duration-300", item.iconClass(isActive))} 
              />
              <span className="transition-transform duration-200">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/10 text-center">
        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">BCT / IFPA 2026</p>
      </div>
    </div>
  );
};

export default Sidebar;