"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Medal, 
  ShieldCheck, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  Star
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

type Level = 'Iniciante' | 'Técnico' | 'Especialista';

const TrainingAcademy = () => {
  const [level, setLevel] = useState<Level>('Iniciante');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [challenge, setChallenge] = useState({ volume: 10, material: 'Plástico' });
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [badges, setBadges] = useState<string[]>([]);

  const generateChallenge = () => {
    const volumes = level === 'Iniciante' ? [10, 20] : level === 'Técnico' ? [15, 25, 35] : [12, 18, 22, 45];
    const materials = ['Metal', 'Plástico'];
    setChallenge({
      volume: volumes[Math.floor(Math.random() * volumes.length)],
      material: materials[Math.floor(Math.random() * materials.length)]
    });
    setFeedback('none');
  };

  useEffect(() => {
    generateChallenge();
  }, [level]);

  const checkAnswer = (userGuessSafe: boolean) => {
    const T0 = 80;
    const TENV = 25;
    const cp = challenge.material === 'Metal' ? 0.50 : 2.30;
    const baseK = challenge.material === 'Metal' ? 0.004 : 0.0015;
    const k = baseK / (cp * Math.pow(challenge.volume, 0.2));
    const finalTemp = TENV + (T0 - TENV) * Math.exp(-k * 600);
    const isActuallySafe = finalTemp >= 52.5;

    if (userGuessSafe === isActuallySafe) {
      const points = level === 'Iniciante' ? 10 : level === 'Técnico' ? 20 : 30;
      setScore(s => s + points);
      setFeedback('correct');
      const newProgress = Math.min(100, progress + 10);
      setProgress(newProgress);
      
      if (newProgress === 30 && !badges.includes('Guardião Sanitário')) {
        setBadges([...badges, 'Guardião Sanitário']);
        showSuccess("Medalha Conquistada: Guardião Sanitário!");
      }
      if (newProgress === 70 && !badges.includes('Mestre da Termodinâmica')) {
        setBadges([...badges, 'Mestre da Termodinâmica']);
        showSuccess("Medalha Conquistada: Mestre da Termodinâmica!");
      }
      if (newProgress === 100 && !badges.includes('Especialista BCT')) {
        setBadges([...badges, 'Especialista BCT']);
        showSuccess("Certificação Completa: Especialista BCT!");
      }
    } else {
      setFeedback('wrong');
      setProgress(p => Math.max(0, p - 5));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academia de Treinamento</h1>
        <p className="text-slate-500 text-lg">Simulador de desafios para certificação em segurança térmica.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Progress & Badges */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-6 shadow-sm border-slate-200">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progresso de Aprendizado</p>
                <span className="text-blue-600 font-black">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-100" />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medalhas Conquistadas</p>
              <div className="grid grid-cols-3 gap-2">
                {['Guardião Sanitário', 'Mestre da Termodinâmica', 'Especialista BCT'].map((b) => (
                  <div key={b} className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${badges.includes(b) ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                    {b === 'Guardião Sanitário' ? <ShieldCheck size={24} /> : b === 'Mestre da Termodinâmica' ? <Brain size={24} /> : <Trophy size={24} />}
                    <span className="text-[8px] font-bold text-center leading-tight">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Pontuação Total</span>
                <span className="text-xl font-black text-slate-900">{score} pts</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Challenge Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="p-8 space-y-8 shadow-sm border-slate-200 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Star className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Simulador de Desafios</h3>
                  <p className="text-xs text-slate-500">Nível: {level}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(['Iniciante', 'Técnico', 'Especialista'] as Level[]).map((l) => (
                  <Button 
                    key={l}
                    variant={level === l ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLevel(l)}
                    className={level === l ? 'bg-blue-600' : 'text-slate-500 border-slate-200'}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-12 text-center space-y-6 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Cenário Experimental</p>
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-slate-900">{challenge.volume} Litros</h2>
                <p className="text-xl text-blue-600 font-bold">Recipiente de {challenge.material}</p>
              </div>
              <p className="text-slate-500 max-w-md mx-auto">
                Considerando o tempo de branqueamento de 10 minutos, este processo é considerado <span className="font-bold text-slate-900">SEGURO</span> para consumo?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => checkAnswer(true)}
                className="h-20 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
              >
                Sim, Seguro
              </Button>
              <Button 
                onClick={() => checkAnswer(false)}
                className="h-20 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-black uppercase tracking-widest shadow-lg shadow-red-600/20"
              >
                Não, Risco
              </Button>
            </div>

            {feedback !== 'none' && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all z-50 ${feedback === 'correct' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle2 className="text-emerald-500" size={64} />
                      <h3 className="text-2xl font-black text-slate-900">Cálculo Correto!</h3>
                      <p className="text-slate-500 text-center">Você demonstrou domínio sobre os parâmetros térmicos deste cenário.</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-500" size={64} />
                      <h3 className="text-2xl font-black text-slate-900">Erro de Análise</h3>
                      <p className="text-slate-500 text-center">Revise a Lei do Resfriamento de Newton no Memorial Acadêmico.</p>
                    </>
                  )}
                  <Button onClick={generateChallenge} className="mt-4 bg-slate-900 text-white gap-2 px-8 h-12 rounded-xl">
                    <RefreshCcw size={18} /> Próximo Desafio
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingAcademy;