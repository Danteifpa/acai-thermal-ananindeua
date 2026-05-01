"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle,
  Activity,
  BookOpen,
  Zap,
  Timer
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
  const [blanchingTimer, setBlanchingTimer] = useState(0);
  const [isBlanching, setIsBlanching] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNomeBatedouro(initialData.nome || '');
      setVolume(initialData.volume_padrao || 20);
      setMaterial(initialData.material_padrao || 'Plástico');
    }
  }, [initialData]);

  // Lógica do Cronômetro de Segurança (Embrapa 80°C/10s)
  useEffect(() => {
    let interval: any;
    if (isBlanching && blanchingTimer < 10) {
      interval = setInterval(() => {
        setBlanchingTimer(prev => prev + 1);
      }, 1000);
    } else if (blanchingTimer >= 10) {
      setIsValidated(true);
      setIsBlanching(false);
      showSuccess("Protocolo Embrapa 80°C/10s concluído com sucesso!");
    }
    return () => clearInterval(interval);
  }, [isBlanching, blanchingTimer]);

  const physics = useMemo(() => {
    // Proporção Embrapa: 1L Polpa para 2L Água (Total = volume * 3)
    const totalVolume = volume * 3; 
    const cp = material === 'Metal' ? 0.45 : 2.10;
    const baseK = material === 'Metal' ? 0.008 : 0.002;
    
    // k ajustado pela massa térmica total (água + polpa)
    const k = baseK / (cp * Math.pow(totalVolume, 0.25));
    
    const finalTemp = 25 + (80 - 25) * Math.exp(-k * 600);
    const particleSpeed = isValidated ? 0 : 0.5 + (((finalTemp - 25) / 55) * 4);
    const q = totalVolume * 1000 * cp * (80 - finalTemp);
    
    return { k, finalTemp, isSafe: finalTemp >= 52.5 && isValidated, q, particleSpeed };
  }, [volume, material, isValidated]);

  const startValidation = () => {
    if (!nomeBatedouro.trim()) { showError("Identificação da amostra é obrigatória."); return; }
    setBlanchingTimer(0);
    setIsValidated(false);
    setIsBlanching(true);
  };

  const handleSave = async () => {
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
      
      <div className="space-y-6">
        <div className="clinical-card p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Activity className="text-[#1E562F]" size={20} />
            <h2 className="ifpa-title text-sm">Configuração Experimental</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Identificação</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 focus:border-[#1E562F] outline-none transition-all text-sm rounded-xl"
                placeholder="Lote / Batedouro"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume de Polpa (L)</Label>
                <span className="text-slate-800 font-black text-3xl lcd-display">{volume}.0</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => { setVolume(val[0]); setIsValidated(false); setBlanchingTimer(0); }} max={50} min={1} step={1} />
              <p className="text-[9px] text-slate-400 italic">Simulando proporção 1:2 (Água: {volume * 2}L)</p>
            </div>

            <div className="space-y-4">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Material do Recipiente</Label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => { setMaterial('Metal'); setIsValidated(false); }}
                  className={cn(
                    "flex flex-col p-4 border transition-all rounded-xl text-left",
                    material === 'Metal' ? "bg-[#1E562F]/5 border-[#1E562F] text-[#1E562F]" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="uppercase text-[10px] font-black">Aço Inoxidável (Inox)</span>
                    {material === 'Metal' && <Zap size={16} className="animate-pulse" />}
                  </div>
                  <span className="text-[8px] mt-1 opacity-70">Recomendado Embrapa: Fácil higienização e prevenção de focos.</span>
                </button>
                <button 
                  onClick={() => { setMaterial('Plástico'); setIsValidated(false); }}
                  className={cn(
                    "flex flex-col p-4 border transition-all rounded-xl text-left",
                    material === 'Plástico' ? "bg-[#1E562F]/5 border-[#1E562F] text-[#1E562F]" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="uppercase text-[10px] font-black">Polímero (Isolante)</span>
                    {material === 'Plástico' && <ShieldCheck size={16} />}
                  </div>
                  <span className="text-[8px] mt-1 opacity-70">Uso comum, porém com maior risco de biofilmes.</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={startValidation} 
              disabled={isBlanching || isSaving} 
              className="flex-1 bg-[#1E562F] hover:bg-[#164023] text-white h-16 font-black uppercase tracking-widest transition-all rounded-xl shadow-lg"
            >
              {isBlanching ? <Loader2 className="animate-spin" /> : "Iniciar Branqueamento"}
            </Button>
            {isValidated && (
              <Button 
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-16 px-6 rounded-xl shadow-lg"
              >
                <ShieldCheck size={24} />
              </Button>
            )}
          </div>
        </div>

        <div className="clinical-card p-6 space-y-4 bg-slate-50/50">
          <div className="flex items-center gap-2 text-[#1E562F]">
            <BookOpen size={18} />
            <h3 className="font-black uppercase tracking-widest text-[10px]">Base Teórica</h3>
          </div>
          <div className="space-y-4 font-serif italic text-slate-600 text-xs leading-relaxed">
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-inner">
              <p className="text-sm font-mono not-italic font-bold text-slate-800">Q = m · c · ΔT</p>
              <p className="text-[8px] uppercase mt-1 text-slate-400">Equação Fundamental da Calorimetria</p>
            </div>
            <p className="text-[9px] text-center">
              A constante <span className="font-bold">k = {physics.k.toFixed(5)}</span> reflete a taxa de transferência de calor considerando a massa térmica da água de branqueamento.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="clinical-card p-8 space-y-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="text-[#1E562F]" size={20} />
              <h3 className="ifpa-title text-sm">Simulação de Laboratório</h3>
            </div>
            <div className="flex items-center gap-4">
              {isBlanching && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
                  <Timer size={14} />
                  <span className="text-xs font-black font-mono">{blanchingTimer}s / 10s</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                <span className="text-[8px] font-black text-slate-500 uppercase">k-Factor:</span>
                <span className="text-[10px] font-mono font-bold text-[#1E562F]">{physics.k.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <ThermalLab 
            volume={volume} material={material} 
            temp={isBlanching ? 80 : physics.finalTemp} 
            isSafe={physics.isSafe} 
            particleSpeed={physics.particleSpeed} 
            isBlanching={isBlanching}
            blanchingTimer={blanchingTimer}
          />

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Temp. Final</p>
              <p className="text-3xl font-black text-slate-800 lcd-display">{physics.finalTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Energia (kJ)</p>
              <p className="text-3xl font-black text-slate-800 lcd-display">{(physics.q / 1000).toFixed(1)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
              <p className={cn(
                "text-xs font-black uppercase tracking-tighter mt-2",
                physics.isSafe ? "text-[#1E562F]" : "text-[#e41b13]"
              )}>
                {physics.isSafe ? "Seguro" : "Risco"}
              </p>
            </div>
          </div>
        </div>
      </div>

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
                Resultado Biológico
              </h4>
              <p className="text-sm font-black text-slate-900">
                {physics.isSafe ? "INATIVAÇÃO COMPLETA" : "PATÓGENOS ATIVOS"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalValidation;