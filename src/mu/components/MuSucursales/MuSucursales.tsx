import { Card } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";
import { muTypography } from "../../../design-system/tokens/typography";
import { muSpacing } from "../../../design-system/tokens/spacing";

export function MuSucursales() {
  return (
    <>
      <p
        style={{
          fontSize: muTypography.caption.fontSize,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: muColors.gold,
          opacity: 0.85,
          marginBottom: muSpacing.s,
        }}
      >
        Sucursales piloto
      </p>

      <h2
        style={{
          fontSize: muTypography.h2.fontSize,
          fontWeight: muTypography.h2.fontWeight,
          marginBottom: muSpacing.s,
          color: muColors.textMain,
        }}
      >
        Nuestra presencia en la ciudad.
      </h2>

      <p
        style={{
          fontSize: "18px",
          maxWidth: "640px",
          opacity: 0.85,
          marginBottom: muSpacing.l,
          color: muColors.textSoft,
        }}
      >
        Tres puntos iniciales con tráfico alto y desempeño probado. Listas para replicación inmediata.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: muSpacing.m,
        }}
      >
        <Card title="Roma Norte" gold>
          Álvaro Obregón 80
          <br />
          Lunes a Domingo
          <br />
          1 pm – 11 pm
        </Card>

        <Card title="Condesa">
          Michoacán 43
          <br />
          Lunes a Domingo
          <br />
          1 pm – 11 pm
        </Card>

        <Card title="Satélite">
          Circuito Centro Comercial
          <br />
          Martes a Domingo
          <br />
          2 pm – 10 pm
        </Card>
      </div>
    </>
  );
}
