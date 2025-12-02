import { Card } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";
import { muTypography } from "../../../design-system/tokens/typography";
import { muSpacing } from "../../../design-system/tokens/spacing";

export function MuMenu() {
  return (
    <div>
      <p
        style={{
          fontSize: muTypography.caption.fontSize,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          opacity: 0.85,
          marginBottom: muSpacing.xs,
          color: muColors.gold,
        }}
      >
        Menú insignia
      </p>

      <h2
        style={{
          fontSize: muTypography.h2.fontSize,
          fontWeight: muTypography.h2.fontWeight,
          marginBottom: muSpacing.s,
          color: muColors.textMain,
        }}
      >
        Tres productos. Un sistema completo.
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
        Elote montado, esquites salteados y panqué de elote. Diseñados para operación rápida,
        margen alto y experiencia consistente.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: muSpacing.m,
        }}
      >
        <Card title="Elote Montado" gold>
          Servido con mantequilla, queso, salsas y toppings calibrados. Diseñado para alto
          rendimiento en módulos de calle.
        </Card>

        <Card title="Esquites Salteados">
          Cocinados con técnica profesional y caldos de maíz criollo. Elevan el sabor y mantienen
          estándares de inocuidad.
        </Card>

        <Card title="Panqué de Elote">
          Receta propia con maíces nativos. Suave, aromático y con notas tostadas naturales.
        </Card>
      </div>
    </div>
  );
}
