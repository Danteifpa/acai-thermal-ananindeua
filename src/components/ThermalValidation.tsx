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
import { Progress } from "@/components/ui/progress";

interface ThermalValidationProps {
  onRecordSaved: () => void;
  constants: { metal: number; plastic: number };
}

const ThermalValidation = ({ onRecordSaved, constants }: ThermalValidationProps) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volume, setVolume] = useState(20);
  const [material, setMaterial] = useState('Plástico');
  const [isSaving, setIsSaving] = useState(false);

  // Scientific Constants (Specific Heat in kJ/kg.K)
  const SPECIFIC_HEAT = {
    Metal: 0.50, // Stainless Steel
    Plástico: 2.30 // HDPE Plastic
  };

  const simulationData = useMemo(() => {
    const T0 = 80; 
    const Tenv = 25; 
    const timeSteps = 60; 
    
    // k = (h * A) / (m * cp). Simplified model where k is inversely proportional to specific heat
    // and volume (mass proxy).
    const cp = material === 'Metal' ? SPECIFIC_HEAT.Metal : SPECIFIC_HEAT.Plástico;
    const baseK = 0.005; 
    const k = baseK / (cp * Math.pow(volume || 1, 0.2));
    
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

  const efficiencyScore = useMemo(() => {
    const score = (finalTemp / 52.5) * 100;
    return Math.min(Math.max(score, 0), 100);
  }, [finalTemp]);

  const suggestion = useMemo(() => {
    if (isSafe) return "Parâmetros térmicos validados. O processo garante a inativação de patógenos.";
    
    if (material === 'Plástico') {
      return "Sugestão: A condutividade do HDPE é baixa. Substitua por um recipiente metálico para acelerar a troca térmica controlada.";
    } else {
      return "Sugestão: Aumentar a inércia térmica elevando o volume de água em 5L-10L.";
    }
  }, [isSafe, material]);

  const handleSave = async () => {
    if (!nomeBatedouro.trim()) {
      showError("Identificação do batedouro necessária.");
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
      
      showSuccess("Dados científicos persistidos com sucesso.");
      onRecordSaved();
      setNomeBatedouro('');
    } catch (err: any) {
      showError("Falha na persistência: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-slate-900 border-slate-800 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Configuração da Amostra</h2>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Identificação do Batedouro</Label>
          <input 
            type="text"
            value={nomeBatedouro}
            onChange={(e) => setNomeBatedouro(e.target.value)}
            placeholder="ID da Unidade de Processamento"
            className="w-full bg-slate-950 border-slate-800 text-white rounded-lg p-2 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label className="text-slate-400">Volume (L)</Label>
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
              <SelectItem value="Metal">Aço Inoxidável (0.50 kJ/kg.K)</SelectItem>
              <SelectItem value="Plástico">Plástico HDPE (2.30 kJ/kg.K)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Eficiência Térmica</span>
            <span className="text-xs font-bold text-purple-400">{efficiencyScore.toFixed(0)}%</span>
          </div>
          <Progress value={efficiencyScore} className="h-2 bg-slate-800" />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-bold transition-all"
        >
          {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Validar e Salvar
        </Button>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          {isSafe ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-green-500 p-4 rounded-full">
                <CheckCircle2 className="text-white" size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-green-500 uppercase tracking-tighter">Processo Seguro</h2>
                <p className="text-green-400/80 font-medium">Temperatura final de {finalTemp}°C em conformidade biológica.</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-red-500 p-4 rounded-full">
                <AlertTriangle className="text-white" size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter">Risco Biológico</h2>
                <p className="text-red-400/80 font-medium">Temperatura final de {finalTemp}°C insuficiente para inativação.</p>
              </div>
            </div>
          )}

          <Card className="bg-slate-900/50 border-slate-800 p-4 flex items-start gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Lightbulb className="text-purple-400" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Ação Sugerida (DSS)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{suggestion}</p>
            </div>
          </Card>
        </div>

        <ThermalChart data={simulationData} />
      </div>
    </div>
  );
};

export default ThermalValidation;