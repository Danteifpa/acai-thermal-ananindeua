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
    { id: 'home' as ViewType, icon: LayoutDashboard, label: 'Início' },
    { id: 'lab' as ViewType, icon: Thermometer, label: 'Laboratório' },
    { id: 'field' as ViewType, icon: Database, label: 'Gestão' },
    { id: 'protocols' as ViewType, icon: ShieldAlert, label: 'Segurança' },
    { id: 'academy' as ViewType, icon: GraduationCap, label: 'Academia' },
  ];

  return (
    <div className="w-64 bg-white flex flex-col h-screen sticky top-0 z-50 border-r border-slate-200">
      <div className="p-8 flex flex-col gap-1">
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">AÇAÍTHERMAL</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFPA 10 ANOS</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-8 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#55FF00] rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-900">Sistema Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;