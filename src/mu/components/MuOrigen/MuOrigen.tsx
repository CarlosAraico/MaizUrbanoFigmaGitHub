import { MUCard } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";

export function MuOrigen() {
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
        Origen criollo
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: 800,
          marginBottom: "12px",
          color: muColors.textMain,
        }}
      >
        Maíz que cuenta una historia.
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
        Trabajamos con maíces criollos de Tlaxcala y regiones aledañas
        para preservar sabor, color y biodiversidad. Cada elote, cada esquite
        y cada panqué es una expresión del campo mexicano llevada a la ciudad
        con técnica profesional.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
        }}
      >
        <MUCard title="Variedades nativas" gold>
          Blanco, amarillo, rojo, morado y azul. Cada lote documentado para
          garantizar trazabilidad y sabor auténtico.
        </MUCard>

        <MUCard title="Relación con productores">
          Compras directas a agricultores que preservan semillas nativas
          mediante técnicas tradicionales y cultivo responsable.
        </MUCard>

        <MUCard title="Identidad en cada vaso">
          El sabor del maíz criollo se expresa sin atajos: caldos, cocciones
          y gramajes calibrados para consistencia absoluta.
        </MUCard>
      </div>
    </>
  );
}
