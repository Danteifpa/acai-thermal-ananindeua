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
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNomeBatedouro(initialData.nome || '');
      setVolume(initialData.volume_padrao || 20);
      setMaterial(initialData.material_padrao || 'Plástico');
    }
  }, [initialData]);

  // Simulação de calibração ao mudar valores
  useEffect(() => {
    setIsCalibrating(true);
    const timer = setTimeout(() => setIsCalibrating(false), 500);
    return () => clearTimeout(timer);
  }, [volume, material]);

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
      showSuccess("DADOS_SINCRONIZADOS_COM_SUCESSO");
      onRecordSaved();
    } catch (err: any) { showError("FALHA_NA_MISSÃO: " + err.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1.2fr] gap-8 max-w-[1600px] mx-auto items-start font-mono">
      
      {/* Coluna 1: Console de Comando */}
      <div className="space-y-6">
        <div className="nasa-panel p-8 space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#39FF14]/30 pb-4">
            <Terminal className="text-[#39FF14]" size={20} />
            <h2 className="text-lg font-black tracking-widest uppercase neon-text-glow">Console de Comando</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[#39FF14]/50 text-[10px] font-black uppercase tracking-widest">ID_DA_UNIDADE_DE_CAMPO</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                className="w-full bg-black border border-[#39FF14]/50 text-[#39FF14] p-4 focus:border-[#39FF14] outline-none transition-all font-mono text-sm"
                placeholder="> AGUARDANDO_INPUT..."
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-[#39FF14]/50 text-[10px] font-black uppercase tracking-widest">Volume_Amostra (L)</Label>
                <span className="text-[#39FF14] font-black text-2xl neon-text-glow">{volume}.00</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} className="py-2" />
              {isCalibrating && (
                <div className="space-y-1">
                  <div className="h-1 w-full bg-[#39FF14]/10 overflow-hidden">
                    <div className="h-full bg-[#39FF14] animate-progress-infinite" style={{ width: '30%' }} />
                  </div>
                  <p className="text-[8px] text-[#39FF14] animate-pulse">CALIBRANDO_SENSORES...</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-[#39FF14]/50 text-[10px] font-black uppercase tracking-widest">Material_do_Recipiente</Label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={cn(
                    "flex items-center justify-between p-4 border transition-all uppercase text-[10px] font-black",
                    material === 'Metal' ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]" : "bg-black border-[#39FF14]/20 text-[#39FF14]/40 hover:border-[#39FF14]/50"
                  )}
                >
                  <span>[01] AÇO_INOXIDÁVEL</span>
                  {material === 'Metal' && <div className="w-2 h-2 bg-[#39FF14] shadow-[0_0_5px_#39FF14]" />}
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={cn(
                    "flex items-center justify-between p-4 border transition-all uppercase text-[10px] font-black",
                    material === 'Plástico' ? "bg-[#00FFFF]/20 border-[#00FFFF] text-[#00FFFF]" : "bg-black border-[#00FFFF]/20 text-[#00FFFF]/40 hover:border-[#00FFFF]/50"
                  )}
                >
                  <span>[02] POLÍMERO_TÉCNICO</span>
                  {material === 'Plástico' && <div className="w-2 h-2 bg-[#00FFFF] shadow-[0_0_5px_#00FFFF]" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black h-16 font-black uppercase tracking-widest transition-all active:scale-95"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "EXECUTAR_VALIDAÇÃO_TÉCNICA"}
          </Button>
        </div>
      </div>

      {/* Coluna 2: Telemetria Central */}
      <div className="space-y-8">
        <div className="nasa-panel p-8 space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-[#39FF14]/30 pb-4">
            <div className="flex items-center gap-3">
              <Cpu className="text-[#39FF14]" size={20} />
              <h3 className="font-black text-[#39FF14] uppercase tracking-widest text-sm neon-text-glow">Visualização de Telemetria</h3>
            </div>
            <div className="text-[10px] text-[#39FF14]/50">REF: NASA_IFPA_2026</div>
          </div>

          <ThermalLab 
            volume={volume} material={material} 
            temp={physics.finalTemp} isSafe={physics.isSafe} 
            particleSpeed={physics.particleSpeed} 
          />

          {/* Displays Digitais NASA */}
          <div className="grid grid-cols-3 gap-4">
            <div className="nasa-display space-y-1">
              <p className="text-[8px] font-black text-[#00FFFF]/50 uppercase tracking-widest">TEMP_FINAL</p>
              <p className="text-2xl font-black">{physics.finalTemp.toFixed(2)}°C</p>
            </div>
            <div className="nasa-display space-y-1 border-[#39FF14]/50 text-[#39FF14]">
              <p className="text-[8px] font-black text-[#39FF14]/50 uppercase tracking-widest">ENERGIA_Q</p>
              <p className="text-2xl font-black">{(physics.q / 1000).toFixed(1)}kJ</p>
            </div>
            <div className="nasa-display space-y-1 border-white/30 text-white">
              <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">CONST_K</p>
              <p className="text-2xl font-black">{physics.k.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna 3: Análise de Missão */}
      <div className="space-y-8">
        <ThermalChart k={physics.k} isSafe={physics.isSafe} />

        <div className={cn(
          "p-6 border transition-all duration-500",
          physics.isSafe ? "bg-[#39FF14]/10 border-[#39FF14]" : "bg-[#FF3131]/10 border-[#FF3131]"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3",
              physics.isSafe ? "bg-[#39FF14] text-black" : "bg-[#FF3131] text-white"
            )}>
              {physics.isSafe ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="space-y-1">
              <h4 className={cn(
                "font-black uppercase tracking-widest text-[10px]",
                physics.isSafe ? "text-[#39FF14]" : "text-[#FF3131]"
              )}>
                STATUS_DA_MISSÃO
              </h4>
              <p className="text-sm font-black">
                {physics.isSafe ? "SUCESSO: AMBOSTRA_SEGURA" : "FALHA: RISCO_BIOLÓGICO"}
              </p>
            </div>
          </div>
        </div>

        <div className="nasa-panel p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#00FFFF]">
            <Terminal size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">LOG_DE_ENGENHARIA</h4>
          </div>
          <p className="text-[10px] text-[#00FFFF]/70 leading-relaxed">
            > ANALISANDO_DECAIMENTO_EXPONENCIAL...<br/>
            > VOLUME_DENTRO_DOS_PARÂMETROS...<br/>
            > RECOMENDAÇÃO: MANTER_PROTOCOLO_52.5C.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThermalValidation;