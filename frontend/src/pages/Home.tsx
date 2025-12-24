import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";

const API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:4000";

export default function Home() {
  const [status, setStatus] = useState("cargando...");

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then((r) => r.json())
      .then((d) => setStatus(`${d.status} • ${new Date(d.ts).toLocaleTimeString()}`))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <div className="space-y-10">
      <Hero />

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
          <h2 className="text-xl font-semibold">Estado del backend</h2>
          <p className="text-base-600 mt-2 font-mono">{status}</p>
          <p className="text-base-600 mt-3 text-sm">
            Tip: corre <span className="font-mono">npm run up</span> para levantar backend+frontend.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
          <h2 className="text-xl font-semibold">Pedidos en línea (MVP)</h2>
          <p className="text-base-600 mt-2 text-sm">
            Menú → carrito → checkout → confirmación → WhatsApp directo.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a className="px-3 py-2 rounded-xl bg-white text-black" href="/menu">
              Ir al Menú
            </a>
            <a className="px-3 py-2 rounded-xl bg-base-100 border border-base-200" href="/cart">
              Ver Carrito
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
