"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FlaskConical, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle,
  Activity,
  ClipboardCheck,
  Zap,
  Timer,
  Target
} from 'lucide-react';
import ThermalLab from './ThermalLab';
import ThermalChart from './ThermalChart';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from "@/lib/utils";

const ThermalValidation = ({ onRecordSaved, initialData }: any) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volumeFruto, setVolumeFruto] = useState(14); // Massa m2 (kg)
  const [volumeAgua, setVolumeAgua] = useState(9);   // Massa m1 (kg/L)
  const [material, setMaterial] = useState('Metal');
  const [isSaving, setIsSaving] = useState(false);
  const [blanchingTimer, setBlanchingTimer] = useState(0);
  const [isBlanching, setIsBlanching] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  
  const [checklist, setChecklist] = useState({
    higienizacao: false,
    catacao: false,
    temperatura: false
  });

  useEffect(() => {
    if (initialData) {
      setNomeBatedouro(initialData.nome || '');
      setVolumeFruto(initialData.volume_padrao || 14);
    }
  }, [initialData]);

  useEffect(() => {
    let interval: any;
    if (isBlanching && blanchingTimer < 10) {
      interval = setInterval(() => {
        setBlanchingTimer(prev => prev + 1);
      }, 1000);
    } else if (blanchingTimer >= 10) {
      setIsValidated(true);
      setIsBlanching(false);
      if (physics.finalTemp >= 52.5) {
        showSuccess("Validated by Thermodynamic Modeling (52.5°C reached)");
      } else {
        showError(`AVISO: Temperatura de equilíbrio insuficiente (${physics.finalTemp.toFixed(1)}°C).`);
      }
    }
    return () => clearInterval(interval);
  }, [isBlanching, blanchingTimer]);

  const physics = useMemo(() => {
    // Constantes do Artigo
    const c_agua = 4.18; // kJ/kg·K
    const c_acai = 3.7;  // kJ/kg·K
    const T_agua = 80;   // °C
    const T_acai = 25;   // °C (Ambiente)

    // Equação de Equilíbrio: Tf = (m1*c1*T1 + m2*c2*T2) / (m1*c1 + m2*c2)
    const finalTemp = (volumeAgua * c_agua * T_agua + volumeFruto * c_acai * T_acai) / 
                      (volumeAgua * c_agua + volumeFruto * c_acai);
    
    // Coeficiente de perda térmica (h) - Artigo Fig. 3
    const h = material === 'Metal' ? 0.0005 : 0.0045; 
    
    const isSafe = finalTemp >= 52.5 && isValidated;
    
    let failureReason = "";
    if (finalTemp < 52.5) {
      failureReason = `AVISO: Temperatura de equilíbrio insuficiente (${finalTemp.toFixed(1)}°C). Alvo de 52,5°C do artigo não atingido, apesar da água estar a 80°C.`;
    }

    return { h, finalTemp, isSafe, failureReason };
  }, [volumeFruto, volumeAgua, material, isValidated]);

  const startValidation = () => {
    if (!nomeBatedouro.trim()) { showError("Identificação da amostra é obrigatória."); return; }
    if (!checklist.higienizacao || !checklist.catacao || !checklist.temperatura) {
      showError("Complete o checklist de BPF antes de iniciar.");
      return;
    }
    setBlanchingTimer(0);
    setIsValidated(false);
    setIsBlanching(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('amostras_termicas').insert([{ 
        nome_batedouro: nomeBatedouro, material, volume: volumeFruto, 
        temp_final: parseFloat(physics.finalTemp.toFixed(1)), 
        status_sanitario: physics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
      }]);
      if (error) throw error;
      showSuccess("Laudo termodinâmico registrado.");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr_1fr] gap-8 max-w-[1600px] mx-auto items-start">
      
      <div className="space-y-6">
        {/* Painel de Alvo Científico */}
        <div className="bg-[#1E562F] text-white p-6 rounded-[2rem] shadow-xl shadow-[#1E562F]/20 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Target size={20} className="text-emerald-400" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Referência Científica</h4>
          </div>
          <p className="text-xs font-medium opacity-80 mb-1">Temperatura de Equilíbrio (Alvo do Artigo):</p>
          <p className="text-4xl font-black tracking-tighter">52.5°C</p>
        </div>

        <div className="clinical-card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <ClipboardCheck className="text-[#1E562F]" size={20} />
            <h2 className="ifpa-title text-sm">Checklist de BPF</h2>
          </div>
          
          <div className="space-y-4">
            {['higienizacao', 'catacao', 'temperatura'].map((key) => (
              <div key={key} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Checkbox 
                  id={key} 
                  checked={(checklist as any)[key]} 
                  onCheckedChange={(val) => setChecklist({...checklist, [key]: !!val})}
                />
                <Label htmlFor={key} className="text-xs font-medium text-slate-700 cursor-pointer capitalize">
                  {key === 'higienizacao' ? 'Higienização do Batedor' : key === 'catacao' ? 'Catação e Lavagem' : 'Água a 80°C'}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="clinical-card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Activity className="text-[#1E562F]" size={20} />
            <h2 className="ifpa-title text-sm">Parâmetros de Massa</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Massa do Fruto (m2) - kg</Label>
              <div className="flex justify-between items-center">
                <Slider value={[volumeFruto]} onValueChange={(val) => setVolumeFruto(val[0])} max={30} min={5} step={1} className="flex-1 mr-4" />
                <span className="text-xl font-black lcd-display w-12 text-right">{volumeFruto}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Volume de Água (m1) - L</Label>
              <div className="flex justify-between items-center">
                <Slider value={[volumeAgua]} onValueChange={(val) => setVolumeAgua(val[0])} max={20} min={5} step={0.5} className="flex-1 mr-4" />
                <span className="text-xl font-black lcd-display w-12 text-right">{volumeAgua.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Material do Recipiente</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={material === 'Metal' ? 'default' : 'outline'}
                  onClick={() => setMaterial('Metal')}
                  className={cn("h-12 rounded-xl font-bold text-[10px]", material === 'Metal' ? "bg-[#1E562F]" : "border-slate-200")}
                >
                  AÇO INOX (Plateau)
                </Button>
                <Button 
                  variant={material === 'Plástico' ? 'default' : 'outline'}
                  onClick={() => setMaterial('Plástico')}
                  className={cn("h-12 rounded-xl font-bold text-[10px]", material === 'Plástico' ? "bg-[#1E562F]" : "border-slate-200")}
                >
                  POLÍMERO (Decaimento)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="clinical-card p-8 space-y-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="text-[#1E562F]" size={20} />
              <h3 className="ifpa-title text-sm">Simulador Termodinâmico</h3>
            </div>
            {isBlanching && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full border border-amber-100 animate-pulse">
                <Timer size={16} />
                <span className="text-sm font-black font-mono">{blanchingTimer}s / 10s</span>
              </div>
            )}
          </div>

          <ThermalLab 
            volume={volumeFruto} material={material} 
            temp={isBlanching ? 80 : physics.finalTemp} 
            isSafe={physics.isSafe} 
            particleSpeed={0.5} 
            isBlanching={isBlanching}
            blanchingTimer={blanchingTimer}
          />

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={startValidation} 
              disabled={isBlanching || isSaving} 
              className="h-16 bg-[#1E562F] hover:bg-[#164023] text-white font-black uppercase tracking-widest rounded-2xl shadow-lg"
            >
              {isBlanching ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
              Validar Processo
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isValidated || isSaving}
              className="h-16 bg-white border-2 border-[#1E562F] text-[#1E562F] hover:bg-slate-50 font-black uppercase tracking-widest rounded-2xl"
            >
              Registrar Laudo
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={cn(
          "p-8 border-2 transition-all duration-500 rounded-[2rem] shadow-sm",
          physics.isSafe ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
        )}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-2xl",
                physics.isSafe ? "bg-[#1E562F] text-white" : "bg-[#e41b13] text-white"
              )}>
                {physics.isSafe ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-[10px] opacity-60">Status Sanitário</h4>
                <p className="text-lg font-black leading-tight">
                  {physics.isSafe ? "PROCESSO VALIDADO" : "RISCO DETECTADO"}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-black/5 space-y-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase">Parecer Técnico:</p>
              <p className="text-xs leading-relaxed font-medium text-slate-800">
                {physics.isSafe 
                  ? "Validated by Thermodynamic Modeling (52.5°C reached)"
                  : physics.failureReason}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <div className="bg-white/50 p-4 rounded-xl border border-black/5">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Equilíbrio Calculado</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black lcd-display">{physics.finalTemp.toFixed(1)}°C</p>
                  <span className="text-[10px] font-bold text-slate-400">Alvo: 52.5°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ThermalChart k={physics.h} isSafe={physics.isSafe} />
      </div>
    </div>
  );
};

export default ThermalValidation;