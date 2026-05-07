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
import { supabase } from '@/integrations/supabase/client';
import { cn } from "@/lib/utils";

const ThermalValidation = ({ onRecordSaved, initialData }: any) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volumeFruto, setVolumeFruto] = useState(14); 
  const [volumeAgua, setVolumeAgua] = useState(9);   
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
      setMaterial(initialData.material || 'Metal');
      setChecklist(prev => ({ ...prev, temperatura: true })); 
    }
  }, [initialData]);

  useEffect(() => {
    let interval: any;
    if (isBlanching && blanchingTimer < 60) {
      interval = setInterval(() => {
        setBlanchingTimer(prev => prev + 1);
      }, 100); // Simulação acelerada para 60s
    } else if (blanchingTimer >= 60) {
      setIsValidated(true);
      setIsBlanching(false);
      if (physics.finalTemp >= 52.5) {
        showSuccess("Validação Concluída: Alvo de 52.5°C atingido.");
      } else {
        showError(`Risco Térmico: Temperatura final de ${physics.finalTemp.toFixed(1)}°C.`);
      }
    }
    return () => clearInterval(interval);
  }, [isBlanching, blanchingTimer]);

  const physics = useMemo(() => {
    const c_agua = 4186; 
    const c_acai = 3800;  
    const T_agua = 80;   
    const T_acai = 25;   

    // Equilíbrio Térmico (Target)
    const finalTemp = (volumeAgua * c_agua * T_agua + volumeFruto * c_acai * T_acai) / 
                      (volumeAgua * c_agua + volumeFruto * c_acai);
    
    const isSafe = finalTemp >= 52.5 && isValidated;
    
    return { finalTemp, isSafe };
  }, [volumeFruto, volumeAgua, material, isValidated]);

  const startValidation = () => {
    if (!nomeBatedouro.trim()) { showError("Identificação obrigatória."); return; }
    if (!checklist.higienizacao || !checklist.catacao || !checklist.temperatura) {
      showError("Complete o checklist de BPF.");
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
      showSuccess("Laudo registrado no Supabase.");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-8 max-w-[1600px] mx-auto items-start">
      <div className="space-y-6">
        <div className="bg-[#1E562F] text-white p-8 rounded-3xl shadow-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Target size={20} className="text-emerald-400" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Alvo Científico</h4>
          </div>
          <p className="text-4xl font-black tracking-tighter">52.5°C</p>
          <p className="text-[10px] font-medium opacity-70 mt-2">Inativação do T. cruzi (Artigo 2024)</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <ClipboardCheck className="text-[#1E562F]" size={20} />
            <h2 className="text-sm font-black uppercase text-[#1E562F]">Checklist BPF</h2>
          </div>
          <div className="space-y-3">
            {['higienizacao', 'catacao', 'temperatura'].map((key) => (
              <div key={key} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Checkbox 
                  id={key} 
                  checked={(checklist as any)[key]} 
                  onCheckedChange={(val) => setChecklist({...checklist, [key]: !!val})}
                />
                <Label htmlFor={key} className="text-xs font-bold text-slate-700 cursor-pointer">
                  {key === 'higienizacao' ? 'Higienização' : key === 'catacao' ? 'Catação/Lavagem' : 'Água a 80°C'}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="text-[#1E562F]" size={20} />
              <h3 className="text-sm font-black uppercase text-[#1E562F]">Simulador de 2ª Ordem</h3>
            </div>
            {isBlanching && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full border border-amber-100">
                <Timer size={16} className="animate-spin" />
                <span className="text-sm font-black font-mono">{blanchingTimer}s</span>
              </div>
            )}
          </div>

          <ThermalLab 
            volume={volumeFruto} material={material} 
            temp={isBlanching ? 80 : physics.finalTemp} 
            isSafe={physics.isSafe} 
            particleSpeed={0.5} 
          />

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={startValidation} disabled={isBlanching} className="h-14 bg-[#1E562F] hover:bg-[#164023] text-white font-black uppercase rounded-2xl">
              {isBlanching ? "Simulando..." : "Validar Processo"}
            </Button>
            <Button onClick={handleSave} disabled={!isValidated || isSaving} className="h-14 bg-white border-2 border-[#1E562F] text-[#1E562F] font-black uppercase rounded-2xl">
              Registrar Laudo
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={cn(
          "p-8 border-2 rounded-3xl shadow-sm transition-all",
          physics.isSafe ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
        )}>
          <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4">Resultado da Simulação</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{physics.finalTemp.toFixed(1)}°C</span>
            <span className="text-xs font-bold text-slate-400">Equilíbrio</span>
          </div>
          <p className="text-xs font-medium mt-4 text-slate-600">
            {physics.isSafe ? "✅ Processo validado conforme artigo científico." : "❌ Risco: Temperatura abaixo do limite de segurança."}
          </p>
        </div>

        <ThermalChart targetTemp={physics.finalTemp} isSimulating={isBlanching} currentTime={blanchingTimer} />
      </div>
    </div>
  );
};

export default ThermalValidation;