"use client";

import React from 'react';
import { 
  Trees, 
  Waves, 
  MapPin, 
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
      icon: Trees, 
      label: 'Início',
      iconClass: (active: boolean) => active ? "animate-pulse-soft" : ""
    },
    { 
      id: 'lab' as ViewType, 
      icon: Waves, 
      label: 'Laboratório',
      iconClass: () => "animate-bobbing-hover"
    },
    { 
      id: 'field' as ViewType, 
      icon: MapPin, 
      label: 'Gestão',
      iconClass: () => "animate-bounce-hover"
    },
    { 
      id: 'protocols' as ViewType, 
      icon: ShieldAlert, 
      label: 'Protocolos',
      iconClass: () => "" 
    },
    { 
      id: 'academy' as ViewType, 
      icon: GraduationCap, 
      label: 'Academia',
      iconClass: () => "animate-rotate-hover"
    },
  ];

  return (
    <div className="w-32 bg-[#1E562F] flex flex-col h-screen sticky top-0 shadow-2xl z-50 border-r border-white/5">
      <div className="py-8 flex flex-col items-center gap-2">
        <div className="bg-white p-3 rounded-2xl shadow-xl mb-2">
          <Thermometer className="text-[#1E562F]" size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-[10px] font-black text-white uppercase tracking-[0.2em] text-center px-2">AçaíThermal</h1>
      </div>
      
      <nav className="flex-1 px-2 space-y-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex flex-col items-center gap-2 py-4 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-white text-[#1E562F] shadow-2xl scale-105" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-transform duration-300",
                isActive ? "bg-emerald-50" : "bg-transparent",
                item.iconClass(isActive)
              )}>
                <item.icon 
                  size={32} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "drop-shadow-[0_0_8px_rgba(30,86,47,0.3)]" : ""
                  )}
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1E562F] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 text-center">
        <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
          BCT<br/>IFPA 2026
        </p>
      </div>
    </div>
  );
};

export default Sidebar;