import React from "react";

const markets = [
  { name: "Retail", detail: "Trazabilidad y SLA para tiendas." },
  { name: "Horeca", detail: "Entregas rapidas para cocina." },
  { name: "CPG", detail: "Insumos listos para formulas." },
  { name: "Bebidas", detail: "Lotes consistentes para recetas." },
  { name: "Corporativo", detail: "Programas internos y ESG." },
  { name: "Publico", detail: "Opciones para compras publicas." },
];

export default function Markets() {
  return (
    <section id="markets" className="w-full bg-[var(--color-background)]">
      <div className="page-shell py-14">
        <h2 className="text-3xl font-semibold md:text-4xl">Segmentos</h2>
        <p className="mt-2 max-w-xl text-[var(--color-text-secondary)]">
          Texto corto para explicar donde participas. Cambialo segun tus mercados.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {markets.map((market) => (
            <article
              key={market.name}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-5 shadow-overlay transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-semibold text-[var(--color-primary-strong)]">
                {market.name.slice(0, 1)}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[var(--color-text-primary)]">{market.name}</h3>
              <p className="mt-1 text-[var(--color-text-secondary)]">{market.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
