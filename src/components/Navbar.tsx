import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSizeGuide: () => void;
  onScrollToCatalog: (category?: string) => void;
  onScrollToStory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSizeGuide,
  onScrollToCatalog,
  onScrollToStory,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050507]/95 backdrop-blur-md border-b border-blue-950/60">
      {/* Main Bar */}
      <div className="max-w-md md:max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Zone - ONLY ATOMIC PRIME in ONE SINGLE LINE, NO LOGO IMAGE */}
        <div className="flex items-center min-w-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group active:scale-95 transition-transform"
          >
            <span className="font-display text-2xl sm:text-3xl font-black tracking-wider text-white group-hover:text-cyan-400 whitespace-nowrap select-none drop-shadow-[0_0_12px_rgba(0,140,255,0.4)]">
              ATOMIC PRIME
            </span>
          </a>
        </div>

        {/* Desktop Links (Hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <button onClick={() => onScrollToCatalog('all')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Catálogo
          </button>
          <button onClick={() => onScrollToCatalog('camiseta_oversize')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Camiseta Oversize
          </button>
          <button onClick={() => onScrollToCatalog('camiseta')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Camiseta
          </button>
          <button onClick={() => onScrollToCatalog('musculosa')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Musculosa
          </button>
          <button onClick={() => onScrollToCatalog('bermuda')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Bermuda
          </button>
          <button onClick={() => onScrollToCatalog('pantalon')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Pantalón
          </button>
          <button onClick={onOpenSizeGuide} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Tallas
          </button>
        </nav>

        {/* Action Controls - Heart & Cart (No hamburger menu) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label={`Favoritos (${wishlistCount})`}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-300 hover:text-white active:scale-90 transition-transform relative cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-blue-500 text-blue-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            aria-label={`Bolsa (${cartCount})`}
            className="h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,102,255,0.5)] border border-blue-400/40 active:scale-95 transition-transform cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono text-xs font-bold tabular-nums">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
