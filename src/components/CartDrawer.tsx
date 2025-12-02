import { useState } from "react";
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, CheckCircle } from "lucide-react";
import { useCart } from "../lib/cart-context";

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, toggleCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [processing, setProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
        setProcessing(false);
        setCheckoutStep('checkout');
    }, 500);
  };

  const handlePayment = () => {
      setProcessing(true);
      setTimeout(() => {
          setProcessing(false);
          setCheckoutStep('success');
      }, 2000);
  };

  const closeDrawer = () => {
      toggleCart();
      setTimeout(() => setCheckoutStep('cart'), 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDrawer}></div>

      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-[#FFB800]/20 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#050505]">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="text-[#FFB800]" /> 
            {checkoutStep === 'cart' && 'TU PEDIDO'}
            {checkoutStep === 'checkout' && 'PAGO SEGURO'}
            {checkoutStep === 'success' && 'PEDIDO CONFIRMADO'}
          </h2>
          <button onClick={closeDrawer} className="text-gray-500 hover:text-white">
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
                items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <ShoppingBag size={48} className="opacity-20" />
                        <p>Tu carrito está vacío.</p>
                        <button onClick={closeDrawer} className="text-[#FFB800] text-sm font-bold hover:underline">Ver Menú</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.cartId} className="bg-[#111] p-4 rounded-xl border border-white/5 flex gap-4">
                                {/* Simple Placeholder for Item Image if not available, or rely on name */}
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.baseType} • {item.profile}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center bg-black rounded border border-white/10">
                                            <button onClick={() => updateQuantity(item.cartId, -1)} className="px-2 py-1 text-gray-400 hover:text-white">-</button>
                                            <span className="text-xs text-white w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartId, 1)} className="px-2 py-1 text-gray-400 hover:text-white">+</button>
                                        </div>
                                        <span className="text-[#FFB800] font-mono text-sm">${item.price * item.quantity}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-gray-600 hover:text-red-500 self-start">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* STEP 2: PAYMENT */}
            {checkoutStep === 'checkout' && (
                <div className="space-y-6">
                    <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 p-4 rounded-xl">
                        <h3 className="text-[#FFB800] font-bold text-sm mb-2">Resumen de cobro</h3>
                        <div className="flex justify-between text-gray-400 text-sm mb-1"><span>Subtotal</span><span>${cartTotal}</span></div>
                        <div className="flex justify-between text-gray-400 text-sm mb-1"><span>IVA (16%)</span><span>${(cartTotal * 0.16).toFixed(2)}</span></div>
                        <div className="flex justify-between text-white font-bold text-lg mt-2 pt-2 border-t border-[#FFB800]/20">
                            <span>Total</span>
                            <span>${(cartTotal * 1.16).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Método de Pago</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 bg-[#151515] border border-[#FFB800] rounded-lg flex flex-col items-center gap-2 text-[#FFB800]">
                                <CreditCard size={20} />
                                <span className="text-xs font-bold">Tarjeta</span>
                            </button>
                            <button className="p-3 bg-[#151515] border border-white/10 rounded-lg flex flex-col items-center gap-2 text-gray-400 hover:border-white">
                                <span className="font-black">$</span>
                                <span className="text-xs font-bold">Efectivo</span>
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            <input placeholder="Número de Tarjeta" className="w-full bg-black border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-[#FFB800]" />
                            <div className="grid grid-cols-2 gap-2">
                                <input placeholder="MM/YY" className="bg-black border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-[#FFB800]" />
                                <input placeholder="CVC" className="bg-black border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-[#FFB800]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: SUCCESS */}
            {checkoutStep === 'success' && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 border border-green-500/50">
                        <CheckCircle size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white">¡Pago Exitoso!</h3>
                        <p className="text-gray-400 text-sm mt-2">Tu orden #{Math.floor(Math.random() * 10000)} se está preparando.</p>
                    </div>
                    <div className="bg-[#111] p-4 rounded-xl border border-white/10 w-full">
                        <p className="text-xs text-gray-500 uppercase">Tiempo estimado</p>
                        <p className="text-[#FFB800] font-bold text-xl">15 - 20 min</p>
                    </div>
                    <button onClick={closeDrawer} className="text-white underline text-sm">Cerrar</button>
                </div>
            )}

        </div>

        {/* FOOTER ACTIONS */}
        {checkoutStep !== 'success' && items.length > 0 && (
             <div className="p-6 border-t border-white/10 bg-[#050505]">
                {checkoutStep === 'cart' ? (
                    <button 
                        onClick={handleCheckout}
                        disabled={processing}
                        className="w-full bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                        {processing ? 'Procesando...' : `Pagar $${cartTotal}`} <ArrowRight size={18} />
                    </button>
                ) : (
                    <button 
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors"
                    >
                        {processing ? 'Autorizando...' : 'Confirmar Pago'}
                    </button>
                )}
             </div>
        )}

      </div>
    </div>
  );
}
