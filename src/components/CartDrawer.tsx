import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { formatUYU, FREE_SHIPPING_THRESHOLD_UYU, STANDARD_SHIPPING_FEE_UYU } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, size: string, quantity: number) => void;
  onRemoveItem: (id: string, size: string) => void;
  onProceedCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = FREE_SHIPPING_THRESHOLD_UYU;
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Generate WhatsApp Order Link in Uruguayan Pesos
  const handleWhatsAppOrder = () => {
    const itemsText = cartItems
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.name}* | Talla: ${item.selectedSize} | Cant: ${item.quantity} | ${formatUYU(
            item.product.price * item.quantity
          )}`
      )
      .join('%0A');

    const totalText = `%0A%0A*TOTAL PEDIDO:* ${formatUYU(subtotal)}`;
    const message = `¡Hola ATOMIC PRIME! Quiero tramitar mi pedido oficial:%0A%0A${itemsText}${totalText}%0A%0A¿Podrían confirmarme los métodos de pago y despacho en Uruguay?`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#0a0b10] border-l border-blue-950 flex flex-col justify-between shadow-2xl text-left animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase text-white tracking-wider">
              Bolsa de Entrenamiento ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors active:scale-90"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Dynamic Progress */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#0d0f17] border-b border-blue-950/60">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            {remainingForFreeShipping > 0 ? (
              <span className="text-slate-300 text-[11px]">
                Faltan <strong className="text-cyan-400 font-bold">{formatUYU(remainingForFreeShipping)}</strong> para <strong className="text-white">ENVÍO GRATIS</strong>
              </span>
            ) : (
              <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                ¡ENVÍO GRATIS DESBLOQUEADO!
              </span>
            )}
            <span className="text-slate-400 text-[10px]">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0e1017] border border-slate-900"
              >
                {/* Thumbnail Box */}
                <div className="w-14 h-14 rounded-lg bg-[#07080c] border border-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden font-mono text-cyan-400 text-xs font-bold">
                  AP
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-cyan-400 font-bold text-[10px]">
                      Talla: {item.selectedSize}
                    </span>
                    <span className="text-[11px]">{formatUYU(item.product.price)}</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-slate-800 rounded-lg bg-[#090a0f]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Item Price */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-white text-xs sm:text-sm tabular-nums">
                    {formatUYU(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="font-heading text-base uppercase text-slate-300">Tu bolsa está vacía</p>
              <p className="text-xs text-slate-500 mt-1">El hierro te está esperando en la tarima.</p>
              <button
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
                className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary (Sticky Bottom in Natural Thumb Zone) */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 bg-[#07080c] border-t border-blue-950 space-y-3 pb-8 sm:pb-6">
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white font-bold tabular-nums">{formatUYU(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Envío a todo Uruguay:</span>
                <span className="text-cyan-400 font-bold">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? 'GRATIS' : formatUYU(STANDARD_SHIPPING_FEE_UYU)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-slate-900">
                <span>Total Estimado:</span>
                <span className="text-cyan-300 font-mono tabular-nums text-base">
                  {formatUYU(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE_UYU))}
                </span>
              </div>
            </div>

            {/* Direct Checkout Button */}
            <button
              onClick={onProceedCheckout}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.5)] border border-blue-400/40 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>TRAMITAR PEDIDO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* WhatsApp Quick Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full h-11 rounded-xl bg-[#0f1d19] hover:bg-[#132c25] text-emerald-400 border border-emerald-800/60 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>PEDIR POR WHATSAPP</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Garantía oficial ATOMIC PRIME · Pago seguro</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

