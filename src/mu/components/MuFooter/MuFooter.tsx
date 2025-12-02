import { muColors } from "../../../design-system/tokens/colors";
import { muSpacing } from "../../../design-system/tokens/spacing";

export function MuFooter() {
  return (
    <footer
      style={{
        background: "#020617",
        color: muColors.textMain,
        padding: "64px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: muSpacing.l,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: muSpacing.xs,
              color: muColors.gold,
            }}
          >
            Maíz Urbano
          </h3>
          <p style={{ opacity: 0.8 }}>
            Fast-casual mexicano con identidad criolla. Sistema diseñado para escalar.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: muSpacing.xs }}>Contacto</h4>
          <p>contacto@maizurbano.com</p>
          <p>WhatsApp: +52 55 1234 5678</p>
        </div>

        <div>
          <h4 style={{ marginBottom: muSpacing.xs }}>Redes</h4>
          <p>Instagram</p>
          <p>TikTok</p>
          <p>Facebook</p>
        </div>

        <div>
          <h4 style={{ marginBottom: muSpacing.xs }}>Legal</h4>
          <p>Aviso de privacidad</p>
          <p>Términos y condiciones</p>
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: muSpacing.l,
          opacity: 0.6,
          fontSize: "12px",
        }}
      >
        © {new Date().getFullYear()} Maíz Urbano. Todos los derechos reservados.
      </p>
    </footer>
  );
}
