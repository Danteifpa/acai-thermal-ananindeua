"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, MapPin, Beaker, Play, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { ViewType } from './Sidebar';

interface Batedor {
  id: string;
  nome: string;
  localizacao: string;
  material_padrao: string;
  volume_padrao: number;
  metodo: string;
}

interface BatedoresDatabaseProps {
  onSimulate: (batedor: any) => void;
}

const BatedoresDatabase = ({ onSimulate }: BatedoresDatabaseProps) => {
  const [batedores, setBatedores] = useState<Batedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    localizacao: '',
    material_padrao: 'Plástico',
    volume_padrao: 20,
    metodo: 'Artesanal'
  });

  const fetchBatedores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('batedores')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setBatedores(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar batedores:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatedores();
  }, []);

  const handleSave = async () => {
    if (!formData.nome) {
      showError("O nome do batedouro é obrigatório.");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('batedores')
        .insert([formData])
        .select();

      if (error) throw error;
      
      showSuccess("Batedouro cadastrado com sucesso!");
      setIsDialogOpen(false);
      fetchBatedores();
      
      // Reset form
      setFormData({
        nome: '',
        localizacao: '',
        material_padrao: 'Plástico',
        volume_padrao: 20,
        metodo: 'Artesanal'
      });

      // Offer simulation
      if (data && data[0]) {
        onSimulate(data[0]);
      }
    } catch (err: any) {
      showError("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Base de Dados: Batedores</h1>
          <p className="text-slate-400 text-lg">Mapeamento de unidades de processamento em Ananindeua/PA.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-12 px-6 rounded-xl font-bold">
              <Plus size={20} />
              Cadastrar Batedor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Novo Batedouro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-slate-400">Nome da Unidade</Label>
                <Input 
                  id="nome" 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="bg-slate-950 border-slate-800" 
                  placeholder="Ex: Batedouro do Nonato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local" className="text-slate-400">Localização (Bairro)</Label>
                <Input 
                  id="local" 
                  value={formData.localizacao}
                  onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                  className="bg-slate-950 border-slate-800" 
                  placeholder="Ex: Cidade Nova"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Material Padrão</Label>
                  <Select 
                    value={formData.material_padrao}
                    onValueChange={(val) => setFormData({...formData, material_padrao: val})}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="Metal">Metal</SelectItem>
                      <SelectItem value="Plástico">Plástico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Volume (L)</Label>
                  <Input 
                    type="number"
                    value={formData.volume_padrao}
                    onChange={(e) => setFormData({...formData, volume_padrao: parseInt(e.target.value)})}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-bold"
              >
                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                Salvar e Iniciar Simulação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-xl">
            <Database className="text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Total Mapeado</p>
            <p className="text-2xl font-black text-white">{batedores.length}</p>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl">
            <MapPin className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Região Foco</p>
            <p className="text-2xl font-black text-white">Ananindeua</p>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
          <div className="bg-green-500/10 p-3 rounded-xl">
            <Beaker className="text-green-400" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Status Pesquisa</p>
            <p className="text-2xl font-black text-white">Ativo</p>
          </div>
        </Card>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Nome do Batedouro</TableHead>
              <TableHead className="text-slate-400">Localização</TableHead>
              <TableHead className="text-slate-400">Material</TableHead>
              <TableHead className="text-slate-400">Volume</TableHead>
              <TableHead className="text-slate-400 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-purple-500" />
                </TableCell>
              </TableRow>
            ) : batedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  Nenhum batedouro cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              batedores.map((batedor) => (
                <TableRow key={batedor.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <TableCell className="text-white font-bold">{batedor.nome}</TableCell>
                  <TableCell className="text-slate-400 text-sm">{batedor.localizacao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {batedor.material_padrao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-purple-400 font-mono">{batedor.volume_padrao}L</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm"
                      onClick={() => onSimulate(batedor)}
                      className="bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-600/20 gap-2 rounded-lg transition-all"
                    >
                      <Play size={14} />
                      Simular
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BatedoresDatabase;