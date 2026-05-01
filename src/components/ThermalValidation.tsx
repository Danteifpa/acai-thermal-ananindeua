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
  AlertTriangle,
  Activity,
  Zap,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    if (!nomeBatedouro.trim()) { showError("Identificação necessária."); return; }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('amostras_termicas').insert([{ 
        nome_batedouro: nomeBatedouro, material, volume, 
        temp_final: parseFloat(physics.finalTemp.toFixed(1)), 
        status_sanitario: physics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
      }]);
      if (error) throw error;
      showSuccess("Dados científicos persistidos.");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-8 max-w-[1600px] mx-auto items-start">
      
      {/* Coluna 1: Painel de Controle Neon */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
        className="space-y-6"
      >
        <Card className="bg-white border-slate-200 p-8 space-y-8 shadow-sm rounded-[2.5rem] relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#1E562F]">
              <Cpu size={18} className="animate-pulse" />
              <h2 className="text-xl font-black tracking-tighter uppercase">Workbench v2.0</h2>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Configuração de Hardware</p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Identificação da Unidade</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-2xl p-5 focus:ring-4 focus:ring-[#1E562F]/10 outline-none transition-all font-mono text-sm shadow-inner"
                placeholder="BATEDOURO_ID_001"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Volume de Amostra (L)</Label>
                <span className="text-[#1E562F] font-black text-3xl font-mono tracking-tighter">{volume}</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} className="py-2" />
            </div>

            <div className="space-y-4">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Material do Recipiente</Label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 transition-all cubic-bezier-timing active:scale-95",
                    material === 'Metal' ? "bg-slate-900 border-slate-900 text-white neon-glow-purple" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FlaskConical size={20} />
                    <span className="text-xs font-black uppercase">Aço Inoxidável</span>
                  </div>
                  {material === 'Metal' && <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />}
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 transition-all cubic-bezier-timing active:scale-95",
                    material === 'Plástico' ? "bg-[#1E562F] border-[#1E562F] text-white neon-glow-green" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Box size={20} />
                    <span className="text-xs font-black uppercase">Polímero Técnico</span>
                  </div>
                  {material === 'Plástico' && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-slate-900 hover:bg-black text-white h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : (
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} className="group-hover:rotate-12 transition-transform" />
                <span>Executar Validação</span>
              </div>
            )}
          </Button>
        </Card>
      </motion.div>

      {/* Coluna 2: Simulação Central */}
      <div className="space-y-8">
        <motion.div 
          layout
          className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-10 relative overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <Activity className="text-[#1E562F]" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Live Simulation Engine</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Newtonian Cooling Model v4.2</p>
              </div>
            </div>
          </div>

          <ThermalLab 
            volume={volume} material={material} 
            temp={physics.finalTemp} isSafe={physics.isSafe} 
            particleSpeed={physics.particleSpeed} 
          />

          {/* Displays Digitais Estilo Laboratório */}
          <div className="grid grid-cols-3 gap-6">
            <div className="digital-display space-y-1">
              <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest">Final_Temp</p>
              <p className="text-3xl font-black">{physics.finalTemp.toFixed(2)}<span className="text-sm ml-1">°C</span></p>
            </div>
            <div className="digital-display space-y-1 border-orange-900/30">
              <p className="text-[8px] font-black text-orange-500/50 uppercase tracking-widest">Thermal_Energy</p>
              <p className="text-3xl font-black text-orange-400">{(physics.q / 1000).toFixed(1)}<span className="text-sm ml-1">kJ</span></p>
            </div>
            <div className="digital-display space-y-1 border-blue-900/30">
              <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest">Decay_Const</p>
              <p className="text-3xl font-black text-blue-400">{physics.k.toFixed(4)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Coluna 3: Análise e Segurança */}
      <div className="space-y-8">
        <ThermalChart k={physics.k} isSafe={physics.isSafe} currentTemp={physics.finalTemp} />

        <AnimatePresence mode="wait">
          <motion.div
            key={physics.isSafe ? 'safe' : 'danger'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <Card className={cn(
              "p-8 border-4 rounded-[2.5rem] shadow-2xl transition-all duration-700",
              physics.isSafe ? "bg-emerald-50 border-emerald-200 neon-glow-green" : "bg-red-50 border-red-200 neon-glow-red"
            )}>
              <div className="flex items-center gap-5">
                <div className={cn(
                  "p-4 rounded-2xl shadow-lg",
                  physics.isSafe ? "bg-[#1E562F] text-white" : "bg-[#e41b13] text-white"
                )}>
                  {physics.isSafe ? <ShieldCheck size={32} /> : <AlertTriangle size={32} />}
                </div>
                <div className="space-y-1">
                  <h4 className={cn(
                    "font-black uppercase tracking-[0.1em] text-sm",
                    physics.isSafe ? "text-[#1E562F]" : "text-[#e41b13]"
                  )}>
                    Status de Segurança
                  </h4>
                  <p className="text-lg font-black tracking-tighter text-slate-900">
                    {physics.isSafe ? "VALIDADO: SEGURO" : "ALERTA: CRÍTICO"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-4 group">
          <div className="flex items-center gap-3 text-purple-400">
            <Zap size={20} className="group-hover:scale-125 transition-transform" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Insight de Engenharia</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            A curva de resfriamento segue uma <span className="text-white font-bold">decadência exponencial</span>. Para otimizar a segurança, considere reduzir o volume ou aumentar a área de contato superficial.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ThermalValidation;