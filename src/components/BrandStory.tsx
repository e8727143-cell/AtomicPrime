import React from 'react';
import { ShieldCheck, Dumbbell, Zap, Flame } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const proofMetrics = [
    { value: '320+', label: 'GSM Gramaje Pesado', note: 'Mayor resistencia textil' },
    { value: '+600kg', label: 'Tensión Máxima Straps', note: 'Peso muerto pesado' },
    { value: '10mm', label: 'Grosor Cuero Palanca', note: 'Rigidez intra-abdominal IPF' },
    { value: '0%', label: 'Deformación de Cuello', note: 'Canalé reforzado' },
  ];

  return (
    <section id="filosofia" className="py-14 sm:py-20 bg-[#06070a] border-t border-blue-950/60 relative overflow-hidden px-4">
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(0,102,255,0.12)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-gym opacity-25 pointer-events-none" />

      <div className="max-w-md md:max-w-7xl mx-auto relative z-10 text-center">
        {/* Section Title */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 mb-2">
            <Zap className="w-3.5 h-3.5 fill-cyan-400" />
            <span>EL ESTÁNDAR ATOMIC PRIME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            ROPA DISEÑADA PARA QUIENES <span className="text-blue-500">MUEVEN HIERRO REAL</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed text-wrap-balance">
            Nacimos cansados de las marcas que venden telas frágiles que se desgastan y camisetas con cuellos que se deforman al tercer lavado.
          </p>
        </div>

        {/* Quantitative Proof Grid (2x2 on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-12">
          {proofMetrics.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-5 rounded-2xl bg-[#0a0d16] border border-blue-950/80 text-left hover:border-cyan-500/50 transition-colors"
            >
              <span className="font-mono text-2xl sm:text-3xl font-black text-cyan-300 tracking-tight block">
                {item.value}
              </span>
              <span className="font-heading font-bold text-xs sm:text-sm text-white uppercase block mt-1">
                {item.label}
              </span>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{item.note}</p>
            </div>
          ))}
        </div>

        {/* Brand Pillars: Heavyweight, Cut, Durability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-[#090b12] border border-slate-900 hover:border-blue-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700 flex items-center justify-center text-cyan-400 mb-3">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-white uppercase">
              1. Gramaje Heavyweight 320+ GSM
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              No usamos telas translúcidas. El algodón peinado de 320 GSM confiere estructura pesada, absorción de sudor sin pegarse a la piel y durabilidad brutal.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090b12] border border-slate-900 hover:border-blue-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700 flex items-center justify-center text-cyan-400 mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-white uppercase">
              2. Corte V-Taper Culturista
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Patronaje optimizado para atletas con espalda ancha, deltoides desarrollados y cintura ceñida. El hombro caído estiliza la silueta con estética imponente.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090b12] border border-slate-900 hover:border-blue-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700 flex items-center justify-center text-cyan-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-white uppercase">
              3. Resistencia a Barras Moleteadas
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              El moleteado agresivo de las barras de sentadilla y banca destruye telas comunes. Doble pespunte de refuerzo en trapecios y hombros para aguantar la fricción.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
