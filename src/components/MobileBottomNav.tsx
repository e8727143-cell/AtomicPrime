import React from 'react';
import { Zap, Grid, Ruler, ShoppingBag } from 'lucide-react';
import { formatUYU } from '../utils/currency';

interface MobileBottomNavProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onScrollToTop: () => void;
  onScrollToCatalog: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenSizeGuide,
  onScrollToTop,
  onScrollToCatalog,
}) => {
  return (
    <nav
      aria-label="Navegación Móvil Rápida"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#08090f]/95 backdrop-blur-lg border-t border-blue-950/80 px-2 py-1.5 lg:hidden safe-area-bottom shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-13">
        {/* Tab 1: Inicio */}
        <button
          onClick={onScrollToTop}
          className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-cyan-400 active:scale-95 transition-all"
        >
          <Zap className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span className="text-[10px] font-mono font-bold tracking-tight uppercase">Inicio</span>
        </button>

        {/* Tab 2: Catálogo */}
        <button
          onClick={onScrollToCatalog}
          className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-white active:scale-95 transition-all"
        >
          <Grid className="w-5 h-5 mb-0.5 text-blue-400" />
          <span className="text-[10px] font-mono font-bold tracking-tight uppercase">Catálogo</span>
        </button>

        {/* Tab 3: Tallas Gym */}
        <button
          onClick={onOpenSizeGuide}
          className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-white active:scale-95 transition-all"
        >
          <Ruler className="w-5 h-5 mb-0.5 text-slate-300" />
          <span className="text-[10px] font-mono font-bold tracking-tight uppercase">Tallas Gym</span>
        </button>

        {/* Tab 4: Bolsa con Badge y Monto */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center h-full text-white active:scale-95 transition-all relative"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,102,255,0.7)] border border-cyan-400/50">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-blue-900 text-[9px] font-mono font-black flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono font-bold tracking-tight text-cyan-300 mt-0.5 tabular-nums">
            {cartCount > 0 ? formatUYU(cartTotal) : 'Bolsa'}
          </span>
        </button>
      </div>
    </nav>
  );
};
