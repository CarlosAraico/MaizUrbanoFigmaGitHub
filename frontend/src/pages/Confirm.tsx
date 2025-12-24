import React, { useMemo, useState } from "react";
import { useCart } from "../store/cart";
import { mxn } from "../lib/money";
import { buildWhatsAppLink } from "../lib/whatsapp";
import { createOrder } from "../lib/api";

const WHATSAPP_PHONE = "527772168377"; // +52 777 216 8377

function safeParse(s: string | null) {
  try { return s ? JSON.parse(s) : null; } catch { return null; }
}

export default function Confirm() {
  const { items, subtotal, clear } = useCart();
  const [snapshot] = useState({ items, subtotal });
  const checkout = useMemo(() => safeParse(sessionStorage.getItem("mu_checkout")), []);
  const [saving, setSaving] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const cartItems = snapshot.items;
  const subtotalValue = snapshot.subtotal;

  const deliveryFee = checkout?.delivery?.type === "pickup" ? 0 : Number(checkout?.totals?.deliveryFee || 0);
  const total = subtotalValue + deliveryFee;

  const waText = useMemo(() => {
    const cust = checkout?.customer || {};
    const del = checkout?.delivery || {};
    const lines = [
      "Pedido Maíz Urbano",
      `Nombre: ${cust.name || ""}`,
      `Tel: ${cust.phone || ""}`,
      `Entrega: ${del.type === "pickup" ? "Recoger" : "Envío"}`,
    ];
    if (del.type !== "pickup") {
      lines.push(`Dirección: ${del.address || ""}`);
      lines.push(`CP: ${del.cp || ""} · Colonia: ${del.colonia || ""}`);
      lines.push(`Zona: ${del.zoneId || ""}`);
    }
    if (del.notes) lines.push(`Notas: ${del.notes}`);
    lines.push("");
    lines.push("Items:");
    for (const it of cartItems) lines.push(`- ${it.qty}x ${it.name} (${mxn(it.price)}) = ${mxn(it.price * it.qty)}`);
    lines.push("");
    lines.push(`Subtotal: ${mxn(subtotalValue)}`);
    lines.push(`Envío: ${mxn(deliveryFee)}`);
    lines.push(`Total: ${mxn(total)}`);
    return lines.join("\n");
  }, [checkout, cartItems, subtotalValue, deliveryFee, total]);

  const wa = buildWhatsAppLink({ phone: WHATSAPP_PHONE, text: waText });

  const saveOrder = async () => {
    setSaving(true);
    setErr("");
    try {
      const payload = {
        ...checkout,
        items: cartItems,
        totals: { subtotal: subtotalValue, deliveryFee, total },
      };
      const r = await createOrder(payload);
      setOrderId(r.orderId);
      clear();
      sessionStorage.removeItem("mu_checkout");
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  if (!checkout) {
    return (
      <div className="p-6 rounded-2xl bg-base-50 border border-base-200">
        <h1 className="text-2xl font-semibold">Confirmación</h1>
        <p className="text-base-600 mt-2">No hay datos de checkout. Vuelve a checkout.</p>
        <a className="inline-block mt-4 px-4 py-2 rounded-xl bg-white text-black" href="/checkout">
          Ir a Checkout
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
        <h1 className="text-2xl font-semibold">Confirmación</h1>
        <p className="text-base-600 mt-2 text-sm">Guarda el pedido (dev) y/o envíalo por WhatsApp.</p>
        {orderId && <p className="mt-2 text-sm text-emerald-300">OrderId: {orderId}</p>}
        {err && <p className="mt-2 text-sm text-amber-300">{err}</p>}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="p-6 rounded-2xl bg-base-50 border border-base-200 space-y-3">
          <h2 className="font-semibold">Resumen</h2>
          <pre className="text-xs whitespace-pre-wrap text-base-600 bg-base-100 border border-base-200 rounded-xl p-4">{waText}</pre>
        </div>

        <aside className="p-6 rounded-2xl bg-base-50 border border-base-200 h-fit space-y-3">
          <div className="text-sm text-base-600">Total</div>
          <div className="text-2xl font-semibold">{mxn(total)}</div>

          <button
            className="w-full px-4 py-2 rounded-xl bg-base-100 border border-base-200"
            onClick={saveOrder}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar pedido (backend)"}
          </button>

          <a className="block text-center w-full px-4 py-2 rounded-xl bg-white text-black font-medium" href={wa} target="_blank" rel="noreferrer">
            Enviar por WhatsApp
          </a>

          <a className="block text-center w-full px-4 py-2 rounded-xl bg-base-100 border border-base-200" href="/menu">
            Seguir comprando
          </a>
        </aside>
      </div>
    </div>
  );
}
