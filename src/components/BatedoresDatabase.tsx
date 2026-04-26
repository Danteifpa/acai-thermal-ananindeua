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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Base de Dados: Batedores</h1>
          <p className="text-slate-500 text-lg">Mapeamento geográfico de Ananindeua/PA.</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="bg-white border-slate-200 text-slate-600 gap-2 h-12 rounded-xl shadow-sm"
          >
            {viewMode === 'list' ? <LayoutGrid size={20} /> : <Database size={20} />}
            {viewMode === 'list' ? 'Ver por Bairro' : 'Ver Lista'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E562F] hover:bg-[#164023] text-white gap-2 h-12 px-6 rounded-xl font-bold shadow-lg shadow-[#1E562F]/10">
                <Plus size={20} /> Cadastrar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[425px]">
              <DialogHeader><DialogTitle className="text-2xl font-bold">Novo Batedouro</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label className="text-slate-500">Nome da Unidade</Label>
                  <Input value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-500">Bairro (Ananindeua)</Label>
                  <Select value={formData.localizacao} onValueChange={(val) => setFormData({...formData, localizacao: val})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
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
                <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#1E562F] h-12 rounded-xl font-bold">
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
            <Card key={neighborhood} className="bg-white border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#1E562F] border-b border-slate-100 pb-3">
                <MapPin size={18} />
                <h3 className="font-black uppercase tracking-widest text-sm">{neighborhood}</h3>
                <Badge variant="outline" className="ml-auto border-slate-200 text-slate-400">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((b: any) => (
                  <div key={b.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                    <span className="text-sm text-slate-700 font-medium">{b.nome}</span>
                    <Button size="sm" variant="ghost" onClick={() => onSimulate(b)} className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-[#1E562F]">
                      <Play size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-900 font-bold">Nome</TableHead>
                <TableHead className="text-slate-900 font-bold">Bairro</TableHead>
                <TableHead className="text-slate-900 font-bold">Material</TableHead>
                <TableHead className="text-slate-900 font-bold">Volume</TableHead>
                <TableHead className="text-slate-900 font-bold text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-[#1E562F]" /></TableCell></TableRow>
              ) : batedores.map((batedor) => (
                <TableRow key={batedor.id} className="border-slate-200 hover:bg-slate-50 transition-colors">
                  <TableCell className="text-slate-900 font-bold">{batedor.nome}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{batedor.localizacao}</TableCell>
                  <TableCell><Badge variant="outline" className="border-slate-200 text-slate-600">{batedor.material_padrao}</Badge></TableCell>
                  <TableCell className="text-[#1E562F] font-mono font-bold">{batedor.volume_padrao}L</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onSimulate(batedor)} className="bg-emerald-50 text-[#1E562F] hover:bg-[#1E562F] hover:text-white border border-emerald-100 gap-2 rounded-lg transition-all">
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