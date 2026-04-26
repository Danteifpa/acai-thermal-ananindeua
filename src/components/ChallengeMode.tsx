"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const ChallengeMode = () => {
  const [challenge, setChallenge] = useState({ volume: 15, material: 'Plástico' });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const generateChallenge = () => {
    const volumes = [10, 15, 20, 25, 30, 40, 50];
    const materials = ['Metal', 'Plástico'];
    setChallenge({
      volume: volumes[Math.floor(Math.random() * volumes.length)],
      material: materials[Math.floor(Math.random() * materials.length)]
    });
    setFeedback('none');
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const checkAnswer = (userGuessSafe: boolean) => {
    const T0 = 80;
    const TENV = 25;
    const cp = challenge.material === 'Metal' ? 0.50 : 2.30;
    const baseK = challenge.material === 'Metal' ? 0.004 : 0.0015;
    const k = baseK / (cp * Math.pow(challenge.volume, 0.2));
    const finalTemp = TENV + (T0 - TENV) * Math.exp(-k * 600);
    const isActuallySafe = finalTemp >= 52.5;

    if (userGuessSafe === isActuallySafe) {
      setScore(s => s + 10);
      setFeedback('correct');
      showSuccess("Cálculo Mental Correto!");
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4 relative overflow-hidden shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy size={16} />
          <h3 className="font-black uppercase tracking-wider text-[10px]">Desafio BCT</h3>
        </div>
        <div className="text-amber-400 font-mono font-bold text-xs">Score: {score}</div>
      </div>

      <div className="bg-slate-900 rounded-lg p-3 text-center space-y-2 border border-slate-700">
        <p className="text-slate-500 text-[9px] uppercase font-bold">Cenário Experimental</p>
        <div className="text-sm font-black text-white">
          {challenge.volume}L em {challenge.material}
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">Seguro após 10 min?</p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => checkAnswer(true)}
          className="flex-1 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/30 text-[10px] font-bold py-2 rounded-lg transition-all"
        >
          Sim
        </button>
        <button 
          onClick={() => checkAnswer(false)}
          className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 text-[10px] font-bold py-2 rounded-lg transition-all"
        >
          Não
        </button>
      </div>

      {feedback !== 'none' && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {feedback === 'correct' ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="text-green-400" size={32} />
              <span className="text-[10px] font-black text-green-400 uppercase">Acertou!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <XCircle className="text-red-400" size={32} />
              <span className="text-[10px] font-black text-red-400 uppercase">Errou!</span>
            </div>
          )}
          <button 
            onClick={generateChallenge}
            className="mt-2 bg-slate-900 border border-slate-700 text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChallengeMode;