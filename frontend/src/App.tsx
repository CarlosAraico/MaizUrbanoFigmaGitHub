import { FormEvent, useEffect, useState } from "react";

type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  updatedAt?: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE || (globalThis as any).__API_BASE__ || "http://127.0.0.1:4000";

function App() {
  const [itemId, setItemId] = useState("corn-blue");
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [status, setStatus] = useState<string>("Listo para consultar inventario");
  const [loading, setLoading] = useState(false);

  async function fetchItem(id: string) {
    const cleanId = id.trim();
    if (!cleanId) return;
    setLoading(true);
    setStatus("Consultando inventario...");
    try {
      const res = await fetch(`${API_BASE}/api/inventory/${cleanId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No encontrado");
      }
      const data = (await res.json()) as { item: InventoryItem };
      setItem(data.item);
      setStatus(`Stock actualizado para ${data.item.id}`);
    } catch (err: any) {
      setItem(null);
      setStatus(err.message || "Error al consultar inventario");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItem(itemId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    fetchItem(itemId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <header className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
          Maiz Urbano · MU v4
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold leading-tight">
          Inventario en vivo para{" "}
          <span className="text-emerald-300">Figma DevMode</span> y web
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl">
          Backend Express + SQLite con webhooks idempotentes. Usa el túnel de
          ngrok para conectar el plugin de Figma o consulta directo desde esta
          página.
        </p>
        <div className="mt-8 flex gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
            /api/health
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
            /api/inventory/:id
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
            /api/webhooks/inventory
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl shadow-emerald-900/20 p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-slate-400">API base</p>
              <p className="text-lg font-semibold text-emerald-200">
                {API_BASE}
              </p>
            </div>
            <p className="text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
              {status}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="corn-blue"
              className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Consultando..." : "Consultar"}
            </button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Resultado</h2>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-6 min-h-[150px]">
              {item ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">ID</p>
                  <p className="text-2xl font-semibold">{item.id}</p>
                  <p className="text-sm text-slate-400">Nombre</p>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-sm text-slate-400">Stock</p>
                  <p className="text-3xl font-bold text-emerald-300">
                    {item.stock}
                  </p>
                  {item.updatedAt && (
                    <p className="text-xs text-slate-500">
                      Actualizado: {new Date(item.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">
                  Ingresa un ID de inventario para ver el stock en vivo.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20">
          <h3 className="text-xl font-semibold">Cómo probar el webhook</h3>
          <ol className="mt-4 space-y-3 text-slate-200 text-sm leading-relaxed list-decimal list-inside">
            <li>Ejecuta <code className="font-mono">npm run up</code> y espera que el backend esté en puerto 4000.</li>
            <li>Lanza <code className="font-mono">npm run tunnel</code> para obtener URL https vía ngrok.</li>
            <li>Envía un POST a <code className="font-mono">/api/webhooks/inventory</code> con header <code className="font-mono">X-Webhook-Secret</code> y payload con <code className="font-mono">eventId</code> + items.</li>
            <li>Consulta arriba el ID afectado para validar el nuevo stock.</li>
          </ol>
          <pre className="mt-4 bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-200 overflow-x-auto">
{`curl -X POST ${API_BASE}/api/webhooks/inventory \\
  -H "Content-Type: application/json" \\
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \\
  -d '{
    "eventId": "evt-demo-001",
    "items": [
      {"id": "corn-blue", "name": "Maiz azul", "quantity": 115}
    ]
  }'`}
          </pre>
        </section>
      </main>
    </div>
  );
}

export default App;
