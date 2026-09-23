import React, { useState } from 'react';
import { X, Ruler, Sparkles, Dumbbell, Zap } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [weightKg, setWeightKg] = useState<number>(85);
  const [heightCm, setHeightCm] = useState<number>(180);
  const [preferredFit, setPreferredFit] = useState<'oversized' | 'fitted'>('oversized');

  // Athletic Bodybuilding Size Estimator Formula
  const calculateRecommendedSize = (): { size: string; note: string } => {
    const ratio = weightKg / (heightCm / 100);
    if (preferredFit === 'oversized') {
      if (ratio < 44) return { size: 'S', note: 'Caída relajada para físico liviano.' };
      if (ratio < 49) return { size: 'M', note: 'Ajuste óptimo en hombro y pecho, torso holgado.' };
      if (ratio < 55) return { size: 'L', note: 'Recomendada para culturistas de 80-92kg.' };
      if (ratio < 62) return { size: 'XL', note: 'Espalda amplia, sin apretar deltoides ni dorsales.' };
      if (ratio < 70) return { size: 'XXL', note: 'Corte titán para físicos masivos.' };
      return { size: '3XL', note: 'Corte Open Heavyweight sin restricciones de movimiento.' };
    } else {
      if (ratio < 44) return { size: 'XS', note: 'Ceñido al cuerpo.' };
      if (ratio < 49) return { size: 'S', note: 'Marca hombros y bíceps.' };
      if (ratio < 55) return { size: 'M', note: 'Ceñido atlético.' };
      if (ratio < 62) return { size: 'L', note: 'Tapered ajustado en cintura.' };
      return { size: 'XL', note: 'Ajuste ceñido para atletas pesados.' };
    }
  };

  const rec = calculateRecommendedSize();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md sm:max-w-2xl bg-[#0a0b10] border-t sm:border border-blue-950 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-left max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto my-3 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-900 flex items-center justify-between bg-[#08090d]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">FIT ENGINEERING</span>
              <h2 className="font-heading text-lg sm:text-xl font-bold uppercase text-white">
                Calculadora de Tallas Gym
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors active:scale-90"
            aria-label="Cerrar tabla de tallas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* Interactive Estimator */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0f1422] to-[#0a0d17] border border-blue-900/80 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AJUSTE PERSONALIZADO SEGÚN FÍSICO</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Peso: <strong className="text-white">{weightKg} kg</strong>
                </label>
                <input
                  type="range"
                  min="60"
                  max="135"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Estatura: <strong className="text-white">{heightCm} cm</strong>
                </label>
                <input
                  type="range"
                  min="160"
                  max="205"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-mono text-slate-400 block mb-2">Preferencia:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredFit('oversized')}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-all ${
                    preferredFit === 'oversized'
                      ? 'bg-blue-600 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,102,255,0.6)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Boxy Oversized (Suelto)
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredFit('fitted')}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-all ${
                    preferredFit === 'fitted'
                      ? 'bg-blue-600 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,102,255,0.6)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Tapered (Al Cuerpo)
                </button>
              </div>
            </div>

            {/* Recommendation Result */}
            <div className="mt-5 p-3.5 rounded-xl bg-blue-950/80 border border-cyan-500/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block">
                  Talla Sugerida
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {rec.note}
                </span>
              </div>
              <div className="w-13 h-13 rounded-xl bg-blue-600 border border-cyan-300 flex items-center justify-center font-display text-2xl font-bold text-white shadow-[0_0_20px_rgba(0,102,255,0.8)]">
                {rec.size}
              </div>
            </div>
          </div>

          {/* Reference Table */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 mb-2.5">
              <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
              <span>Medidas Textiles Oficiales (cm)</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-900">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-[#0e111a] text-cyan-400">
                  <tr>
                    <th className="p-2.5">Talla</th>
                    <th className="p-2.5">Pecho</th>
                    <th className="p-2.5">Hombro</th>
                    <th className="p-2.5">Largo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-[#07090e] text-slate-300">
                  {['S', 'M', 'L', 'XL', 'XXL', '3XL'].map((s) => (
                    <tr key={s} className={rec.size === s ? 'bg-blue-950/40 text-cyan-300 font-bold' : ''}>
                      <td className="p-2.5 font-bold">{s}</td>
                      <td className="p-2.5">{s === 'S' ? 110 : s === 'M' ? 116 : s === 'L' ? 122 : s === 'XL' ? 128 : s === 'XXL' ? 134 : 140} cm</td>
                      <td className="p-2.5">{s === 'S' ? 54 : s === 'M' ? 56 : s === 'L' ? 58 : s === 'XL' ? 60 : s === 'XXL' ? 62 : 64} cm</td>
                      <td className="p-2.5">{s === 'S' ? 72 : s === 'M' ? 74 : s === 'L' ? 76 : s === 'XL' ? 78 : s === 'XXL' ? 80 : 82} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
