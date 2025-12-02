import { Card } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";
import { muTypography } from "../../../design-system/tokens/typography";
import { muSpacing } from "../../../design-system/tokens/spacing";

export function MuEmpleo() {
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
        Oportunidades laborales
      </p>

      <h2
        style={{
          fontSize: muTypography.h2.fontSize,
          fontWeight: muTypography.h2.fontWeight,
          marginBottom: muSpacing.s,
          color: muColors.textMain,
        }}
      >
        Únete al movimiento del maíz criollo.
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
        Buscamos talento operativo, líderes de módulo y colaboradores que quieran crecer en un
        sistema profesional y en expansión.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: muSpacing.m,
        }}
      >
        <Card title="Operador de módulo">
          Preparación de productos, servicio al cliente y operación diaria.
        </Card>

        <Card title="Líder de sucursal" gold>
          Administración de módulo, control operativo y reportes básicos.
        </Card>

        <Card title="Producción en CEDIS">
          Preparación de bases, control de inventarios y calidad.
        </Card>
      </div>
    </>
  );
}
