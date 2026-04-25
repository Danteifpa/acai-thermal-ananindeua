"use client";

import React, { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Save, Loader2, Lightbulb } from 'lucide-react';
import ThermalChart from './ThermalChart';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface ThermalValidationProps {
  onRecordSaved: () => void;
  constants: { metal: number; plastic: number };
}

const ThermalValidation = ({ onRecordSaved, constants }: ThermalValidationProps) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volume, setVolume] = useState(20);
  const [material, setMaterial] = useState('Plástico');
  const [isSaving, setIsSaving] = useState(false);

  const simulationData = useMemo(() => {
    const T0 = 80; 
    const Tenv = 25; 
    const timeSteps = 60; 
    
    const materialConstant = material === 'Metal' ? constants.metal : constants.plastic;
    const k = materialConstant / Math.pow(volume || 1, 0.3);
    
    const data = [];
    for (let i = 0; i <= timeSteps; i++) {
      const t = i * 10;
      const temp = Tenv + (T0 - Tenv) * Math.exp(-k * t);
      data.push({ time: t, temp: parseFloat(temp.toFixed(1)) });
    }
    return data;
  }, [volume, material, constants]);

  const finalTemp = simulationData[simulationData.length - 1].temp;
  const isSafe = finalTemp >= 52.5;

  // Recommendation Logic
  const recommendation = useMemo(() => {
    if (isSafe) return null;
    
    const targetK = -Math.log(0.5) / 600; // k required for 52.5C at 600s
    const materialConstant = material === 'Metal' ? constants.metal : constants.plastic;
    const requiredVolume = Math.pow(materialConstant / targetK, 1/0.3);
    const volumeDiff = Math.ceil(requiredVolume - volume);

    if (material === 'Metal') {
      return `Ação Necessária: Aumente o volume em pelo menos ${volumeDiff}L para reter calor por mais tempo.`;
    } else {
      return `Ação Recomendada: Mude para um recipiente de Metal ou aumente o volume em ${volumeDiff}L.`;
    }
  }, [isSafe, volume, material, constants]);

  const handleSave = async () => {
    if (!nomeBatedouro.trim()) {
      showError("Por favor, insira o nome do batedouro.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('amostras_termicas')
        .insert([
          { 
            nome_batedouro: nomeBatedouro, 
            material, 
            volume, 
            temp_final: finalTemp, 
            status_sanitario: isSafe ? 'Processo Seguro' : 'Risco Biológico' 
          }
        ]);

      if (error) throw error;
      
      showSuccess("Validação salva com sucesso!");
      onRecordSaved();
      setNomeBatedouro('');
    } catch (err: any) {
      showError("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-slate-900 border-slate-800 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Parâmetros de Entrada</h2>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Nome do Batedouro</Label>
          <input 
            type="text"
            value={nomeBatedouro}
            onChange={(e) => setNomeBatedouro(e.target.value)}
            placeholder="Ex: Batedouro Central"
            className="w-full bg-slate-950 border-slate-800 text-white rounded-lg p-2 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label className="text-slate-400">Volume de Água (L)</Label>
            <span className="text-purple-400 font-bold">{volume}L</span>
          </div>
          <Slider 
            value={[volume]} 
            onValueChange={(val) => setVolume(val[0])} 
            max={50} 
            min={1}
            step={1}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">Material do Recipiente</Label>
          <Select value={material} onValueChange={setMaterial}>
            <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
              <SelectValue placeholder="Selecione o material" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="Metal">Metal (Alta Condutividade)</SelectItem>
              <SelectItem value="Plástico">Plástico (Isolante)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-bold transition-all"
        >
          {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Salvar Validação
        </Button>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        {isSafe ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-green-500 p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <CheckCircle2 className="text-white" size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-green-500 uppercase tracking-tighter">Processo Seguro</h2>
              <p className="text-green-400/80 font-medium">Temperatura final de {finalTemp}°C atende aos requisitos sanitários.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-red-500 p-4 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <AlertTriangle className="text-white" size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter">Risco Biológico</h2>
                <p className="text-red-400/80 font-medium">Temperatura final de {finalTemp}°C é insuficiente para eliminação de patógenos.</p>
              </div>
            </div>
            
            {recommendation && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-left-4 duration-700">
                <Lightbulb className="text-amber-500 shrink-0 mt-1" size={20} />
                <p className="text-amber-200 text-sm font-medium">{recommendation}</p>
              </div>
            )}
          </div>
        )}

        <ThermalChart data={simulationData} />
      </div>
    </div>
  );
};

export default ThermalValidation;