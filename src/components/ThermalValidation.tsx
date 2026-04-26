"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Info, Loader2 } from 'lucide-react';
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
    <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card className="bg-white border-slate-200 p-8 space-y-8 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configuração</h2>
            <p className="text-slate-500 text-xs font-medium">Ajuste os parâmetros da amostra.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ID do Batedouro</Label>
              <input 
                type="text"
                value={nomeBatedouro}
                onChange={(e) => setNomeBatedouro(e.target.value)}
                placeholder="Ex: Batedouro Central"
                className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume (L)</Label>
                <span className="text-blue-600 font-black text-2xl font-mono">{volume}</span>
              </div>
              <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} className="py-2" />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Material</Label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setMaterial('Metal')}
                  className={`p-4 rounded-xl border text-xs font-bold uppercase transition-all ${material === 'Metal' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  Aço Inox
                </button>
                <button 
                  onClick={() => setMaterial('Plástico')}
                  className={`p-4 rounded-xl border text-xs font-bold uppercase transition-all ${material === 'Plástico' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  Polímero
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Validar e Registrar"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-slate-200 text-slate-500 hover:bg-slate-50 h-12 rounded-xl gap-2">
                  <Info size={16} /> Ver Constantes Técnicas
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-slate-200 text-slate-900">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Constantes Termodinâmicas</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 font-mono">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Constante k:</span>
                    <span className="text-blue-600">{currentPhysics.k.toFixed(6)} s⁻¹</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Energia Q:</span>
                    <span className="text-amber-600">{Math.floor(currentPhysics.q).toLocaleString()} J</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Calor Específico c:</span>
                    <span className="text-blue-600">{material === 'Metal' ? 0.50 : 2.30} kJ/kg·K</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-8">
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
  );
};

export default ThermalValidation;