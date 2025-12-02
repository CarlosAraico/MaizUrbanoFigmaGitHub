import { MUCard } from "../../../design-system/components/Card";
import { muColors } from "../../../design-system/tokens/colors";

export function MuImpacto() {
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
        Impacto social y ambiental
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: 800,
          marginBottom: "12px",
          color: muColors.textMain,
        }}
      >
        Modelo de triple impacto.
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
        Comer en Maíz Urbano activa una cadena de valor que conecta campo,
        ciudad y operación profesional. Cada producto tiene impacto real.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
        }}
      >
        <MUCard title="Productores aliados" gold>
          Red de agricultores que conservan semillas criollas. Precios
          justos y planeación anual de demanda.
        </MUCard>

        <MUCard title="Uso del totomoxtle">
          Aprovechamiento del totomoxtle como elemento narrativo y
          material biodegradable en la operación.
        </MUCard>

        <MUCard title="Educación y cultura">
          Comunicación clara del origen del maíz en cada módulo.
          Cultura gastronómica accesible desde la calle.
        </MUCard>
      </div>
    </>
  );
}
