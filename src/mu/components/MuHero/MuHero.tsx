import { Button } from "../../../design-system/components/Button";
import { Metric } from "../../../design-system/components/Metric";
import { muColors } from "../../../design-system/tokens/colors";
import { muTypography } from "../../../design-system/tokens/typography";
import { muSpacing } from "../../../design-system/tokens/spacing";

export function MuHero() {
  return (
    <section
      id="mu-hero"
      style={{
        position: "relative",
        padding: "140px 32px",
        background: "radial-gradient(circle at top, #111827 0%, #020617 65%)",
        color: muColors.textMain,
        textAlign: "left",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p
          className="mu-hero-subtitle"
          style={{
            letterSpacing: "0.16em",
            fontSize: "14px",
            opacity: 0.7,
            marginBottom: muSpacing.s,
          }}
        >
          MAÍZ URBANO / FAST-CASUAL DE IDENTIDAD MEXICANA
        </p>

        <h1
          className="mu-hero-title"
          style={{
            fontSize: "58px",
            fontWeight: muTypography.h1.fontWeight,
            lineHeight: muTypography.h1.lineHeight,
            marginBottom: muSpacing.m,
          }}
        >
          El nuevo estándar de antojitos de maíz criollo.
        </h1>

        <p
          className="mu-hero-subtitle"
          style={{
            maxWidth: "620px",
            fontSize: "20px",
            opacity: 0.85,
            marginBottom: muSpacing.l,
          }}
        >
          Gastronomía criolla profesionalizada. Operación rápida, replicable y diseñada
          para escalar: elote montado, esquites y panqués elevados a experiencia fast-casual
          de clase mundial.
        </p>

        <div className="mu-hero-actions" style={{ display: "flex", gap: muSpacing.m, marginBottom: muSpacing.l }}>
          <Button variant="primary" onClick={() => (window.location.hash = "#mu-menu")}>
            Ver menú
          </Button>
          <Button variant="ghost" onClick={() => (window.location.hash = "#mu-franquicias")}>
            Franquicias
          </Button>
        </div>

        <div
          className="mu-hero-metrics"
          style={{ display: "flex", gap: muSpacing.l, marginTop: muSpacing.s, flexWrap: "wrap" }}
        >
          <Metric value="92%" label="Consistencia operativa" />
          <Metric value="65–70%" label="Margen bruto" />
          <Metric value="3" label="Sucursales piloto" />
          <Metric value="90 s" label="Tiempo de servicio" />
        </div>
      </div>
    </section>
  );
}
