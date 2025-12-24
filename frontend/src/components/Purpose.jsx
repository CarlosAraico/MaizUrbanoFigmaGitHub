import React from "react";
import purposeGraphic from "../assets/purpose-graphic.svg";

const pillars = [
  { title: "Mision", detail: "Texto breve sobre el impacto que buscas generar." },
  { title: "Transparencia", detail: "Como mides y compartes tus resultados." },
  { title: "Escalabilidad", detail: "Como creces manteniendo sostenibilidad." },
];

export default function Purpose() {
  return (
    <section id="purpose" className="w-full bg-[var(--color-surface)]">
      <div className="page-shell grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Proposito</p>
          <h2 className="text-3xl font-semibold md:text-4xl">
            Construye tu narrativa de sostenibilidad con claridad.
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Subtitulo para explicar la mision o proposito. Cambia el texto y mantelo conciso.
          </p>

          <div className="grid gap-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong-80)] p-4"
              >
                <span className="mt-1 h-3 w-3 rounded-full bg-[var(--color-primary)]" />
                <div>
                  <p className="text-lg font-semibold text-[var(--color-text-primary)]">{pillar.title}</p>
                  <p className="text-[var(--color-text-secondary)]">{pillar.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -inset-6 bg-[var(--color-primary-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative w-full max-w-xl overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] shadow-overlay">
            <img src={purposeGraphic} alt="Ilustracion de sostenibilidad" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
