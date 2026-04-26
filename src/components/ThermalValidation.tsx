"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Save, Loader2, PlayCircle } from 'lucide-react';
import ThermalChart from './ThermalChart';
import ImpactComparison from './ImpactComparison';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface ThermalValidationProps {
  onRecordSaved: () => void;
  constants: { metal: number; plastic: number };
  initialData?: any;
}

const ThermalValidation = ({ onRecordSaved, constants, initialData }: ThermalValidationProps) => {
  const [nomeBatedouro, setNomeBatedouro] = useState('');
  const [volume, setVolume] = useState(20);
  const [material, setMaterial] = useState('Plástico');
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill if initialData is provided
  useEffect(() => {
    if (initialData) {
      setNomeBatedouro(initialData.nome || '');
      setVolume(initialData.volume_padrao || 20);
      setMaterial(initialData.material_padrao || 'Plástico');
      showSuccess(`Parâmetros de ${initialData.nome} carregados.`);
    }
  }, [initialData]);

  const SPECIFIC_HEAT = {
    Metal: 0.50,
    Plástico: 2.30
  };

  const calculateTemp = (vol: number, mat: string) => {
    const T0 = 80; 
    const Tenv = 25; 
    const cp = mat === 'Metal' ? SPECIFIC_HEAT.Metal : SPECIFIC_HEAT.Plástico;
    const baseK = mat === 'Metal' ? constants.metal : constants.plastic;
    const k = baseK / (cp * Math.pow(vol || 1, 0.2));
    return Tenv + (T0 - Tenv) * Math.exp(-k * 600);
  };

  const simulationData = useMemo(() => {
    const T0 = 80; 
    const Tenv = 25; 
    const timeSteps = 60; 
    const cp = material === 'Metal' ? SPECIFIC_HEAT.Metal : SPECIFIC_HEAT.Plástico;
    const baseK = material === 'Metal' ? constants.metal : constants.plastic;
    const k = baseK / (cp * Math.pow(volume || 1, 0.2));
    
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

  const optimizedTemp = useMemo(() => calculateTemp(volume + 10, 'Metal'), [volume, constants]);

  const handleSave = async () => {
    if (!nomeBatedouro.trim()) {
      showError("Identificação do batedouro necessária.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('amostras_termicas')
        .insert([{ 
          nome_batedouro: nomeBatedouro, 
          material, 
          volume, 
          temp_final: finalTemp, 
          status_sanitario: isSafe ? 'Processo Seguro' : 'Risco Biológico' 
        }]);

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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Configuração</h2>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Identificação do Batedouro</Label>
          <input 
            type="text"
            value={nomeBatedouro}
            onChange={(e) => setNomeBatedouro(e.target.value)}
            placeholder="ID da Unidade"
            className="w-full bg-slate-950 border-slate-800 text-white rounded-lg p-2 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label className="text-slate-400">Volume (L)</Label>
            <span className="text-purple-400 font-bold">{volume}L</span>
          </div>
          <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">Material</Label>
          <Select value={material} onValueChange={setMaterial}>
            <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="Metal">Aço Inoxidável</SelectItem>
              <SelectItem value="Plástico">Plástico HDPE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-bold">
          {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Validar e Salvar
        </Button>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {isSafe ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4">
                <CheckCircle2 className="text-green-500" size={32} />
                <div>
                  <h2 className="text-xl font-black text-green-500 uppercase">Seguro</h2>
                  <p className="text-green-400/80 text-xs">{finalTemp}°C final.</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
                <AlertTriangle className="text-red-500" size={32} />
                <div>
                  <h2 className="text-xl font-black text-red-500 uppercase">Risco</h2>
                  <p className="text-red-400/80 text-xs">{finalTemp}°C final.</p>
                </div>
              </div>
            )}
            <ThermalChart data={simulationData} />
          </div>
          
          <ImpactComparison currentTemp={finalTemp} optimizedTemp={optimizedTemp} />
        </div>
      </div>
    </div>
  );
};

export default ThermalValidation;