import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight } from 'lucide-react';
import { formatUYU, FREE_SHIPPING_THRESHOLD_UYU, STANDARD_SHIPPING_FEE_UYU } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  onClose,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card' as 'card' | 'cod' | 'transfer',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    total: number;
    itemsCount: number;
  } | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_UYU ? 0 : STANDARD_SHIPPING_FEE_UYU;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Por favor completa todos los campos requeridos para el despacho.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `AP-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrder({
        orderId: generatedId,
        total,
        itemsCount: cartItems.reduce((a, b) => a + b.quantity, 0),
      });
      onClearCart();
    }, 1200);
  };

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
          <div>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">CHECKOUT OFICIAL</span>
            <h2 className="font-heading text-lg sm:text-2xl font-bold uppercase text-white">
              {confirmedOrder ? '¡PEDIDO CONFIRMADO!' : 'FINALIZAR PEDIDO'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors active:scale-90"
            aria-label="Cerrar checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-blue-950 border border-cyan-400/80 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-slate-400">NÚMERO DE ORDEN</span>
              <h3 className="font-display text-3xl sm:text-4xl text-cyan-300 font-extrabold tracking-wider mt-0.5">
                #{confirmedOrder.orderId}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto">
                Hemos recibido tu orden. Confirmación enviada a <strong className="text-white">{formData.email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-900 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Atleta:</span>
                <span className="text-white font-bold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dirección:</span>
                <span className="text-white truncate max-w-[200px]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">Total:</span>
                <span className="text-cyan-300 font-mono text-sm">{formatUYU(confirmedOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,102,255,0.5)] cursor-pointer"
            >
              VOLVER AL CATÁLOGO
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">
            {/* Step 1: Customer Contact & Shipping */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                1. Datos de Despacho
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Marcus Stone"
                    className="w-full h-11 px-3 bg-[#0e1017] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="atleta@atomicprime.com"
                    className="w-full h-11 px-3 bg-[#0e1017] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+598 99 123 456"
                    className="w-full h-11 px-3 bg-[#0e1017] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Ciudad / Departamento *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej. Montevideo, Maldonado, Canelones..."
                    className="w-full h-11 px-3 bg-[#0e1017] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Dirección de Entrega *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, número, piso"
                    className="w-full h-11 px-3 bg-[#0e1017] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="pt-3 border-t border-slate-900">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                2. Método de Pago
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <label
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'bg-blue-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]'
                      : 'bg-[#0e1017] border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className="sr-only"
                  />
                  <CreditCard className="w-4 h-4 mb-1 text-cyan-400" />
                  <span className="text-[10px] font-heading font-bold uppercase">Tarjeta</span>
                </label>

                <label
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-blue-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]'
                      : 'bg-[#0e1017] border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="sr-only"
                  />
                  <Banknote className="w-4 h-4 mb-1 text-emerald-400" />
                  <span className="text-[10px] font-heading font-bold uppercase">Contraentrega</span>
                </label>

                <label
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    formData.paymentMethod === 'transfer'
                      ? 'bg-blue-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]'
                      : 'bg-[#0e1017] border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
                    className="sr-only"
                  />
                  <ShieldCheck className="w-4 h-4 mb-1 text-blue-400" />
                  <span className="text-[10px] font-heading font-bold uppercase">Transferencia</span>
                </label>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-3 border-t border-slate-900 flex flex-col gap-2">
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold tabular-nums">{formatUYU(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Envío a todo Uruguay:</span>
                  <span className="text-cyan-400 font-bold">
                    {shipping === 0 ? 'GRATIS' : formatUYU(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">Total a Pagar:</span>
                <div className="text-2xl font-mono font-bold text-cyan-300 tabular-nums">
                  {formatUYU(total)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,102,255,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>PROCESANDO...</span>
                ) : (
                  <>
                    <span>CONFIRMAR Y FINALIZAR</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

