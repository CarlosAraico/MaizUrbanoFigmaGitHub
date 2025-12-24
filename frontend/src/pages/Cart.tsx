import React from "react";
import { useCart } from "../store/cart";
import { mxn } from "../lib/money";

export default function Cart() {
  const { items, subtotal, inc, dec, remove, clear } = useCart();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Carrito</h1>
          <p className="text-base-600 mt-2 text-sm">Ajusta cantidades y continúa a checkout.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-base-100 border border-base-200" onClick={clear}>
          Vaciar
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-6 rounded-2xl bg-base-50 border border-base-200">
          <p className="text-base-600">Carrito vacío. Ve al menú y agrega algo rico.</p>
          <a className="inline-block mt-4 px-4 py-2 rounded-xl bg-white text-black" href="/menu">
            Ir al Menú
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="p-5 rounded-2xl bg-base-50 border border-base-200 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-base-600">{mxn(it.price)} c/u</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl bg-base-100 border border-base-200" onClick={() => dec(it.id)}>
                    -
                  </button>
                  <div className="w-10 text-center font-mono">{it.qty}</div>
                  <button className="px-3 py-2 rounded-xl bg-base-100 border border-base-200" onClick={() => inc(it.id)}>
                    +
                  </button>
                </div>
                <div className="w-28 text-right font-mono">{mxn(it.price * it.qty)}</div>
                <button className="px-3 py-2 rounded-xl bg-base-100 border border-base-200" onClick={() => remove(it.id)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <aside className="p-6 rounded-2xl bg-base-50 border border-base-200 h-fit">
            <div className="text-sm text-base-600">Subtotal</div>
            <div className="text-2xl font-semibold mt-1">{mxn(subtotal)}</div>
            <a className="mt-4 block text-center px-4 py-2 rounded-xl bg-white text-black font-medium" href="/checkout">
              Ir a Checkout
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
