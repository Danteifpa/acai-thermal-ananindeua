"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Beaker, Activity, LineChart, Microscope } from 'lucide-react';
import ThermalLab from './ThermalLab';
import ThermalChart from './ThermalChart';
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
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column (4 units): Parameters and Inputs */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-8 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Beaker className="text-purple-500" size={20} />
              Parâmetros
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Configuração da Amostra</p>
          </div>
          
          <div className="space-y-3">
            <Label className="text-slate-400 text-[10px] font-bold uppercase">ID do Batedouro</Label>
            <input 
              type="text"
              value={nomeBatedouro}
              onChange={(e) => setNomeBatedouro(e.target.value)}
              placeholder="Ex: Batedouro Central"
              className="w-full bg-slate-950 border-slate-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-mono text-xs"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-slate-400 text-[10px] font-bold uppercase">Volume da Polpa (L)</Label>
              <span className="text-purple-400 font-black text-lg font-mono">{volume}</span>
            </div>
            <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} max={50} min={1} step={1} className="py-2" />
          </div>

          <div className="space-y-3">
            <Label className="text-slate-400 text-[10px] font-bold uppercase">Material do Recipiente</Label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setMaterial('Metal')}
                className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${material === 'Metal' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                Aço Inox
              </button>
              <button 
                onClick={() => setMaterial('Plástico')}
                className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${material === 'Plástico' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                Polímero
              </button>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all active:scale-95 text-xs"
          >
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Validar e Registrar"}
          </Button>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Constantes Físicas</h3>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">k (Resfriamento):</span>
              <span className="text-blue-400">{currentPhysics.k.toFixed(6)} s⁻¹</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Q (Energia):</span>
              <span className="text-amber-400">{Math.floor(currentPhysics.q).toLocaleString()} J</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Center Column (8 units): The Virtual Lab Environment */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
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

        <Tabs defaultValue="data" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-12 rounded-xl w-full justify-start gap-2">
            <TabsTrigger value="data" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 text-xs font-bold uppercase">
              <Activity size={16} /> Dados em Tempo Real
            </TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 text-xs font-bold uppercase">
              <LineChart size={16} /> Gráfico de Resfriamento
            </TabsTrigger>
            <TabsTrigger value="micro" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 text-xs font-bold uppercase">
              <Microscope size={16} /> Vista Microscópica
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-800 p-4 space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Temperatura Final</p>
                <p className="text-2xl font-black text-white font-mono">{currentPhysics.finalTemp.toFixed(1)}°C</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 p-4 space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Variação Térmica (ΔT)</p>
                <p className="text-2xl font-black text-blue-400 font-mono">{(80 - currentPhysics.finalTemp).toFixed(1)}°C</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 p-4 space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Status Sanitário</p>
                <p className={`text-lg font-black uppercase ${currentPhysics.isSafe ? 'text-green-500' : 'text-red-500'}`}>
                  {currentPhysics.isSafe ? 'Processo Seguro' : 'Risco Biológico'}
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-6">
            <ThermalChart k={currentPhysics.k} isSafe={currentPhysics.isSafe} />
          </TabsContent>

          <TabsContent value="micro" className="mt-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {currentPhysics.isSafe ? (
                  <div className="text-green-500/20 font-black text-[8px] uppercase">Patógenos Inativados</div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <div className="w-1 h-1 bg-red-400 rounded-full absolute" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Simulação visual da atividade biológica do <span className="italic">Trypanosoma cruzi</span> baseada na temperatura atual.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThermalValidation;