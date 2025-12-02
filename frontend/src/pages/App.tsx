import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";

const API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:4000";

export default function App() {
  const [status, setStatus] = useState("cargando...");
  const [id, setId] = useState("corn-yellow-kg");
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then((r) => r.json())
      .then((d) => setStatus(`${d.status} • ${new Date(d.ts).toLocaleTimeString()}`))
      .catch(() => setStatus("offline"));
  }, []);

  const fetchStock = async () => {
    const r = await fetch(`${API}/api/inventory/${id}`);
    const j = await r.json();
    setStock(j.stock);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-base-0 text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <Hero />
        <section id="inventario" className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
            <h2 className="text-xl font-semibold">Estado del backend</h2>
            <p className="text-base-600 mt-2 font-mono">{status}</p>
          </div>
          <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
            <h2 className="text-xl font-semibold">Consultar inventario</h2>
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 rounded-xl bg-base-100 border border-base-300 px-3 py-2"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <button onClick={fetchStock} className="px-4 py-2 rounded-xl bg-white text-black">
                Consultar
              </button>
            </div>
            <p className="mt-3 text-base-600">
              Stock: <b>{stock ?? "—"}</b>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
