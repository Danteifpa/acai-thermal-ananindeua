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
  Thermometer
} from 'lucide-react';
import ThermalLab from './ThermalLab';
import ThermalChart from './ThermalChart';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from "@/lib/utils";

const ThermalValidation = ({ onRecordSaved, initialData }: any) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volumeFruto, setVolumeFruto] = useState(14); // Padrão do artigo: 14kg
  const [volumeAgua, setVolumeAgua] = useState(9);   // Padrão do artigo: 9L
  const [material, setMaterial] = useState('Metal');
  const [isSaving, setIsSaving] = useState(false);
  const [blanchingTimer, setBlanchingTimer] = useState(0);
  const [isBlanching, setIsBlanching] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  
  // Checklist BPF
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

  // Lógica do Cronômetro Embrapa (10s a 80°C)
  useEffect(() => {
    let interval: any;
    if (isBlanching && blanchingTimer < 10) {
      interval = setInterval(() => {
        setBlanchingTimer(prev => prev + 1);
      }, 1000);
    } else if (blanchingTimer >= 10) {
      setIsValidated(true);
      setIsBlanching(false);
      showSuccess("Protocolo Embrapa 80°C/10s concluído!");
    }
    return () => clearInterval(interval);
  }, [isBlanching, blanchingTimer]);

  const physics = useMemo(() => {
    // Constantes do Artigo: Inox (k=15), Polímero (k=0.38)
    const k_material = material === 'Metal' ? 0.0045 : 0.0012; // k ajustado para escala de tempo
    const ratio = volumeAgua / volumeFruto;
    
    // O equilíbrio térmico depende da razão Água/Fruto
    // Se ratio < 0.6 (aprox 8.5L/14kg), a temperatura cai muito rápido
    const thermalEfficiency = ratio >= 0.6 ? 1 : ratio / 0.6;
    
    // Lei do Resfriamento de Newton aplicada ao equilíbrio
    const T0 = 80;
    const Tenv = 25;
    const finalTemp = Tenv + (T0 - Tenv) * Math.exp(-k_material * 600) * thermalEfficiency;
    
    const isSafe = finalTemp >= 52.5 && isValidated;
    
    let failureReason = "";
    if (finalTemp < 52.5) {
      if (ratio < 0.6) failureReason = "Volume de água insuficiente para a massa térmica do fruto.";
      else if (material === 'Plástico') failureReason = "Recipiente de polímero apresenta alta inércia térmica e perda de calor ineficiente.";
      else failureReason = "Equilíbrio térmico abaixo do limite de segurança biológica.";
    }

    return { k: k_material, finalTemp, isSafe, failureReason };
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
      showSuccess("Validação registrada com sucesso.");
      onRecordSaved();
    } catch (err: any) { showError(err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr_1fr] gap-8 max-w-[1600px] mx-auto items-start">
      
      {/* Coluna 1: Configuração e BPF */}
      <div className="space-y-6">
        <div className="clinical-card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <ClipboardCheck className="text-[#1E562F]" size={20} />
            <h2 className="ifpa-title text-sm">Checklist de BPF</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Checkbox 
                id="higienizacao" 
                checked={checklist.higienizacao} 
                onCheckedChange={(val) => setChecklist({...checklist, higienizacao: !!val})}
              />
              <Label htmlFor="higienizacao" className="text-xs font-medium text-slate-700 cursor-pointer">Higienização do Batedor (Inox/Polímero)</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Checkbox 
                id="catacao" 
                checked={checklist.catacao} 
                onCheckedChange={(val) => setChecklist({...checklist, catacao: !!val})}
              />
              <Label htmlFor="catacao" className="text-xs font-medium text-slate-700 cursor-pointer">Catação e Lavagem dos Frutos</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Checkbox 
                id="temperatura" 
                checked={checklist.temperatura} 
                onCheckedChange={(val) => setChecklist({...checklist, temperatura: !!val})}
              />
              <Label htmlFor="temperatura" className="text-xs font-medium text-slate-700 cursor-pointer">Água de Branqueamento a 80°C</Label>
            </div>
          </div>
        </div>

        <div className="clinical-card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Activity className="text-[#1E562F]" size={20} />
            <h2 className="ifpa-title text-sm">Parâmetros do Artigo</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Massa de Fruto (kg)</Label>
              <div className="flex justify-between items-center">
                <Slider value={[volumeFruto]} onValueChange={(val) => setVolumeFruto(val[0])} max={30} min={5} step={1} className="flex-1 mr-4" />
                <span className="text-xl font-black lcd-display w-12 text-right">{volumeFruto}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Volume de Água (L)</Label>
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
                  AÇO INOX (k=15)
                </Button>
                <Button 
                  variant={material === 'Plástico' ? 'default' : 'outline'}
                  onClick={() => setMaterial('Plástico')}
                  className={cn("h-12 rounded-xl font-bold text-[10px]", material === 'Plástico' ? "bg-[#1E562F]" : "border-slate-200")}
                >
                  POLÍMERO (k=0.38)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna 2: Simulação Visual */}
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

      {/* Coluna 3: Resultados e Gráfico */}
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
                  ? "Critérios Térmicos (Artigo Científico) e Normas da Embrapa atingidos com sucesso."
                  : physics.failureReason || "O processo não atingiu o equilíbrio térmico de segurança (52.5°C)."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/50 p-3 rounded-xl">
                <p className="text-[8px] font-black text-slate-400 uppercase">Temp. Equilíbrio</p>
                <p className="text-xl font-black lcd-display">{physics.finalTemp.toFixed(1)}°C</p>
              </div>
              <div className="bg-white/50 p-3 rounded-xl">
                <p className="text-[8px] font-black text-slate-400 uppercase">Razão Água/Fruto</p>
                <p className="text-xl font-black lcd-display">{(volumeAgua/volumeFruto).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <ThermalChart k={physics.k} isSafe={physics.isSafe} />
      </div>
    </div>
  );
};

export default ThermalValidation;