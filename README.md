# WEBTACTIL — Tótem Táctil Liceo Industrial Fenner

Kiosk táctil interactivo para el Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi (La Unión, Región de Los Ríos). Incluye historia del liceo, mapa interactivo del establecimiento, especialidades, logros WorldSkills y el asistente de voz FENNER.

## Ejecutar localmente (modo kiosk)

```
npm install
npm start
```

Abre `http://localhost:3000` en **Chrome o Edge** (necesarios para el reconocimiento de voz).

## Editar contenido

| Qué | Dónde |
|---|---|
| Datos del liceo, especialidades, logros, horarios | `public/js/content.js` |
| Texto de la historia | `public/data/historia.txt` |
| Fotos del slideshow de historia | `public/data/fotoshistoria/` |
| Ubicaciones del mapa (coordenadas) | `public/js/map-locations.js` |
| Respuestas del asistente FENNER | `public/js/assistant.js` |

Tras agregar fotos nuevas, ejecutar `npm run fotos` (las optimiza y actualiza la lista).

Para calibrar coordenadas del mapa: dentro de la sección Mapa, tocar 5 veces seguidas el texto de ayuda para revelar el botón 🎯 de modo debug.

## Deploy en Vercel

El proyecto está preparado para Vercel (plan gratuito): el sitio estático se sirve desde `public/` y la lista de fotos se genera en cada build (`vercel.json`).

1. Subir cambios a GitHub (`git push`).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importar este repositorio.
3. Sin configuración extra — Vercel lee `vercel.json`. Cada `git push` redespliega automáticamente.

Nota: el reconocimiento de voz requiere HTTPS, que Vercel provee por defecto.
