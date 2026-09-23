import React, { useState } from 'react';
import { Product } from '../types';
import { GarmentVisual } from './GarmentVisual';
import { X, Check, ShieldCheck, Ruler, Truck, Zap, Star } from 'lucide-react';
import { formatUYU } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL', quantity: number) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const [view, setView] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL'>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md sm:max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0a0b10] border-t sm:border border-blue-950 rounded-t-3xl sm:rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto my-3 sm:hidden" />

        {/* Close Button (Min 44x44 hitbox) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 active:scale-90 transition-transform"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Garment Visual Showcase */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[#07080c] flex flex-col justify-between border-b md:border-b-0 md:border-r border-blue-950/60">
          <div className="relative">
            {/* View Switcher Tabs */}
            {product.backImageUrl && (
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setView('front')}
                  className={`h-9 px-3 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    view === 'front'
                      ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(0,102,255,0.5)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Frente
                </button>
                <button
                  onClick={() => setView('back')}
                  className={`h-9 px-3 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    view === 'back'
                      ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(0,102,255,0.5)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Espalda
                </button>
              </div>
            )}

            <div className="rounded-xl overflow-hidden border border-slate-900">
              <GarmentVisual product={product} view={view} />
            </div>
          </div>

          {/* Quick Technical Fabric Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-900 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Gramaje Textil:</span>
              <span className="text-cyan-400 font-bold">{product.gsm ? `${product.gsm} GSM` : 'Heavy Spec'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Composición:</span>
              <span className="text-slate-200 text-right truncate max-w-[180px]">{product.composition}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Corte:</span>
              <span className="text-white font-semibold">{product.fitLabel}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category and Rating */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="text-blue-400 uppercase tracking-widest text-[11px]">{product.collectionLabel}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-white tabular-nums">{product.rating}</span>
                <span className="text-slate-500 text-[11px]">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-heading leading-tight">
              {product.name}
            </h2>

            {/* Price Module */}
            <div className="mt-2.5 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {formatUYU(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                  {formatUYU(product.originalPrice)}
                </span>
              )}
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                DROP OFICIAL
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Sizing Section */}
            <div className="mt-5 pt-4 border-t border-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Talla:
                </span>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Tabla de medidas gym
                </button>
              </div>

              {/* Sizes Row (Touch Target Friendly) */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-11 h-11 px-3 text-sm font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-blue-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,102,255,0.6)]'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {product.stockAlert && (
                <p className="mt-2 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>{product.stockAlert}</span>
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-400">Cantidad:</span>
              <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-bold text-white tabular-nums text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CTA Add to Cart Button */}
          <div className="mt-6 pt-4 border-t border-slate-900 space-y-2.5">
            <button
              onClick={handleAddToCart}
              className={`w-full h-13 rounded-xl font-heading font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(0,102,255,0.5)] border border-blue-400/40'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡AÑADIDO AL CARRITO!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>AÑADIR A LA BOLSA — {formatUYU(product.price * quantity)}</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 text-center">
              <div className="flex items-center justify-center gap-1 bg-slate-950 py-1.5 rounded border border-slate-900">
                <Truck className="w-3 h-3 text-blue-400" />
                <span>Envío express rastreado</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-slate-950 py-1.5 rounded border border-slate-900">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>Garantía de costuras</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

