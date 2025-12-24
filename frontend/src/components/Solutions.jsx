import React from "react";
import iconLeaf from "../assets/icon-leaf.svg";
import iconData from "../assets/icon-data.svg";
import iconChain from "../assets/icon-chain.svg";

const solutions = [
  {
    title: "Diseno modular",
    description: "Infraestructura lista para adaptar a cada sitio.",
    icon: iconLeaf,
  },
  {
    title: "Monitoreo y datos",
    description: "Dashboards, alertas y trazabilidad en vivo.",
    icon: iconData,
  },
  {
    title: "Cadena conectada",
    description: "Contratos y entregas coordinadas con clientes.",
    icon: iconChain,
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="w-full bg-[var(--color-background)]">
      <div className="page-shell py-14">
        <h2 className="text-3xl font-semibold md:text-4xl">Soluciones clave</h2>
        <p className="mt-2 max-w-xl text-[var(--color-text-secondary)]">
          Subtexto breve para resumir la propuesta. Cambialo por tu copy.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong-70)]">
                <img src={solution.icon} alt="" className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">
                {solution.title}
              </h3>
              <p className="mt-2 text-[var(--color-text-secondary)]">{solution.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
