"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FlaskConical, 
  Box, 
  ShieldCheck, 
  Loader2, 
  Info, 
  AlertTriangle,
  Activity,
  Zap
} from 'lucide-react';
import ThermalLab from './ThermalLab';
import ThermalChart from './ThermalChart';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from "@/lib/utils";

interface ThermalValidationProps {
  onRecordSaved: () => void;
  constants: { metal: number; plastic: number };
  initialData?: any;
}

const ThermalValidation = ({ onRecordSaved, constants, initialData }: ThermalValidationProps) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volume, setVolume] = useState(20);
  const [material, setMaterial] = useState('Plástico');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNomeBatedouro(initialData.nome || '');
      setVolume(initialData.volume_padrao || 20);
      setMaterial(initialData.material_padrao || 'Plástico');
    }
  }, [initialData]);

  const SPECIFIC_HEAT = { Metal: 0.50, Plástico: 2.30 };
  const C_ACAI = 4000;
  const T0 = 80;
  const TENV = 25;

  const calculatePhysics = (m: string, v: number) => {
    const cp = m === 'Metal' ? SPECIFIC_HEAT.Metal : SPECIFIC_HEAT.Plástico;
    const baseK = m === 'Metal' ? constants.metal : constants.plastic;
    const k = baseK / (cp * Math.pow(v || 1, 0.2));
    const finalTemp = TENV + (T0 - TENV) * Math.exp(-k * 600);
    const particleSpeed = 0.5 + (((finalTemp - 25) / 55) * 4);
    return { k, finalTemp, isSafe: finalTemp >= 52.5, q: v * C_ACAI * (T0 - finalTemp), particleSpeed };
  };

  const currentPhysics = useMemo(() => calculatePhysics(material, volume), [volume, material, constants]);

  const handleSave = async () => {
    if (!nomeBatedouro.trim()) {
      showError("Identificação do batedouro necessária.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('amostras_termicas')
        .insert([{ 
          nome_batedouro: nomeBatedouro, 
          material, 
          volume, 
          temp_final: parseFloat(currentPhysics.finalTemp.toFixed(1)), 
          status_sanitario: currentPhysics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
        }]);
      if (error) throw error;
      showSuccess("Dados científicos persistidos.");
      onRecordSaved();
      setNomeBatedouro('');
    } catch (err: any) {
      showError("Falha na persistência: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-8 max-w-[1600px] mx-auto items-start">
      
      {/* Column 1: Control Panel (Left - 25%) */}
      <div className="space-y-6 h-full">
        <Card className="bg-white border-slate-200 p-6 space-y-8 shadow-sm h-full flex flex-col">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Painel de Controle</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Configuração da Amostra</p>
          </div>
          
          <div className="space-y-6 flex-1">
            {/* ID Input */}
            <div className="space-y-2">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ID do Batedouro</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                placeholder="Identificação da Unidade"
                className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl p-4 focus:ring-2 focus:ring-[#1E562F] outline-none transition-all font-mono text-sm"
              />
            </div>

            {/* Volume Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume (L)</Label>
                <span className="text-[#1E562F] font-black text-2xl font-mono">{volume}</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} className="py-2" />
            </div>

            {/* Material Bench Controls */}
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Controles de Bancada</Label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border text-xs font-bold uppercase transition-all active:scale-95",
                    material === 'Metal' 
                      ? "bg-gradient-to-br from-slate-200 to-slate-300 border-slate-300 text-slate-800 shadow-md" 
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <FlaskConical size={18} />
                  <span>Aço Inoxidável</span>
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border text-xs font-bold uppercase transition-all active:scale-95",
                    material === 'Plástico' 
                      ? "bg-[#1E562F] border-[#1E562F] text-white shadow-md" 
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <Box size={18} />
                  <span>Polímero (Isolante)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Validation Trigger */}
          <div className="pt-6 border-t border-slate-100">
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="w-full bg-[#1E562F] hover:bg-[#164023] text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-[#1E562F]/20 transition-all active:scale-95"
            >
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : (
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} />
                  <span>Validar e Registrar</span>
                </div>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Column 2: Real-Time Simulation (Center - 45%) */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <Activity className="text-[#1E562F]" size={20} />
              </div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Simulação em Tempo Real</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motor Ativo</span>
            </div>
          </div>

          <ThermalLab 
            volume={volume}
            material={material}
            temp={currentPhysics.finalTemp}
            isSafe={currentPhysics.isSafe}
            particleSpeed={currentPhysics.particleSpeed}
          />

          {/* Digital Displays Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Temperatura Final</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">{currentPhysics.finalTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Energia Térmica (Q)</p>
              <p className="text-2xl font-black text-orange-500 font-mono">{Math.floor(currentPhysics.q / 1000)} <span className="text-xs">kJ</span></p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Constante (k)</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{currentPhysics.k.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Analysis & Safety (Right - 30%) */}
      <div className="space-y-6">
        <ThermalChart k={currentPhysics.k} isSafe={currentPhysics.isSafe} />

        <Card className={cn(
          "p-6 border-2 transition-all duration-500 rounded-3xl shadow-sm",
          currentPhysics.isSafe 
            ? "bg-emerald-50 border-emerald-200" 
            : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl",
              currentPhysics.isSafe ? "bg-[#1E562F] text-white" : "bg-[#e41b13] text-white"
            )}>
              {currentPhysics.isSafe ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="space-y-1">
              <h4 className={cn(
                "font-black uppercase tracking-widest text-sm",
                currentPhysics.isSafe ? "text-[#1E562F]" : "text-[#e41b13]"
              )}>
                Status Sanitário
              </h4>
              <p className="text-xs font-bold text-slate-600">
                {currentPhysics.isSafe 
                  ? "PROCESSO VALIDADO: SEGURO" 
                  : "ALERTA: RISCO BIOLÓGICO"
                }
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              {currentPhysics.isSafe 
                ? "A temperatura final de 52.5°C foi atingida, garantindo a inativação do T. cruzi conforme protocolos da Academia."
                : "Atenção: A temperatura final está abaixo do limite crítico. Recomenda-se reduzir o volume ou utilizar recipientes metálicos."
              }
            </p>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Zap size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Dica de Otimização</h4>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
            Recipientes de <span className="font-bold text-slate-900">Aço Inox</span> possuem condutividade térmica superior, acelerando o resfriamento em até 60% comparado ao polímero.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ThermalValidation;