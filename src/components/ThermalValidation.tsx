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
  Terminal
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
    if (!nomeBatedouro.trim()) { showError("Identificação obrigatória."); return; }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('amostras_termicas').insert([{ 
        nome_batedouro: nomeBatedouro, material, volume, 
        temp_final: parseFloat(physics.finalTemp.toFixed(1)), 
        status_sanitario: physics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
      }]);
      if (error) throw error;
      showSuccess("Validação registrada com sucesso.");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-8 max-w-[1600px] mx-auto items-start">
      
      {/* Coluna 1: Configuração */}
      <div className="space-y-6">
        <div className="lab-card p-8 space-y-8 rounded-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Terminal className="text-[#55FF00]" size={20} />
            <h2 className="lab-title text-sm">Configuração</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Unidade de Campo</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white p-4 focus:border-[#55FF00] outline-none transition-all text-sm rounded-xl"
                placeholder="Nome do Batedouro..."
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume (L)</Label>
                <span className="text-[#55FF00] font-black text-3xl font-mono">{volume}</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} />
            </div>

            <div className="space-y-4">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Material</Label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={cn(
                    "flex items-center justify-between p-4 border transition-all uppercase text-[10px] font-black rounded-xl",
                    material === 'Metal' ? "bg-[#55FF00]/10 border-[#55FF00] text-[#55FF00]" : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-700"
                  )}
                >
                  <span>Aço Inoxidável</span>
                  {material === 'Metal' && <div className="w-2 h-2 bg-[#55FF00] rounded-full shadow-[0_0_10px_#55FF00]" />}
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={cn(
                    "flex items-center justify-between p-4 border transition-all uppercase text-[10px] font-black rounded-xl",
                    material === 'Plástico' ? "bg-[#55FF00]/10 border-[#55FF00] text-[#55FF00]" : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-700"
                  )}
                >
                  <span>Polímero Técnico</span>
                  {material === 'Plástico' && <div className="w-2 h-2 bg-[#55FF00] rounded-full shadow-[0_0_10px_#55FF00]" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-[#55FF00] hover:bg-[#44cc00] text-black h-16 font-black uppercase tracking-widest transition-all rounded-xl shadow-lg shadow-[#55FF00]/10"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Validar Processo"}
          </Button>
        </div>
      </div>

      {/* Coluna 2: Telemetria Visual */}
      <div className="space-y-8">
        <div className="lab-card p-8 space-y-8 rounded-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Cpu className="text-[#55FF00]" size={20} />
              <h3 className="lab-title text-sm">Telemetria Visual</h3>
            </div>
          </div>

          <ThermalLab 
            volume={volume} material={material} 
            temp={physics.finalTemp} isSafe={physics.isSafe} 
            particleSpeed={physics.particleSpeed} 
          />

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Temp_Final</p>
              <p className="text-2xl font-black text-[#55FF00] font-mono">{physics.finalTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Energia_Q</p>
              <p className="text-2xl font-black text-[#55FF00] font-mono">{(physics.q / 1000).toFixed(0)}kJ</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Const_K</p>
              <p className="text-2xl font-black text-white font-mono">{physics.k.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna 3: Análise */}
      <div className="space-y-8">
        <ThermalChart k={physics.k} isSafe={physics.isSafe} />

        <div className={cn(
          "p-6 border-2 transition-all duration-500 rounded-2xl",
          physics.isSafe ? "bg-[#55FF00]/5 border-[#55FF00]/30" : "bg-red-500/5 border-red-500/30"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl",
              physics.isSafe ? "bg-[#55FF00] text-black" : "bg-red-500 text-white"
            )}>
              {physics.isSafe ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="space-y-1">
              <h4 className={cn(
                "font-black uppercase tracking-widest text-[10px]",
                physics.isSafe ? "text-[#55FF00]" : "text-red-500"
              )}>
                Status Sanitário
              </h4>
              <p className="text-sm font-black text-white">
                {physics.isSafe ? "PROCESSO SEGURO" : "RISCO BIOLÓGICO"}
              </p>
            </div>
          </div>
        </div>

        <div className="lab-card p-6 space-y-4 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-500">
            <Terminal size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Log de Sistema</h4>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed font-mono">
            > Monitorando decaimento térmico...<br/>
            > Parâmetros validados via Newton...<br/>
            > Estabilidade térmica confirmada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThermalValidation;