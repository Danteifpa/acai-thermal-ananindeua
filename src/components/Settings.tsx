"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save, RefreshCcw } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface SettingsProps {
  constants: { metal: number; plastic: number };
  onUpdate: (newConstants: { metal: number; plastic: number }) => void;
}

const Settings = ({ constants, onUpdate }: SettingsProps) => {
  const [localConstants, setLocalConstants] = React.useState(constants);

  const handleSave = () => {
    onUpdate(localConstants);
    showSuccess("Constantes térmicas atualizadas!");
  };

  const handleReset = () => {
    const defaults = { metal: 0.004, plastic: 0.0015 };
    setLocalConstants(defaults);
    onUpdate(defaults);
    showSuccess("Valores restaurados para o padrão.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Configurações</h1>
        <p className="text-slate-400 text-lg">Ajuste fino dos parâmetros físicos do modelo de simulação.</p>
      </header>

      <Card className="bg-slate-900 border-slate-800 p-8 max-w-2xl space-y-8">
        <div className="flex items-center gap-3 text-purple-400">
          <SettingsIcon size={24} />
          <h3 className="text-xl font-bold">Constantes de Condutividade (k)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-slate-400">Metal (Alta Condutividade)</Label>
            <Input 
              type="number" 
              step="0.0001"
              value={localConstants.metal}
              onChange={(e) => setLocalConstants({ ...localConstants, metal: parseFloat(e.target.value) })}
              className="bg-slate-950 border-slate-800 text-white h-12"
            />
            <p className="text-xs text-slate-500">Padrão: 0.004. Valores maiores aceleram o resfriamento.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-400">Plástico (Isolante)</Label>
            <Input 
              type="number" 
              step="0.0001"
              value={localConstants.plastic}
              onChange={(e) => setLocalConstants({ ...localConstants, plastic: parseFloat(e.target.value) })}
              className="bg-slate-950 border-slate-800 text-white h-12"
            />
            <p className="text-xs text-slate-500">Padrão: 0.0015. Valores menores retêm mais calor.</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2 h-12 rounded-xl font-bold"
          >
            <Save size={20} />
            Salvar Alterações
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 gap-2 h-12 rounded-xl font-bold"
          >
            <RefreshCcw size={20} />
            Resetar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;