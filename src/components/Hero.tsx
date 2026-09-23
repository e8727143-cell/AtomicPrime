import React from 'react';
import { ArrowDown, Flame, Shield } from 'lucide-react';
import { ConstantHeroLightning } from './ConstantHeroLightning';
import { HeroModelBanner } from './HeroModelBanner';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSelectCategory }) => {
  const logoUrl = 'https://res.cloudinary.com/nudnxkcm/image/upload/v1790120429/Logo_atomic_prime.png';

  const handleBannerSelect = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      onExploreClick();
    }
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-[#050507] border-b border-blue-950/60 px-4 py-8 sm:py-12">
      {/* 1. INTERMITTENT PROCEDURAL LIGHTNING IN HERO */}
      <ConstantHeroLightning />

      {/* Atmospheric dark radial gradient & vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(0,119,255,0.2)_0%,rgba(5,5,7,0.85)_75%,#050507_100%)] pointer-events-none z-0" />

      {/* High-tech power gym grid texture */}
      <div className="absolute inset-0 bg-grid-gym opacity-30 pointer-events-none z-0" />

      {/* Hero Content - Optimized for 9:16 Vertical Smartphone Viewport */}
      <div className="relative z-20 w-full max-w-md md:max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Official Brand Logo Placed Directly Above Headline */}
        <div className="mb-3 relative group">
          <div className="absolute -inset-4 rounded-full bg-cyan-400/25 blur-xl animate-pulse pointer-events-none" />
          <img
            src={logoUrl}
            alt="ATOMIC PRIME Logo"
            className="h-20 sm:h-24 w-auto object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(0,180,255,0.8)]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dominant Headline: ESTILO HARDCORE */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-[0.95] text-white select-none">
          ESTILO{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-white drop-shadow-[0_0_22px_rgba(0,180,255,0.7)]">
            HARDCORE
          </span>
        </h1>

        {/* 2. HERO MODEL BANNER SHOWCASING STORE APPAREL (CLEAN, NO TEXT OVERLAY, ONLY MALE ATHLETES) */}
        <HeroModelBanner onSelectCategory={handleBannerSelect} />

        {/* Primary Clean Action Button - Smoothly scroll to vertical sections */}
        <div className="mt-6 flex w-full max-w-xs sm:max-w-sm justify-center">
          <button
            onClick={onExploreClick}
            className="w-full h-12 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-[0_0_25px_rgba(0,120,255,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-cyan-400/40 cursor-pointer"
          >
            <span>EXPLORAR COLECCIONES</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

        {/* Quick Category Mini-Grid: Direct Shortcuts to each of the 5 Categories */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2 w-full max-w-xs sm:max-w-xl text-center">
          <button
            type="button"
            onClick={() => handleBannerSelect('camiseta_oversize')}
            className="p-2 rounded-lg bg-slate-950/90 border border-blue-950 hover:border-cyan-500/50 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <span className="text-[9px] font-mono text-cyan-400 uppercase block truncate">01</span>
            <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-300 truncate block">Oversize</span>
          </button>

          <button
            type="button"
            onClick={() => handleBannerSelect('musculosa')}
            className="p-2 rounded-lg bg-slate-950/90 border border-blue-950 hover:border-cyan-500/50 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <span className="text-[9px] font-mono text-cyan-400 uppercase block truncate">02</span>
            <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-300 truncate block">Musculosas</span>
          </button>

          <button
            type="button"
            onClick={() => handleBannerSelect('camiseta')}
            className="p-2 rounded-lg bg-slate-950/90 border border-blue-950 hover:border-cyan-500/50 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <span className="text-[9px] font-mono text-blue-400 uppercase block truncate">03</span>
            <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-300 truncate block">Camisetas</span>
          </button>

          <button
            type="button"
            onClick={() => handleBannerSelect('bermuda')}
            className="p-2 rounded-lg bg-slate-950/90 border border-blue-950 hover:border-cyan-500/50 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <span className="text-[9px] font-mono text-blue-400 uppercase block truncate">04</span>
            <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-300 truncate block">Bermudas</span>
          </button>

          <button
            type="button"
            onClick={() => handleBannerSelect('pantalon')}
            className="p-2 rounded-lg bg-slate-950/90 border border-blue-950 hover:border-cyan-500/50 cursor-pointer transition-all active:scale-95 text-center col-span-2 sm:col-span-1 group"
          >
            <span className="text-[9px] font-mono text-slate-400 uppercase block truncate">05</span>
            <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-300 truncate block">Pantalones</span>
          </button>
        </div>
      </div>
    </section>
  );
};
