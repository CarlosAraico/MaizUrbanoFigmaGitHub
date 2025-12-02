import { MUCard } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";

export function MuInversion() {
  return (
    <>
      <p
        style={{
          fontSize: "12px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: muColors.gold,
          opacity: 0.85,
          marginBottom: "12px",
        }}
      >
        Inversión
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: 800,
          marginBottom: "12px",
          color: muColors.textMain,
        }}
      >
        ¿Por qué invertir en Maíz Urbano?
      </h2>

      <p
        style={{
          fontSize: "18px",
          maxWidth: "700px",
          opacity: 0.85,
          marginBottom: "36px",
          color: muColors.textSoft,
        }}
      >
        Un antojito conocido, profesionalizado. Un modelo fast-casual con raíces
        profundas y diseño operativo moderno.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
        }}
      >
        <MUCard title="Economía de unidades" gold>
          Margen bruto del 65–70% en productos de maíz. Punto de equilibrio
          estimado alrededor del mes 8.
        </MUCard>

        <MUCard title="Escalabilidad">
          Modelo replicable, compatible con sucursales propias, franquicias
          y alianzas.
        </MUCard>

        <MUCard title="Diferenciador real">
          Identidad basada en maíz criollo, no solo branding superficial:
          producto, narrativa y operación alineados.
        </MUCard>
      </div>
    </>
  );
}
