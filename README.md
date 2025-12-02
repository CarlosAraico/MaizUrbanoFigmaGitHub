# Maíz Urbano – Landing MU-v4

Landing corporativa modular para Maíz Urbano, lista para Dev Mode en Figma y publicación en GitHub Pages.

## Arquitectura
- `src/design-system`: tokens (`colors`, `typography`, `spacing`) y componentes base (`Button`, `Chip`, `Card`, `Metric`, `SectionShell`).
- `src/mu/components`: bloques de dominio (hero, menú, franquicias, empleo, sucursales, footer).
- `src/mu/landing/MuLanding.tsx`: composición final de la página (Navbar + secciones: Hero, Menú, Origen, Impacto, Trazabilidad, CEDIS, Inversión, Franquicias, Empleo, Sucursales, Footer).
- `src/styles/globals.css`: reset y estilos globales.
- `src/legacy`: código operativo anterior (admin, carrito, login, etc.) aislado y fuera del build.

## Scripts
- `npm run dev` – servidor de desarrollo Vite.
- `npm run build` – build de producción en `dist/`.
- `npm run preview` – previsualiza el build.
- `npm run deploy` – publica `dist/` a GitHub Pages (rama `gh-pages`). `predeploy` ejecuta el build antes.

## GitHub Pages
1. `npm install`
2. `npm run deploy`
3. En GitHub ? Settings ? Pages ? Source: `gh-pages` / root.
4. URL esperada: `https://<usuario>.github.io/MaizUrbanoFigmaGitHub/`.

## Figma (Dev Mode)
- Archivo sugerido: **MU – Design System & Landing v4** con páginas:
  - 01 – Design System (tokens de color/typo alineados a `src/design-system/tokens`).
  - 02 – Landing MU-v4 (secciones en el mismo orden que `MuLanding`).
- Activa Dev Mode y vincula el repo `MaizUrbanoFigmaGitHub` apuntando a `src/mu/landing/MuLanding.tsx` para inspección de props/CSS.
- Navbar en Figma con interacciones “Scroll to” hacia los IDs: `mu-menu`, `mu-franquicias`, `mu-empleo`, `mu-sucursales`, etc.

## Notas
- Encoding forzado a UTF-8 vía `.gitattributes`.
- Dependencias reducidas a React + Vite; el código operativo (admin/facturación/carrito) permanece en `src/legacy` para futuras fases.
