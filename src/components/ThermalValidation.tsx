"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Save, Loader2 } from 'lucide-react';
import ThermalChart from './ThermalChart';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

const ThermalValidation = ({ onRecordSaved }: { onRecordSaved: () => void }) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volume, setVolume] = useState(20);
  const [material, setMaterial] = useState('Plástico');
  const [isSaving, setIsSaving] = useState(false);

  // Physics Logic: Newton's Law of Cooling
  // T(t) = T_env + (T0 - T_env) * e^(-kt)
  const simulationData = useMemo(() => {
    const T0 = 80; // Initial temp (boiling water mix)
    const Tenv = 25; // Ambient temp
    const timeSteps = 60; // 600 seconds in 10s intervals
    
    // k depends on material and volume (simplified)
    // Metal conducts heat faster (higher k)
    // Larger volume retains heat longer (lower k)
    const materialConstant = material === 'Metal' ? 0.004 : 0.0015;
    const k = materialConstant / Math.pow(volume, 0.3);
    
    const data = [];
    for (let i = 0; i <= timeSteps; i++) {
      const t = i * 10;
      const temp = Tenv + (T0 - Tenv) * Math.exp(-k * t);
      data.push({ time: t, temp: parseFloat(temp.toFixed(1)) });
    }
    return data;
  }, [volume, material]);

  const finalTemp = simulationData[simulationData.length - 1].temp;
  const isSafe = finalTemp >= 52.5;

  const handleSave = async () => {
    if (!nomeBatedouro) {
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
          <Label className="text-slate-400">Nome do Batedouro</Input>
          <input 
            type="text"
            value={nomeBatedouro}
            onChange={(e) => setNomeBatedouro(e.target.value)}
            placeholder="Ex: Batedouro Central"
            className="w-full bg-slate-950 border-slate-800 text-white rounded-lg p-2 focus:ring-2 focus:ring-purple-600 outline-none"
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-red-500 p-4 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <AlertTriangle className="text-white" size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter">Risco Biológico</h2>
              <p className="text-red-400/80 font-medium">Temperatura final de {finalTemp}°C é insuficiente para eliminação de patógenos.</p>
            </div>
          </div>
        )}

        <ThermalChart data={simulationData} />
      </div>
    </div>
  );
};

export default ThermalValidation;