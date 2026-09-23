import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModelSlide {
  id: string;
  category: string;
  imageUrl: string;
}

const MODEL_SLIDES: ModelSlide[] = [
  {
    id: 'm1',
    category: 'camiseta_oversize',
    // Muscular male athlete wearing heavyweight black athletic tee in gym
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm2',
    category: 'musculosa',
    // Muscular male athlete in gym with barbell and exposed muscle
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm3',
    category: 'bermuda',
    // Male athlete wearing black athletic gym shorts
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm4',
    category: 'pantalon',
    // Male athlete wearing tapered athletic cargo sweatpants
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=80',
  },
];

interface HeroModelBannerProps {
  onSelectCategory: (category: string) => void;
}

export const HeroModelBanner: React.FC<HeroModelBannerProps> = ({ onSelectCategory }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % MODEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeSlide = MODEL_SLIDES[currentIdx];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % MODEL_SLIDES.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + MODEL_SLIDES.length) % MODEL_SLIDES.length);
  };

  return (
    <div
      className="relative w-full max-w-md md:max-w-4xl mx-auto mt-6 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#0a0d16] shadow-[0_0_30px_rgba(0,102,255,0.25)] cursor-pointer group"
      onClick={() => onSelectCategory(activeSlide.category)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Main Banner Visual Frame - Completely Pure & Clean without text overlays */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden">
        {/* Background Image of Male Athletic Model / Apparel */}
        <img
          src={activeSlide.imageUrl}
          alt="Atomic Prime Male Athlete Apparel"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-all duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/40 via-transparent to-[#050507]/20 pointer-events-none" />

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {MODEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(idx);
                }}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  idx === currentIdx ? 'w-5 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Minimal Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-blue-900/60 text-white flex items-center justify-center hover:bg-blue-600 hover:border-cyan-400 transition-colors backdrop-blur-md cursor-pointer z-20 active:scale-90 opacity-80 hover:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-blue-900/60 text-white flex items-center justify-center hover:bg-blue-600 hover:border-cyan-400 transition-colors backdrop-blur-md cursor-pointer z-20 active:scale-90 opacity-80 hover:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
