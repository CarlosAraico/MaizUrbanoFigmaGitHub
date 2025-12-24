import React, { useEffect, useMemo, useState } from "react";
import { fetchMenu, MenuItem } from "../lib/api";
import { useCart } from "../store/cart";
import { mxn } from "../lib/money";

const FALLBACK: MenuItem[] = [
  { id: "taco-arrachera", name: "Taco Arrachera", desc: "Arrachera + salsa MU", price: 45, category: "Tacos" },
  { id: "taco-pastor", name: "Taco Pastor", desc: "Pastor clásico", price: 35, category: "Tacos" },
  { id: "gringa", name: "Gringa", desc: "Queso + pastor", price: 95, category: "Especiales" },
  { id: "quesadilla", name: "Quesadilla", desc: "Queso Oaxaca", price: 55, category: "Antojitos" },
  { id: "agua-jamaica", name: "Agua Jamaica", desc: "500 ml", price: 35, category: "Bebidas" },
  { id: "agua-horchata", name: "Agua Horchata", desc: "500 ml", price: 35, category: "Bebidas" },
];

export default function Menu() {
  const { add } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch(() => {
        setErr("Backend de menú offline. Usando fallback local.");
        setItems(FALLBACK);
      });
  }, []);

  const byCat = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const it of items) {
      const c = it.category || "Otros";
      map.set(c, [...(map.get(c) || []), it]);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-base-50 border border-base-200 shadow-soft">
        <h1 className="text-2xl font-semibold">Menú</h1>
        <p className="text-base-600 mt-2 text-sm">
          Precios cargan desde backend (listo para conectar a Google Sheets después).
        </p>
        {err && <p className="mt-2 text-sm text-amber-300">{err}</p>}
      </div>

      {byCat.map(([cat, list]) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-lg font-semibold">{cat}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((it) => (
              <div key={it.id} className="p-5 rounded-2xl bg-base-50 border border-base-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-base-600 mt-1">{it.desc}</div>
                  </div>
                  <div className="font-mono text-sm">{mxn(it.price)}</div>
                </div>
                <button
                  className="mt-4 w-full px-4 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90"
                  onClick={() => add({ id: it.id, name: it.name, price: it.price }, 1)}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
