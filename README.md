# WEBTACTIL — Tótem Táctil · Liceo Industrial Fenner

Kiosco táctil interactivo para el **Liceo Bicentenario Industrial Ingeniero Ricardo
Fenner Ruedi** (La Unión, Región de Los Ríos, Chile). Pensado para instalarse en un
computador con **pantalla táctil** en la entrada del establecimiento: informa a
visitas, apoderados y futuros estudiantes, y funciona de forma autónoma y sin
conexión permanente a internet.

🔗 **En producción:** https://totem-liceo.vercel.app

---

## 📑 Índice

- [¿Qué hace el tótem?](#-qué-hace-el-tótem)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Ejecutar localmente](#-ejecutar-localmente)
- [Editar el contenido](#-editar-el-contenido)
- [Despliegue (Vercel)](#-despliegue-vercel)
- [Instalación en el equipo del tótem](#-instalación-en-el-equipo-del-tótem)

---

## 🖥️ ¿Qué hace el tótem?

Una aplicación web de pantalla completa, controlada por toque, con estas secciones:

| Sección | Descripción |
|---|---|
| **Pantalla de inicio** | Reloj, logos y fondo con fotos del liceo que rotan junto a mensajes destacados para atraer a quien pasa. Al tocar, entra a la aplicación. |
| **Nuestra Historia** | Reseña histórica con desplazamiento automático y galería de fotos con visor a pantalla completa. |
| **Mapa del Establecimiento** | Plano interactivo con desplazamiento, zoom y pellizco; ubicaciones agrupadas por categoría, buscador con **teclado en pantalla** y panel de **emergencias** (redes húmedas, grifos, DEA). |
| **Talleres** | Las 5 especialidades técnicas + el Centro de Innovación. Cada taller abre una ficha con descripción, resultados en competencias y galería de fotos deslizable. |
| **Logros del Liceo** | Medallero WorldSkills y trayectoria por categorías (excelencia académica, competencias SNA, medio ambiente, innovación, deporte, etc.). |
| **Admisión y Postulación** | Fechas, requisitos, especialidades, beneficios y contacto para futuros estudiantes. |
| **Asistente FENNER** | Asistente por **voz** y por **preguntas frecuentes tocables**. Responde ubicaciones (abre el mapa), historia, especialidades, matrícula, y calcula fecha/hora/operaciones sin internet. |

**Características de kiosco:**

- **Funciona sin internet** tras la primera carga (PWA con Service Worker).
- **Modo reposo** a los 2,5 min con aviso "¿Sigues ahí?" antes de volver al inicio.
- **Blindaje táctil**: sin menú contextual, sin zoom por gesto, sin selección de texto.
- **Objetivos grandes** y textos amplios pensados para lectura de pie.

---

## 🛠️ Tecnologías

Aplicación **SPA estática, sin framework y sin paso de build en el frontend**.

**Frontend**
- **HTML5 + CSS3 + JavaScript (ES6+) puro** — sin React/Vue ni bundler.
- **CSS a mano**: variables CSS, Grid, Flexbox, tema oscuro y animaciones.
- Interacciones táctiles, mapa con pan/zoom/pinch y teclado en pantalla, todo en JS propio.

**Capacidades del navegador**
- **PWA**: Service Worker (`sw.js`, caché *cache-first*) + `manifest.json` → uso offline.
- **Web Speech API**: `SpeechRecognition` (voz→texto, requiere internet) y
  `SpeechSynthesis` (texto→voz, local).

**Datos**
- Contenido en objetos JavaScript (`content.js`, `map-locations.js`) — **sin base de datos**.

**Backend / hosting**
- **Node.js + Express** (`server.js`) — solo para desarrollo local.
- **Vercel** — hosting estático con CDN y HTTPS en producción.
- **Git + GitHub** — cada `push` redespliega automáticamente.

**Herramientas de desarrollo**
- **sharp** — optimización de imágenes (scripts, solo en desarrollo).
- **Chrome en modo kiosco** — carcasa de pantalla completa en el equipo físico.

---

## 📂 Estructura del proyecto

```
WEBTACTIL/
├── server.js                # Servidor Express (solo desarrollo local)
├── vercel.json              # Configuración de despliegue en Vercel
├── package.json             # Scripts y dependencias de desarrollo
├── scripts/                 # Utilidades de build (Node)
│   ├── optimizar-fotos.js       # Optimiza fotos de historia
│   ├── optimizar-talleres.js    # Optimiza fotos de talleres
│   └── generar-fotos-json.js    # Genera la lista de fotos (build)
└── public/                  # Todo el sitio (lo que se publica)
    ├── index.html               # Estructura de la aplicación
    ├── manifest.json            # Manifiesto PWA
    ├── sw.js                    # Service Worker (offline)
    ├── css/styles.css           # Todos los estilos
    ├── js/
    │   ├── app.js               # Lógica principal (navegación, mapa, idle…)
    │   ├── content.js           # CONTENIDO EDITABLE del liceo
    │   ├── map-locations.js     # Ubicaciones y coordenadas del mapa
    │   └── assistant.js         # Asistente FENNER
    ├── data/
    │   ├── historia.txt         # Texto de la historia
    │   └── fotoshistoria/       # Fotos del slideshow de historia
    └── assets/
        ├── mapa.png             # Plano del establecimiento
        ├── logo-*.png           # Escudo, SNA Educa, Centro de Innovación
        ├── menu/                # Fondos de los botones del menú
        └── talleres/            # Fotos de cada especialidad
```

---

## ▶️ Ejecutar localmente

Requiere **Node.js 18+**.

```bash
npm install
npm start
```

Abre `http://localhost:3000` en **Chrome o Edge** (necesarios para el reconocimiento de voz).

| Script | Qué hace |
|---|---|
| `npm start` | Levanta el servidor local en el puerto 3000. |
| `npm run dev` | Igual, recargando al guardar cambios. |
| `npm run fotos` | Optimiza las fotos y regenera la lista de fotos de historia. |

---

## ✏️ Editar el contenido

| Qué quieres cambiar | Dónde |
|---|---|
| Datos del liceo, especialidades, logros, admisión, horarios | `public/js/content.js` |
| Texto de la historia | `public/data/historia.txt` |
| Fotos del slideshow de historia | `public/data/fotoshistoria/` |
| Fotos de los talleres | `public/assets/talleres/` |
| Ubicaciones y coordenadas del mapa | `public/js/map-locations.js` |
| Respuestas del asistente FENNER | `public/js/assistant.js` |
| Mensajes/fotos de la pantalla de inicio | `ATTRACT` en `public/js/app.js` |

**Notas:**

- Tras agregar fotos nuevas, ejecuta `npm run fotos` (las optimiza y actualiza la lista).
- Para **calibrar coordenadas** del mapa: dentro de la sección Mapa, toca **5 veces**
  seguidas el texto de ayuda para revelar el botón 🎯 de modo debug; luego toca en el
  plano y copia las coordenadas que muestra.
- Al hacer `git push`, los cambios aparecen solos en el tótem (se actualiza desde Vercel).

---

## 🚀 Despliegue (Vercel)

El proyecto se sirve como **sitio estático** desde `public/`; un pequeño *build step*
genera la lista de fotos (`vercel.json`).

1. Sube los cambios a GitHub: `git push`.
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa este repositorio.
3. Sin configuración extra: Vercel lee `vercel.json`. **Cada `git push` redespliega solo.**

> El reconocimiento de voz requiere HTTPS, que Vercel entrega por defecto.

---

## 🏫 Instalación en el equipo del tótem

El equipo del tótem **no necesita los archivos del proyecto**: solo **Google Chrome** y
un lanzador que abre la web de Vercel en modo kiosco a pantalla completa.

Ver la carpeta de instalación (`Totem-Kiosko.bat` / `.ps1`) y su `INSTRUCCIONES.txt`:

1. Copiar la carpeta de instalación al PC del tótem.
2. Con internet, abrir `Totem-Kiosko.bat` una vez (para que guarde todo para uso offline).
3. Activar el inicio automático para que arranque solo al encender el equipo.

Para **salir** del modo kiosco: `Alt + F4`.
