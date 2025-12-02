import { MUCard } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";

export function MuCedis() {
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
        Operación centralizada
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: 800,
          marginBottom: "12px",
          color: muColors.textMain,
        }}
      >
        CEDIS: corazón operativo de Maíz Urbano.
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
        Un centro de producción diseñado para abastecer múltiples módulos con
        la misma calidad, aprovechando economías de escala sin sacrificar sabor.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
        }}
      >
        <MUCard title="Producción profesional" gold>
          Cocciones controladas, preparación de bases y estandarización de
          cada lote bajo parámetros técnicos.
        </MUCard>

        <MUCard title="Cadena de frío">
          Productos listos para terminar en módulo manteniendo inocuidad
          y textura óptima.
        </MUCard>

        <MUCard title="Kit de módulo">
          Cada sucursal recibe producto, salsas, toppings y materiales listos
          para operar con mínima improvisación.
        </MUCard>
      </div>
    </>
  );
}
