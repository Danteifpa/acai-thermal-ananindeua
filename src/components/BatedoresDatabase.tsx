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
import { Database, MapPin, Beaker, Play, Plus, Loader2, LayoutGrid } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [formData, setFormData] = useState({
    nome: '',
    localizacao: 'Cidade Nova',
    material_padrao: 'Plástico',
    volume_padrao: 20,
    metodo: 'Artesanal'
  });

  const fetchBatedores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('batedores').select('*').order('nome');
      if (error) throw error;
      setBatedores(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar batedores:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBatedores(); }, []);

  const handleSave = async () => {
    if (!formData.nome) { showError("O nome do batedouro é obrigatório."); return; }
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('batedores').insert([formData]).select();
      if (error) throw error;
      showSuccess("Batedouro cadastrado com sucesso!");
      setIsDialogOpen(false);
      fetchBatedores();
      if (data && data[0]) onSimulate(data[0]);
    } catch (err: any) {
      showError("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const groupedBatedores = batedores.reduce((acc: any, curr) => {
    const neighborhood = curr.localizacao || 'Outros';
    if (!acc[neighborhood]) acc[neighborhood] = [];
    acc[neighborhood].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Base de Dados: Batedores</h1>
          <p className="text-slate-400 text-lg">Mapeamento geográfico de Ananindeua/PA.</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="bg-slate-900 border-slate-800 text-slate-400 gap-2 h-12 rounded-xl"
          >
            {viewMode === 'list' ? <LayoutGrid size={20} /> : <Database size={20} />}
            {viewMode === 'list' ? 'Ver por Bairro' : 'Ver Lista'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-12 px-6 rounded-xl font-bold">
                <Plus size={20} /> Cadastrar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
              <DialogHeader><DialogTitle className="text-2xl font-bold">Novo Batedouro</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Nome da Unidade</Label>
                  <Input value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Bairro (Ananindeua)</Label>
                  <Select value={formData.localizacao} onValueChange={(val) => setFormData({...formData, localizacao: val})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="Cidade Nova">Cidade Nova</SelectItem>
                      <SelectItem value="Coqueiro">Coqueiro</SelectItem>
                      <SelectItem value="Centro">Centro</SelectItem>
                      <SelectItem value="Guajará">Guajará</SelectItem>
                      <SelectItem value="Jaderlândia">Jaderlândia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={isSaving} className="w-full bg-purple-600 h-12 rounded-xl font-bold">
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />} Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedBatedores).map(([neighborhood, items]: [string, any]) => (
            <Card key={neighborhood} className="bg-slate-900 border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 border-b border-slate-800 pb-3">
                <MapPin size={18} />
                <h3 className="font-black uppercase tracking-widest text-sm">{neighborhood}</h3>
                <Badge variant="outline" className="ml-auto border-slate-700 text-slate-500">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((b: any) => (
                  <div key={b.id} className="flex justify-between items-center p-2 hover:bg-slate-800 rounded-lg transition-colors group">
                    <span className="text-sm text-slate-300 font-medium">{b.nome}</span>
                    <Button size="sm" variant="ghost" onClick={() => onSimulate(b)} className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-purple-400">
                      <Play size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-950">
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Nome</TableHead>
                <TableHead className="text-slate-400">Bairro</TableHead>
                <TableHead className="text-slate-400">Material</TableHead>
                <TableHead className="text-slate-400">Volume</TableHead>
                <TableHead className="text-slate-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-purple-500" /></TableCell></TableRow>
              ) : batedores.map((batedor) => (
                <TableRow key={batedor.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <TableCell className="text-white font-bold">{batedor.nome}</TableCell>
                  <TableCell className="text-slate-400 text-sm">{batedor.localizacao}</TableCell>
                  <TableCell><Badge variant="outline" className="border-slate-700 text-slate-300">{batedor.material_padrao}</Badge></TableCell>
                  <TableCell className="text-purple-400 font-mono">{batedor.volume_padrao}L</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onSimulate(batedor)} className="bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-600/20 gap-2 rounded-lg">
                      <Play size={14} /> Simular
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BatedoresDatabase;