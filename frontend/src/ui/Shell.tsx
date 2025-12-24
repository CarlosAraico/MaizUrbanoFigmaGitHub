import React from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../store/cart";
import { buildWhatsAppLink } from "../lib/whatsapp";

const WHATSAPP_PHONE = "527772168377"; // +52 777 216 8377

export default function Shell({ children }: { children: React.ReactNode }) {
  const { count } = useCart();

  const wa = buildWhatsAppLink({
    phone: WHATSAPP_PHONE,
    text: "Hola Maíz Urbano, quiero hacer un pedido. 🙌",
  });

  const Item = ({ to, label }: { to: string; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-xl border border-base-200 hover:bg-base-100 transition",
          isActive ? "bg-base-100" : "bg-base-50",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-base-0 text-white">
      <header className="sticky top-0 z-20 border-b border-base-200/60 bg-base-0/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3">
            <div className="font-semibold tracking-wide">Maíz Urbano</div>
            <nav className="hidden sm:flex items-center gap-2 text-sm">
              <Item to="/" label="Inicio" />
              <Item to="/menu" label="Menú" />
              <Item to="/cart" label={`Carrito (${count})`} />
              <Item to="/checkout" label="Checkout" />
            </nav>
          </div>

          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90"
            title="WhatsApp directo"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>

      <footer className="max-w-6xl mx-auto px-6 pb-10 text-xs text-base-600">
        Andes 91, Los Alpes, Álvaro Obregón, 01010 CDMX · Pedidos: WhatsApp {"+52 777 216 8377"}
      </footer>
    </div>
  );
}
