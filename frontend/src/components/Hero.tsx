import React from "react";

export default function Hero() {
  return (
    <section className="space-y-6 bg-base-50 border border-base-200 rounded-3xl p-8 shadow-soft">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
        Maiz Urbano · MU v4
      </p>
      <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white">
        Backend Express + ngrok listo para Figma DevMode
      </h1>
      <p className="text-base-600 text-lg max-w-2xl">
        Levanta el stack con `npm run up`, conecta el túnel https y usa el plugin
        de Figma para sincronizar inventario en vivo.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="px-3 py-2 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
          /api/health
        </span>
        <span className="px-3 py-2 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
          /api/inventory/:id
        </span>
        <span className="px-3 py-2 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
          /api/webhooks/inventory
        </span>
      </div>
    </section>
  );
}
