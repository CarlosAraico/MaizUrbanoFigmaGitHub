import React, { useMemo, useState } from "react";
import { useCart } from "../store/cart";
import { calcDelivery, DeliveryType } from "../lib/zones";
import { mxn } from "../lib/money";
import { buildWhatsAppLink } from "../lib/whatsapp";

const WHATSAPP_PHONE = "527772168377";

export default function Checkout() {
  const { items, subtotal } = useCart();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cp, setCp] = useState("");
  const [colonia, setColonia] = useState("");
  const [notes, setNotes] = useState("");

  const delivery = useMemo(() => calcDelivery(subtotal, deliveryType, cp), [subtotal, deliveryType, cp]);
  const fee = deliveryType === "pickup" ? 0 : delivery.deliveryFee;
  const total = subtotal + fee;

  const waLink = useMemo(() => {
    const lines = [
      "Pedido Maiz Urbano",
      `Nombre: ${name || ""}`,
      `Tel: ${phone || ""}`,
      `Entrega: ${deliveryType === "pickup" ? "Recoger" : "Envio"}`,
    ];
    if (deliveryType === "delivery") {
      lines.push(`Direccion: ${address || ""}`);
      lines.push(`CP: ${cp || ""} · Colonia: ${colonia || ""}`);
    }
    if (notes) lines.push(`Notas: ${notes}`);
    lines.push("");
    lines.push("Items:");
    for (const it of items) lines.push(`- ${it.qty}x ${it.name} (${mxn(it.price)})`);
    lines.push("");
    lines.push(`Subtotal: ${mxn(subtotal)}`);
    lines.push(`Envio: ${mxn(fee)}`);
    lines.push(`Total: ${mxn(total)}`);
    return buildWhatsAppLink({ phone: WHATSAPP_PHONE, text: lines.join("\n") });
  }, [name, phone, deliveryType, address, cp, colonia, notes, items, subtotal, fee, total]);

  const canContinue =
    items.length > 0 &&
    name.trim().length > 2 &&
    phone.trim().length >= 8 &&
    (deliveryType === "pickup" || (address.trim().length > 5 && cp.trim().length === 5)) &&
    delivery.ok;

  const goConfirm = () => {
    const payload = {
      customer: { name, phone },
      delivery: {
        type: deliveryType,
        address,
        cp,
        colonia,
        notes,
        zoneId: delivery.zone?.id,
        deliveryFee: fee,
        minSubtotal: delivery.minSubtotal,
      },
      totals: { subtotal, deliveryFee: fee, total },
    };
    sessionStorage.setItem("mu_checkout", JSON.stringify(payload));
    window.location.href = "/confirm";
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-base-600 mt-2 text-sm">
          Envio con zonas por CP. Tienda base: 01010 (Los Alpes, Alvaro Obregon).
        </p>
      </div>

      {items.length === 0 ? (
        <div className="p-6 rounded-2xl bg-base-50 border border-base-200">
          <p className="text-base-600">No hay items. Ve al menu.</p>
          <a className="inline-block mt-4 px-4 py-2 rounded-xl bg-white text-black" href="/menu">
            Ir al Menu
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-base-50 border border-base-200">
              <h2 className="font-semibold">Tipo de entrega</h2>
              <div className="mt-3 flex gap-2 text-sm">
                <button
                  className={[
                    "px-4 py-2 rounded-xl border",
                    deliveryType === "delivery" ? "bg-white text-black border-white" : "bg-base-100 border-base-200",
                  ].join(" ")}
                  onClick={() => setDeliveryType("delivery")}
                >
                  Envio
                </button>
                <button
                  className={[
                    "px-4 py-2 rounded-xl border",
                    deliveryType === "pickup" ? "bg-white text-black border-white" : "bg-base-100 border-base-200",
                  ].join(" ")}
                  onClick={() => setDeliveryType("pickup")}
                >
                  Recoger
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-base-50 border border-base-200">
              <h2 className="font-semibold">Datos</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs text-base-600">Nombre</span>
                  <input className="rounded-xl bg-base-100 border border-base-200 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-base-600">Telefono</span>
                  <input className="rounded-xl bg-base-100 border border-base-200 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>

                {deliveryType === "delivery" && (
                  <>
                    <label className="grid gap-1 sm:col-span-2">
                      <span className="text-xs text-base-600">Direccion</span>
                      <input className="rounded-xl bg-base-100 border border-base-200 px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs text-base-600">Codigo Postal</span>
                      <input
                        className="rounded-xl bg-base-100 border border-base-200 px-3 py-2"
                        value={cp}
                        onChange={(e) => setCp(e.target.value.replace(/\\D/g, "").slice(0, 5))}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs text-base-600">Colonia</span>
                      <input className="rounded-xl bg-base-100 border border-base-200 px-3 py-2" value={colonia} onChange={(e) => setColonia(e.target.value)} />
                    </label>
                  </>
                )}

                <label className="grid gap-1 sm:col-span-2">
                  <span className="text-xs text-base-600">Notas</span>
                  <input className="rounded-xl bg-base-100 border border-base-200 px-3 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </label>
              </div>

              {deliveryType === "delivery" && (
                <div className="mt-4 p-4 rounded-xl bg-base-100 border border-base-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-base-600">Zona</span>
                    <span className="font-mono">{delivery.zone.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base-600">Envio</span>
                    <span className="font-mono">{mxn(delivery.deliveryFee)}</span>
                  </div>
                  {!delivery.ok && <div className="mt-2 text-amber-300">{delivery.message}</div>}
                </div>
              )}
            </div>

            <button
              className={[
                "w-full px-4 py-3 rounded-xl font-medium",
                canContinue ? "bg-white text-black hover:opacity-90" : "bg-base-100 border border-base-200 text-base-600 cursor-not-allowed",
              ].join(" ")}
              onClick={goConfirm}
              disabled={!canContinue}
            >
              Continuar a Confirmacion
            </button>
          </div>

          <aside className="p-6 rounded-2xl bg-base-50 border border-base-200 h-fit space-y-3">
            <div className="text-sm text-base-600">Subtotal</div>
            <div className="text-xl font-semibold">{mxn(subtotal)}</div>
            <div className="text-sm text-base-600">Envio</div>
            <div className="text-xl font-semibold">{mxn(fee)}</div>
            <div className="text-sm text-base-600">Total</div>
            <div className="text-2xl font-semibold">{mxn(total)}</div>

            <a
              className="block text-center w-full px-4 py-2 rounded-xl bg-white text-black font-medium"
              href={waLink}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp directo
            </a>

            <div className="text-xs text-base-600">
              Si el CP cae fuera, no entregamos (por ahora). Eso se afina cuando conectemos geocoding/zonas reales.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
