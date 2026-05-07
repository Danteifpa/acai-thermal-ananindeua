"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Loader2, MapPin, Beaker } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

interface BatedorFormProps {
  onSuccess: () => void;
}

const BatedorForm = ({ onSuccess }: BatedorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    bairro: '',
    material: 'Balde',
    volume_padrao: '',
    latitude: '',
    longitude: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase.from('batedouros').insert([{
        nome: formData.nome,
        bairro: formData.bairro,
        material: formData.material,
        volume_padrao: parseFloat(formData.volume_padrao),
        x: parseFloat(formData.longitude), // Longitude
        y: parseFloat(formData.latitude)   // Latitude
      }]);

      if (error) throw error;

      showSuccess("Batedouro Cadastrado com Sucesso!");
      setIsOpen(false);
      setFormData({ nome: '', bairro: '', material: 'Balde', volume_padrao: '', latitude: '', longitude: '' });
      onSuccess();
    } catch (err: any) {
      showError("Erro ao cadastrar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1E562F] hover:bg-[#164023] h-12 rounded-xl font-bold gap-2 shadow-lg shadow-emerald-900/20">
          <Plus size={20} /> Novo Batedouro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-none shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-2xl font-black text-[#1E562F] flex items-center gap-2">
            <Beaker size={24} /> Cadastro Técnico
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-xs font-black uppercase text-slate-400">Nome Fantasia</Label>
            <Input 
              id="nome" 
              required 
              placeholder="Ex: Açaí do Nonato" 
              className="h-12 rounded-xl border-slate-200 focus:ring-[#1E562F]"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro" className="text-xs font-black uppercase text-slate-400">Bairro</Label>
              <Input 
                id="bairro" 
                required 
                placeholder="Ex: Centro" 
                className="h-12 rounded-xl border-slate-200"
                value={formData.bairro}
                onChange={(e) => setFormData({...formData, bairro: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume" className="text-xs font-black uppercase text-slate-400">Volume (L)</Label>
              <Input 
                id="volume" 
                type="number" 
                step="0.1" 
                required 
                placeholder="Ex: 15.5" 
                className="h-12 rounded-xl border-slate-200"
                value={formData.volume_padrao}
                onChange={(e) => setFormData({...formData, volume_padrao: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Tipo de Armazenamento</Label>
            <Select value={formData.material} onValueChange={(val) => setFormData({...formData, material: val})}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200">
                <SelectValue placeholder="Selecione o material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tambor">Tambor</SelectItem>
                <SelectItem value="Balde">Balde Plástico</SelectItem>
                <SelectItem value="Inox">Aço Inox</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <Label htmlFor="lat" className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> Latitude
              </Label>
              <Input 
                id="lat" 
                required 
                placeholder="-1.36..." 
                className="h-10 rounded-lg border-slate-200 bg-white text-xs"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng" className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> Longitude
              </Label>
              <Input 
                id="lng" 
                required 
                placeholder="-48.3..." 
                className="h-10 rounded-lg border-slate-200 bg-white text-xs"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full h-14 bg-[#1E562F] hover:bg-[#164023] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02]"
          >
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Salvar Batedouro
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BatedorForm;