"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Thermometer, 
  Database, 
  ShieldAlert, 
  GraduationCap
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
      icon: LayoutDashboard, 
      label: 'Início'
    },
    { 
      id: 'lab' as ViewType, 
      icon: Thermometer, 
      label: 'Laboratório'
    },
    { 
      id: 'field' as ViewType, 
      icon: Database, 
      label: 'Gestão'
    },
    { 
      id: 'protocols' as ViewType, 
      icon: ShieldAlert, 
      label: 'Segurança'
    },
    { 
      id: 'academy' as ViewType, 
      icon: GraduationCap, 
      label: 'Academia'
    },
  ];

  return (
    <div className="w-32 bg-slate-50 flex flex-col h-screen sticky top-0 shadow-sm z-50 border-r border-slate-200">
      <div className="py-8 flex flex-col items-center gap-2">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <Thermometer className="text-[#1E562F]" size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center px-2">AçaíThermal</h1>
      </div>
      
      <nav className="flex-1 px-2 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex flex-col items-center gap-2 py-6 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-white text-[#1E562F] shadow-md border border-slate-100" 
                  : "text-slate-400 hover:text-[#1E562F] hover:bg-white/50"
              )}
            >
              <div className={cn(
                "transition-all duration-300 group-hover:-translate-y-[3px] group-hover:drop-shadow-[0_0_8px_rgba(30,86,47,0.2)]",
                isActive ? "text-[#1E562F]" : "text-slate-400 group-hover:text-[#1E562F]"
              )}>
                <item.icon 
                  size={40} 
                  strokeWidth={1.5}
                />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest text-center leading-tight transition-colors",
                isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1E562F] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          BCT<br/>IFPA 2026
        </p>
      </div>
    </div>
  );
};

export default Sidebar;