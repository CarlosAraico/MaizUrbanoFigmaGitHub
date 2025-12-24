import React from "react";
import heroVisual from "../assets/hero-visual.svg";

export default function Hero() {
  return (
    <section className="w-full bg-[var(--color-surface)]">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Maiz Urbano</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Cultivo urbano a escala,
            <br />
            logistica circular,
            <br />
            trazabilidad en tiempo real.
          </h1>
          <p className="max-w-xl text-lg text-[var(--color-text-secondary)]">
            Texto editable para explicar tu propuesta de valor. Mantelo breve y directo para resaltar
            el beneficio principal.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-primary" href="#solutions">
              Llamada a la accion
            </a>
            <a className="btn btn-ghost" href="#markets">
              Ver mas detalles
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-strong)]">
            <div className="absolute -inset-6 bg-[var(--color-primary-soft)] blur-3xl" aria-hidden="true" />
            <img
              src={heroVisual}
              alt="Ilustracion o mock de producto"
              className="relative z-10 w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
