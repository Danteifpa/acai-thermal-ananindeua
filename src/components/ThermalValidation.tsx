"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  Box, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle,
  Cpu,
  Terminal,
  Activity
} from 'lucide-react';
import ThermalLab from './ThermalLab';
import ThermalChart from './ThermalChart';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from "@/lib/utils";

const ThermalValidation = ({ onRecordSaved, constants, initialData }: any) => {
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

  const physics = useMemo(() => {
    const cp = material === 'Metal' ? 0.50 : 2.30;
    const baseK = material === 'Metal' ? constants.metal : constants.plastic;
    const k = baseK / (cp * Math.pow(volume || 1, 0.2));
    const finalTemp = 25 + (80 - 25) * Math.exp(-k * 600);
    const particleSpeed = 0.5 + (((finalTemp - 25) / 55) * 4);
    return { k, finalTemp, isSafe: finalTemp >= 52.5, q: volume * 4000 * (80 - finalTemp), particleSpeed };
  }, [volume, material, constants]);

  const handleSave = async () => {
    if (!nomeBatedouro.trim()) { showError("Identificação da amostra é obrigatória."); return; }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('amostras_termicas').insert([{ 
        nome_batedouro: nomeBatedouro, material, volume, 
        temp_final: parseFloat(physics.finalTemp.toFixed(1)), 
        status_sanitario: physics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
      }]);
      if (error) throw error;
      showSuccess("Validação registrada no banco de dados.");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-8 max-w-[1600px] mx-auto items-start">
      
      {/* Coluna 1: Parâmetros de Entrada */}
      <div className="space-y-6">
        <div className="clinical-card p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Activity className="text-[#1E562F]" size={20} />
            <h2 className="ifpa-title text-sm">Parâmetros de Entrada</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Identificação da Amostra</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 focus:border-[#1E562F] outline-none transition-all text-sm rounded-xl"
                placeholder="Ex: Lote 042 - Ananindeua"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume da Polpa (L)</Label>
                <span className="text-slate-800 font-black text-3xl lcd-display">{volume}.0</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} />
            </div>

            <div className="space-y-4">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Material do Recipiente</Label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={cn(
                    "flex items-center justify-between p-4 border transition-all uppercase text-[10px] font-black rounded-xl",
                    material === 'Metal' ? "bg-[#1E562F]/5 border-[#1E562F] text-[#1E562F]" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  )}
                >
                  <span>Aço Inoxidável (Metal)</span>
                  {material === 'Metal' && <ShieldCheck size={16} />}
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={cn(
                    "flex items-center justify-between p-4 border transition-all uppercase text-[10px] font-black rounded-xl",
                    material === 'Plástico' ? "bg-[#1E562F]/5 border-[#1E562F] text-[#1E562F]" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  )}
                >
                  <span>Polietileno (Plástico)</span>
                  {material === 'Plástico' && <ShieldCheck size={16} />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-[#1E562F] hover:bg-[#164023] text-white h-16 font-black uppercase tracking-widest transition-all rounded-xl shadow-lg shadow-[#1E562F]/10"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Validar Processo Térmico"}
          </Button>
        </div>
      </div>

      {/* Coluna 2: Simulação e Telemetria */}
      <div className="space-y-8">
        <div className="clinical-card p-8 space-y-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="text-[#1E562F]" size={20} />
              <h3 className="ifpa-title text-sm">Simulação de Laboratório</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ambiente Controlado</span>
          </div>

          <ThermalLab 
            volume={volume} material={material} 
            temp={physics.finalTemp} isSafe={physics.isSafe} 
            particleSpeed={physics.particleSpeed} 
          />

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Temperatura Final</p>
              <p className="text-3xl font-black text-slate-800 lcd-display">{physics.finalTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Energia Dissipada</p>
              <p className="text-3xl font-black text-slate-800 lcd-display">{(physics.q / 1000).toFixed(0)}kJ</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Constante K</p>
              <p className="text-3xl font-black text-slate-800 lcd-display">{physics.k.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna 3: Análise de Segurança */}
      <div className="space-y-8">
        <ThermalChart k={physics.k} isSafe={physics.isSafe} />

        <div className={cn(
          "p-6 border-2 transition-all duration-500 rounded-2xl",
          physics.isSafe ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl",
              physics.isSafe ? "bg-[#1E562F] text-white" : "bg-[#e41b13] text-white"
            )}>
              {physics.isSafe ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="space-y-1">
              <h4 className={cn(
                "font-black uppercase tracking-widest text-[10px]",
                physics.isSafe ? "text-[#1E562F]" : "text-[#e41b13]"
              )}>
                Status Sanitário
              </h4>
              <p className="text-sm font-black text-slate-900">
                {physics.isSafe ? "PROCESSO SEGURO" : "RISCO BIOLÓGICO"}
              </p>
            </div>
          </div>
        </div>

        <div className="clinical-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Relatório Técnico</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
            > Analisando decaimento térmico...<br/>
            > Modelo: Lei de Resfriamento de Newton<br/>
            > Validação biológica concluída.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThermalValidation;