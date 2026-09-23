import React, { useState } from 'react';
import { Product } from '../types';
import { GarmentVisual } from './GarmentVisual';
import { Eye, Heart, Plus, RotateCw, Check } from 'lucide-react';
import { formatUYU } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL') => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL'>(product.sizes[0]);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const handleToggleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView(v => (v === 'front' ? 'back' : 'front'));
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleSelectSize = (e: React.MouseEvent, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL') => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <article
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-[#0b0c12] rounded-2xl border border-slate-900/90 hover:border-blue-600/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,102,255,0.15)] active:scale-[0.99] cursor-pointer overflow-hidden"
    >
      {/* Visual Area */}
      <div className="relative w-full overflow-hidden bg-[#07080c]">
        {/* Subtle tag indicator if bestseller or new */}
        {product.isBestseller && (
          <span className="absolute top-3 left-3 z-10 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-blue-950/90 px-2 py-0.5 rounded border border-cyan-700/60">
            BESTSELLER
          </span>
        )}
        {product.isNew && !product.isBestseller && (
          <span className="absolute top-3 left-3 z-10 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-950/90 px-2 py-0.5 rounded border border-blue-700/60">
            NUEVO DROP
          </span>
        )}

        {/* Wishlist Button (Min 44x44 hitbox) */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className="absolute top-2.5 right-2.5 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white transition-colors border border-slate-800 backdrop-blur-sm active:scale-90"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-blue-500 text-blue-500' : ''}`} />
        </button>

        {/* Rotate Front / Back Button */}
        {product.backImageUrl && (
          <button
            onClick={handleToggleView}
            title="Girar vista frontal / trasera"
            className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-blue-950 text-cyan-400 text-xs font-mono flex items-center gap-1.5 border border-blue-900/60 backdrop-blur-sm transition-all active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold">{view === 'front' ? 'Espalda' : 'Frente'}</span>
          </button>
        )}

        {/* Main Garment Visual */}
        <GarmentVisual product={product} view={view} />
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
            <span className="text-[11px] truncate">{product.categoryLabel}</span>
            <span className="text-cyan-400 font-semibold text-[11px]">{product.fitLabel}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-heading text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Size Selector Quick Bar (Thumb Friendly) */}
        <div className="mt-3.5 pt-3 border-t border-slate-900/90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Talla:</span>
            {product.stockAlert && (
              <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[140px]">{product.stockAlert}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleSelectSize(e, sz)}
                className={`min-w-8 h-8 px-2 text-xs font-mono font-bold rounded-lg flex items-center justify-center transition-all ${
                  selectedSize === sz
                    ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(0,102,255,0.6)]'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-900/90 gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                {formatUYU(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                  {formatUYU(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-cyan-400/90 font-mono">Envío gratis &gt; $U 3.000</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Detalle"
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors active:scale-90"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleQuickAdd}
              className={`h-10 px-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>LISTO</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>AÑADIR</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

