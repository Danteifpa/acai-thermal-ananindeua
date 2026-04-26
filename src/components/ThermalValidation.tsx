"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Loader2, FlaskConical, Beaker } from 'lucide-react';
import ThermalLab from './ThermalLab';
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
    }
  }, [initialData]);

  const SPECIFIC_HEAT = { Metal: 0.50, Plástico: 2.30 };
  const C_ACAI = 4000;
  const T0 = 80;
  const TENV = 25;

  const calculatePhysics = (m: string, v: number) => {
    const cp = m === 'Metal' ? SPECIFIC_HEAT.Metal : SPECIFIC_HEAT.Plástico;
    const baseK = m === 'Metal' ? constants.metal : constants.plastic;
    const k = baseK / (cp * Math.pow(v || 1, 0.2));
    const finalTemp = TENV + (T0 - TENV) * Math.exp(-k * 600);
    return { k, finalTemp, isSafe: finalTemp >= 52.5, q: v * C_ACAI * (T0 - finalTemp) };
  };

  const currentPhysics = useMemo(() => calculatePhysics(material, volume), [volume, material, constants]);

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
          temp_final: parseFloat(currentPhysics.finalTemp.toFixed(1)), 
          status_sanitario: currentPhysics.isSafe ? 'Processo Seguro' : 'Risco Biológico' 
        }]);
      if (error) throw error;
      showSuccess("Dados científicos persistidos.");
      onRecordSaved();
      setNomeBatedouro('');
    } catch (err: any) {
      showError("Falha na persistência: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Control Panel */}
        <Card className="lg:col-span-1 bg-slate-900 border-slate-800 p-6 space-y-8 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Beaker className="text-purple-500" size={20} />
              Configuração
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Parâmetros de Entrada</p>
          </div>
          
          <div className="space-y-3">
            <Label className="text-slate-400 text-[10px] font-bold uppercase">Unidade Experimental</Label>
            <input 
              type="text"
              value={nomeBatedouro}
              onChange={(e) => setNomeBatedouro(e.target.value)}
              placeholder="ID do Batedouro"
              className="w-full bg-slate-950 border-slate-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-mono text-xs"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-slate-400 text-[10px] font-bold uppercase">Volume (L)</Label>
              <span className="text-purple-400 font-black text-lg font-mono">{volume}</span>
            </div>
            <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} className="py-2" />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all active:scale-95 text-xs"
          >
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Registrar Dados"}
          </Button>
        </Card>

        {/* Large Virtual Lab Area */}
        <div className="lg:col-span-3">
          <ThermalLab 
            volume={volume}
            material={material}
            temp={currentPhysics.finalTemp}
            isSafe={currentPhysics.isSafe}
            k={currentPhysics.k}
            q={currentPhysics.q}
            onMaterialChange={setMaterial}
            onVolumeChange={setVolume}
          />
        </div>
      </div>
    </div>
  );
};

export default ThermalValidation;