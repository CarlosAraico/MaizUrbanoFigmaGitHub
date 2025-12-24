import React from "react";
import logo from "../assets/logo.svg";

const links = [
  { label: "Inicio", href: "#" },
  { label: "Servicios", href: "#solutions" },
  { label: "Blog", href: "#blog" },
  { label: "Contacto", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="page-shell grid gap-8 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-strong-70)]">
              <img src={logo} alt="Logo" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--color-text-primary)]">Tu marca</p>
              <p className="text-sm text-[var(--color-text-muted)]">Sublinea editable.</p>
            </div>
          </div>
          <p className="max-w-md text-[var(--color-text-secondary)]">
            Breve descripcion de tu propuesta. Mantela concisa y profesional.
          </p>
        </div>

        <div className="grid gap-4 text-[var(--color-text-secondary)] md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Secciones
            </p>
            <div className="mt-3 grid gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base transition-colors hover:text-[var(--color-primary-strong)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Legal
            </p>
            <div className="mt-3 grid gap-2">
              <a href="#privacidad" className="text-base transition-colors hover:text-[var(--color-primary-strong)]">
                Aviso de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-strong)] py-4">
        <div className="page-shell flex flex-col gap-2 text-sm text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between">
          <span>(c) {year} Tu empresa. Todos los derechos reservados.</span>
          <a href="#contact" className="transition-colors hover:text-[var(--color-primary-strong)]">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
