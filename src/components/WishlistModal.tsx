import React from 'react';
import { Product } from '../types';
import { X, Heart, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatUYU } from '../utils/currency';

interface WishlistModalProps {
  isOpen: boolean;
  wishlistProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL') => void;
  onRemoveFromWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  wishlistProducts,
  onClose,
  onAddToCart,
  onRemoveFromWishlist,
  onQuickView,
}) => {
  if (!isOpen) return null;

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
            <Heart className="w-5 h-5 fill-blue-500 text-blue-500" />
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase text-white">
              Favoritos ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors active:scale-90"
            aria-label="Cerrar favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0d0f17] border border-slate-900 gap-3"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  onClick={() => {
                    onClose();
                    onQuickView(product);
                  }}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#07080c] border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 shrink-0">
                    AP
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white truncate hover:text-cyan-300">
                      {product.name}
                    </h4>
                    <span className="text-xs font-mono text-cyan-400 font-bold block mt-0.5">
                      {formatUYU(product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onAddToCart(product, product.sizes[0])}
                    className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(product)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 transition-colors"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-slate-800 mx-auto mb-3" />
              <p className="font-heading text-base uppercase text-slate-300">Aún no tienes favoritos</p>
              <p className="text-xs text-slate-500 mt-1">
                Guarda las prendas que más te motiven para tu próximo ciclo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
