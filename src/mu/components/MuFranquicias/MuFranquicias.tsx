import { Card } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";
import { muTypography } from "../../../design-system/tokens/typography";
import { muSpacing } from "../../../design-system/tokens/spacing";

export function MuFranquicias() {
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
        Modelo de franquicias
      </p>

      <h2
        style={{
          fontSize: muTypography.h2.fontSize,
          fontWeight: muTypography.h2.fontWeight,
          marginBottom: muSpacing.s,
          color: muColors.textMain,
        }}
      >
        Sistema replicable listo para expansión.
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
        Modelo diseñado para escalar: recetas calibradas, operación modular, abastecimiento
        centralizado y soporte continuo al franquiciatario.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: muSpacing.m,
        }}
      >
        <Card title="Recetas calibradas" gold>
          Fichas técnicas profesionales. Minimiza mermas y acelera capacitación.
        </Card>

        <Card title="Operación estandarizada">
          SOP completo para cada rol operativo. Todo medible, todo replicable.
        </Card>

        <Card title="CEDIS centralizado">
          Consistencia garantizada con producción profesional en un centro de distribución.
        </Card>

        <Card title="Acompañamiento continuo">
          Capacitación, supervisión remota, auditorías y soporte.
        </Card>
      </div>
    </>
  );
}
