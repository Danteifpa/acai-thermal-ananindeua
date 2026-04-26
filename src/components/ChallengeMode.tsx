"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const ChallengeMode = () => {
  const [challenge, setChallenge] = useState({ volume: 15, target: 'Metal' });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const generateChallenge = () => {
    const volumes = [10, 20, 30, 40, 50];
    const materials = ['Metal', 'Plástico'];
    setChallenge({
      volume: volumes[Math.floor(Math.random() * volumes.length)],
      target: materials[Math.floor(Math.random() * materials.length)]
    });
    setFeedback('none');
  };

  const checkAnswer = (isSafe: boolean) => {
    // Simple logic for the game: Metal is usually safer for larger volumes
    const correct = challenge.volume <= 25 || challenge.target === 'Metal';
    if (correct === isSafe) {
      setScore(s => s + 10);
      setFeedback('correct');
      showSuccess("Cálculo Mental Correto!");
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy size={20} />
          <h3 className="font-black uppercase tracking-wider text-sm">Desafio BCT</h3>
        </div>
        <div className="text-white font-mono font-bold">Score: {score}</div>
      </div>

      <div className="bg-slate-950 rounded-xl p-6 text-center space-y-4 border border-slate-800">
        <p className="text-slate-400 text-xs uppercase font-bold">Cenário Experimental</p>
        <div className="text-2xl font-black text-white">
          {challenge.volume}L em {challenge.target}
        </div>
        <p className="text-sm text-slate-500">Este processo será seguro após 10 min?</p>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={() => checkAnswer(true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl"
        >
          Sim, Seguro
        </Button>
        <Button 
          onClick={() => checkAnswer(false)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl"
        >
          Não, Risco
        </Button>
      </div>

      {feedback !== 'none' && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {feedback === 'correct' ? <CheckCircle2 className="text-green-500 mb-2" size={48} /> : <XCircle className="text-red-500 mb-2" size={48} />}
          <Button onClick={generateChallenge} variant="outline" className="bg-slate-900 border-slate-700 text-white gap-2">
            <RefreshCcw size={16} /> Próximo Desafio
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ChallengeMode;