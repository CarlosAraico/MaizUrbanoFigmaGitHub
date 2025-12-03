# ✅ Pull Request Checklist

Por favor asegúrate de completar esta lista antes de hacer merge:

## 📦 Código y dependencias
- [ ] El código nuevo ha sido revisado y probado manualmente
- [ ] Se evitaron cambios innecesarios en `package-lock.json` (si aplica)
- [ ] Se instalaron dependencias nuevas solo si eran estrictamente necesarias
- [ ] Se usó `npm ci` en vez de `npm install` para mantener reproducibilidad

## ⚙️ Automatización (CI / GitHub Actions)
- [ ] Todos los workflows (`inventarios.yml`, `ci.yml`, etc.) corrieron con éxito
- [ ] No se generaron errores de `ngrok` (`ECONNREFUSED`)
- [ ] Si se omitió `ngrok`, fue mediante detección de `process.env.CI === "true"`

## 🔐 Seguridad
- [ ] No se expusieron secretos en `.env` o logs
- [ ] Se generó y subió el archivo SBOM (`sbom-backend.spdx.json`)
- [ ] El escaneo SARIF fue ejecutado y cargado a GitHub

## 🚢 Docker (si aplica)
- [ ] El backend fue compilado correctamente como imagen multi-arquitectura
- [ ] Se generaron etiquetas correctas (`sha-*`, `branch-*`, etc.)
- [ ] Se subieron correctamente a `ghcr.io`

## 🔁 Validaciones funcionales
- [ ] Se validó que el backend responde en `/api/health`
- [ ] Se ejecutaron comandos como `npm run plugin:start -- --no-up --no-e2e` (si PLUGIN_BASE está definido)
- [ ] Se revisó que el tag de Docker generado en metadata esté presente en el push

---

_Actualiza este checklist según la naturaleza del PR. Agrega o quita secciones según corresponda._
