import React, { useState, useEffect } from "react";
import { muColors } from "../../../design-system/tokens/colors";

export function MuNavbar() {
  const [open, setOpen] = useState(false);

  // Evita scroll cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const navLinks = [
    ["Inicio", "#mu-hero"],
    ["Menú", "#mu-menu"],
    ["Origen", "#mu-origen"],
    ["Impacto", "#mu-impacto"],
    ["Trazabilidad", "#mu-trazabilidad"],
    ["CEDIS", "#mu-cedis"],
    ["Inversión", "#mu-inversion"],
    ["Franquicias", "#mu-franquicias"],
    ["Empleo", "#mu-empleo"],
    ["Sucursales", "#mu-sucursales"],
  ];

  return (
    <>
      {/* NAVBAR DESKTOP */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          background: "rgba(5, 6, 9, 0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${muColors.goldBorder}`,
          zIndex: 9999,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: muColors.gold,
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "#mu-hero")}
        >
          Maíz Urbano
        </div>

        {/* DESKTOP NAV */}
        <nav className="mu-desktop-nav" style={{ display: "flex", gap: "24px" }}>
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                color: muColors.textMain,
                opacity: 0.8,
                fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* MOBILE BURGER */}
        <div
          className="mu-mobile-burger"
          style={{
            width: "36px",
            height: "30px",
            display: "none",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setOpen(!open)}
        >
          <span
            style={{
              height: "4px",
              background: muColors.gold,
              borderRadius: "6px",
              transition: "0.3s",
              transform: open ? "rotate(45deg) translate(8px, 8px)" : "none",
            }}
          />
          <span
            style={{
              height: "4px",
              background: muColors.gold,
              borderRadius: "6px",
              opacity: open ? 0 : 1,
              transition: "0.3s",
            }}
          />
          <span
            style={{
              height: "4px",
              background: muColors.gold,
              borderRadius: "6px",
              transition: "0.3s",
              transform: open ? "rotate(-45deg) translate(7px, -8px)" : "none",
            }}
          />
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            paddingTop: "120px",
            textAlign: "center",
            zIndex: 9998,
          }}
        >
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                marginBottom: "28px",
                fontSize: "22px",
                textDecoration: "none",
                color: muColors.gold,
                fontWeight: 600,
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      {/* RESPONSIVE RULES (CSS-INJECTED) */}
      <style>{`
        @media (max-width: 900px) {
          .mu-desktop-nav {
            display: none !important;
          }
          .mu-mobile-burger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
