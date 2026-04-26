"use client";

import React from 'react';

const ThermalChart = () => {
  return (
    <div className="h-[300px] w-full bg-slate-900/50 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
        <div className="w-8 h-8 border-t-2 border-purple-500 rounded-full animate-spin" />
      </div>
      <h3 className="text-white font-bold mb-2">Visualização de Curva Térmica</h3>
      <p className="text-slate-500 text-sm max-w-xs">
        O motor gráfico está em modo de economia de recursos para garantir a estabilidade da apresentação.
      </p>
    </div>
  );
};

export default ThermalChart;