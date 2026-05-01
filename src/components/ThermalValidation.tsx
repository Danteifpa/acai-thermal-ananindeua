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
    if (!nomeBatedouro.trim()) { showError("ERRO: IDENTIFICAÇÃO_AUSENTE"); return; }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('amostras_termicas').insert([{ 
        nome_batedouro: nomeBatedouro, material, volume, 
        temp_final: parseFloat(physics.finalTemp.toFixed(1)), 
        status_sanitario: physics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
      }]);
      if (error) throw error;
      showSuccess("DADOS_SINCRONIZADOS");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-6 max-w-[1600px] mx-auto items-start font-mono">
      
      {/* Column 1: Controls */}
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Terminal className="text-[#39FF14]" size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest neon-text">Configuração</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Unidade de Campo</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                className="w-full bg-black/50 border border-white/10 text-[#39FF14] p-3 focus:border-[#39FF14]/50 outline-none transition-all text-xs rounded-[5px]"
                placeholder="> INPUT_ID..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume (L)</Label>
                <span className="text-[#39FF14] font-black text-xl">{volume}</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Material</Label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={cn(
                    "flex items-center justify-between p-3 border transition-all uppercase text-[10px] font-black rounded-[5px]",
                    material === 'Metal' ? "bg-[#39FF14]/10 border-[#39FF14]/50 text-[#39FF14]" : "bg-transparent border-white/10 text-slate-500 hover:border-white/20"
                  )}
                >
                  <span>Aço Inoxidável</span>
                  {material === 'Metal' && <div className="w-1.5 h-1.5 bg-[#39FF14] shadow-[0_0_5px_#39FF14]" />}
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={cn(
                    "flex items-center justify-between p-3 border transition-all uppercase text-[10px] font-black rounded-[5px]",
                    material === 'Plástico' ? "bg-[#39FF14]/10 border-[#39FF14]/50 text-[#39FF14]" : "bg-transparent border-white/10 text-slate-500 hover:border-white/20"
                  )}
                >
                  <span>Polímero Técnico</span>
                  {material === 'Plástico' && <div className="w-1.5 h-1.5 bg-[#39FF14] shadow-[0_0_5px_#39FF14]" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black h-12 font-black uppercase tracking-widest transition-all rounded-[5px]"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Validar Processo"}
          </Button>
        </div>
      </div>

      {/* Column 2: Simulation */}
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Cpu className="text-[#39FF14]" size={18} />
              <h3 className="font-black text-[#39FF14] uppercase tracking-widest text-xs">Telemetria Visual</h3>
            </div>
          </div>

          <ThermalLab 
            volume={volume} material={material} 
            temp={physics.finalTemp} isSafe={physics.isSafe} 
            particleSpeed={physics.particleSpeed} 
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/40 border border-white/10 p-4 rounded-[5px] space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase">Temp_Final</p>
              <p className="text-xl font-black text-[#39FF14]">{physics.finalTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-4 rounded-[5px] space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase">Energia_Q</p>
              <p className="text-xl font-black text-[#39FF14]">{(physics.q / 1000).toFixed(0)}kJ</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-4 rounded-[5px] space-y-1">
              <p className="text-[8px] font-bold text-slate-500 uppercase">Const_K</p>
              <p className="text-xl font-black text-[#39FF14]">{physics.k.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Analysis */}
      <div className="space-y-6">
        <ThermalChart k={physics.k} isSafe={physics.isSafe} />

        <div className={cn(
          "p-5 border transition-all duration-500 rounded-[5px]",
          physics.isSafe ? "bg-[#39FF14]/5 border-[#39FF14]/30" : "bg-red-500/5 border-red-500/30"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-2 rounded-[5px]",
              physics.isSafe ? "bg-[#39FF14] text-black" : "bg-red-500 text-white"
            )}>
              {physics.isSafe ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="space-y-0.5">
              <h4 className={cn(
                "font-black uppercase tracking-widest text-[9px]",
                physics.isSafe ? "text-[#39FF14]" : "text-red-500"
              )}>
                Status Sanitário
              </h4>
              <p className="text-xs font-black">
                {physics.isSafe ? "PROCESSO SEGURO" : "RISCO BIOLÓGICO"}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Terminal size={14} />
            <h4 className="text-[9px] font-black uppercase tracking-widest">Log de Sistema</h4>
          </div>
          <p className="text-[9px] text-slate-600 leading-relaxed">
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