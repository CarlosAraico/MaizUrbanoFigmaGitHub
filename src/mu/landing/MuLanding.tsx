import React from "react";

// Navbar
import { MuNavbar } from "../components/MuNavbar/MuNavbar";

// Bloques principales
import { MuHero } from "../components/MuHero/MuHero";
import { MuMenu } from "../components/MuMenu/MuMenu";
import { MuOrigen } from "../components/MuOrigen/MuOrigen";
import { MuImpacto } from "../components/MuImpacto/MuImpacto";
import { MuTrazabilidad } from "../components/MuTrazabilidad/MuTrazabilidad";
import { MuCedis } from "../components/MuCedis/MuCedis";
import { MuInversion } from "../components/MuInversion/MuInversion";
import { MuFranquicias } from "../components/MuFranquicias/MuFranquicias";
import { MuEmpleo } from "../components/MuEmpleo/MuEmpleo";
import { MuSucursales } from "../components/MuSucursales/MuSucursales";
import { MuFooter } from "../components/MuFooter/MuFooter";

// Layout y animaciones
import { MUSectionShell } from "../../design-system/components/SectionShell";
import { useMuGsapAnimations } from "../animations/useMuGsapAnimations";

export function MuLanding() {
  // Activa animaciones GSAP avanzadas
  useMuGsapAnimations();

  return (
    <div style={{ background: "#02040A" }}>
      {/* NAVBAR */}
      <MuNavbar />

      {/* Contenedor general con offset del navbar */}
      <div style={{ paddingTop: "72px" }}>
        {/* HERO */}
        <div data-mu-animate="fade-up">
          <MuHero />
        </div>

        {/* MENÚ */}
        <MUSectionShell id="mu-menu" dark>
          <div data-mu-animate="fade-up">
            <MuMenu />
          </div>
        </MUSectionShell>

        {/* ORIGEN */}
        <MUSectionShell id="mu-origen">
          <div data-mu-animate="fade-left">
            <MuOrigen />
          </div>
        </MUSectionShell>

        {/* IMPACTO */}
        <MUSectionShell id="mu-impacto" dark>
          <div data-mu-animate="fade-right">
            <MuImpacto />
          </div>
        </MUSectionShell>

        {/* TRAZABILIDAD */}
        <MUSectionShell id="mu-trazabilidad">
          <div data-mu-animate="fade-up">
            <MuTrazabilidad />
          </div>
        </MUSectionShell>

        {/* CEDIS */}
        <MUSectionShell id="mu-cedis" dark>
          <div data-mu-animate="fade-left">
            <MuCedis />
          </div>
        </MUSectionShell>

        {/* INVERSION */}
        <MUSectionShell id="mu-inversion">
          <div data-mu-animate="fade-scale">
            <MuInversion />
          </div>
        </MUSectionShell>

        {/* FRANQUICIAS */}
        <MUSectionShell id="mu-franquicias" dark>
          <div data-mu-animate="fade-up">
            <MuFranquicias />
          </div>
        </MUSectionShell>

        {/* EMPLEO */}
        <MUSectionShell id="mu-empleo">
          <div data-mu-animate="fade-right">
            <MuEmpleo />
          </div>
        </MUSectionShell>

        {/* SUCURSALES */}
        <MUSectionShell id="mu-sucursales" dark>
          <div data-mu-animate="fade-up">
            <MuSucursales />
          </div>
        </MUSectionShell>

        {/* FOOTER */}
        <MuFooter />
      </div>
    </div>
  );
}
