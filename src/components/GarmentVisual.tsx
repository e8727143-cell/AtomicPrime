import React, { useState } from 'react';
import { Product } from '../types';
import { Shield, Sparkles } from 'lucide-react';

interface GarmentVisualProps {
  product: Product;
  view?: 'front' | 'back';
  className?: string;
}

export const GarmentVisual: React.FC<GarmentVisualProps> = ({
  product,
  view = 'front',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeImage =
    view === 'back' && product.backImageUrl ? product.backImageUrl : product.imageUrl;

  return (
    <div
      className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#0e1017] via-[#090a0f] to-[#06070a] flex items-center justify-center overflow-hidden select-none group-hover:scale-[1.02] transition-transform duration-300 ${className}`}
    >
      {/* Background radial athletic blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,119,255,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtle blueprint athletic grid */}
      <div className="absolute inset-0 bg-grid-gym opacity-30 pointer-events-none" />

      {/* Real Clothing Photograph */}
      {!imageError && activeImage ? (
        <>
          <img
            src={activeImage}
            alt={`${product.name} - ${view === 'back' ? 'Vista trasera' : 'Vista frontal'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-all duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Shimmer skeleton while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent animate-pulse" />
          )}

          {/* Ambient Dark Gradient Vignette for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c12] via-transparent to-transparent opacity-80 pointer-events-none" />
        </>
      ) : (
        /* Clean fallback if image cannot be reached */
        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,119,255,0.4)]">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            {product.name}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 mt-1 uppercase">
            {product.categoryLabel}
          </span>
        </div>
      )}

      {/* View Tag if in back mode */}
      {view === 'back' && product.backImageUrl && (
        <div className="absolute bottom-2 left-2 z-10">
          <span className="px-2 py-0.5 rounded bg-blue-600/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-md backdrop-blur-sm">
            VISTA ESPALDA
          </span>
        </div>
      )}

      {/* GSM specification badge if available */}
      {product.gsm && (
        <div className="absolute bottom-2 right-2 z-10 hidden sm:block">
          <span className="px-2 py-0.5 rounded bg-black/70 border border-slate-700 text-cyan-300 font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {product.gsm} GSM
          </span>
        </div>
      )}
    </div>
  );
};
