import { MUCard } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";

export function MuTrazabilidad() {
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
        Trazabilidad
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: 800,
          marginBottom: "12px",
          color: muColors.textMain,
        }}
      >
        Del campo al módulo, sin perder el origen.
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
        Documentamos procesos, controlamos variables críticas y convertimos
        recetas tradicionales en fichas técnicas replicables para cada sucursal.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
        }}
      >
        <MUCard title="Recetas calibradas" gold>
          Gramajes, temperaturas, tiempos y porciones definidas para
          garantizar sabor idéntico en cualquier sucursal.
        </MUCard>

        <MUCard title="Datos operativos">
          Mermas, rendimientos por lote, rotación y tiempos de servicio
          monitoreados continuamente.
        </MUCard>

        <MUCard title="Auditoría de calidad">
          Verificaciones cruzadas entre CEDIS y módulos para asegurar
          consistencia operativa.
        </MUCard>
      </div>
    </>
  );
}
