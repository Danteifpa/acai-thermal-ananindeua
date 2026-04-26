"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Loader2 } from 'lucide-react';
import ThermalLab from './ThermalLab';
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

  // Physics Constants for HUD
  const C_ACAI = 4000; // J/(kg*K) - Approximate specific heat of acai pulp
  const T0 = 80;
  const TENV = 25;

  const physicsValues = useMemo(() => {
    const cp = material === 'Metal' ? SPECIFIC_HEAT.Metal : SPECIFIC_HEAT.Plástico;
    const baseK = material === 'Metal' ? constants.metal : constants.plastic;
    const k = baseK / (cp * Math.pow(volume || 1, 0.2));
    
    const finalTemp = TENV + (T0 - TENV) * Math.exp(-k * 600);
    
    // Energy Exchange Q = m * c * deltaT
    // Assuming density 1kg/L
    const q = volume * C_ACAI * (T0 - finalTemp);
    
    // Time to reach 52.5C
    // 52.5 = 25 + 55 * exp(-kt) -> 27.5/55 = exp(-kt) -> 0.5 = exp(-kt) -> t = -ln(0.5)/k
    const timeToCritical = Math.log(0.5) / -k;

    return {
      k,
      finalTemp: parseFloat(finalTemp.toFixed(1)),
      q: Math.round(q),
      timeToCritical,
      isSafe: finalTemp >= 52.5
    };
  }, [volume, material, constants]);

  const optimizedTemp = useMemo(() => {
    const cp = SPECIFIC_HEAT.Metal;
    const baseK = constants.metal;
    const k = baseK / (cp * Math.pow(volume + 10, 0.2));
    return TENV + (T0 - TENV) * Math.exp(-k * 600);
  }, [volume, constants]);

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
          temp_final: physicsValues.finalTemp, 
          status_sanitario: physicsValues.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 bg-slate-900 border-slate-800 p-8 space-y-8 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Parâmetros</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Configuração Experimental</p>
        </div>
        
        <div className="space-y-3">
          <Label className="text-slate-400 text-xs font-bold uppercase">Identificação da Unidade</Label>
          <input 
            type="text"
            value={nomeBatedouro}
            onChange={(e) => setNomeBatedouro(e.target.value)}
            placeholder="Ex: Batedouro Central"
            className="w-full bg-slate-950 border-slate-800 text-white rounded-xl p-4 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-mono text-sm"
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <Label className="text-slate-400 text-xs font-bold uppercase">Volume da Amostra</Label>
            <span className="text-purple-400 font-black text-xl font-mono">{volume}L</span>
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

        <div className="space-y-3">
          <Label className="text-slate-400 text-xs font-bold uppercase">Material do Recipiente</Label>
          <Select value={material} onValueChange={setMaterial}>
            <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-14 rounded-xl font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="Metal">Aço Inoxidável (Metal)</SelectItem>
              <SelectItem value="Plástico">Polietileno (Plástico)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all active:scale-95"
        >
          {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Registrar Experimento"}
        </Button>
      </Card>

      <div className="lg:col-span-2 space-y-8">
        <ThermalLab 
          volume={volume}
          material={material}
          temp={physicsValues.finalTemp}
          isSafe={physicsValues.isSafe}
          k={physicsValues.k}
          q={physicsValues.q}
          timeToCritical={physicsValues.timeToCritical}
        />
        
        <ImpactComparison 
          currentTemp={physicsValues.finalTemp} 
          optimizedTemp={optimizedTemp} 
        />
      </div>
    </div>
  );
};

export default ThermalValidation;