import React from "react";

const stats = [
  { value: "12k", label: "Entregas", note: "Dato editable" },
  { value: "48h", label: "Tiempo a cliente", note: "Dato editable" },
  { value: "92%", label: "SLA cumplido", note: "Dato editable" },
  { value: "30bps", label: "Mejora margen", note: "Dato editable" },
];

export default function Stats() {
  return (
    <section id="stats" className="w-full bg-[var(--color-surface)]">
      <div className="page-shell py-12">
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong-70)] p-6 shadow-overlay"
            >
              <p className="text-5xl font-semibold text-[var(--color-primary)]">{stat.value}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {stat.note}
              </p>
              <p className="mt-2 text-base text-[var(--color-text-secondary)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
