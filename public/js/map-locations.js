/**
 * MAPA DE UBICACIONES – Liceo Bicentenario Industrial Ricardo Fenner Ruedi
 *
 * x, y  → porcentaje sobre el ancho/alto de la imagen original
 *          (0 = borde izquierdo/superior · 100 = borde derecho/inferior)
 * zoom  → nivel de acercamiento al navegar (2 = suave · 5 = detalle)
 *
 * ✅ = coordenadas calibradas con modo debug
 * ⏳ = coordenadas aproximadas, pendiente de calibración
 */

const MAP_LOCATIONS = [
  // ── ADMINISTRACIÓN ─────────────────────────────────────────────────
  { id:'oficina-director',  label:'Oficina Director',         category:'admin',    icon:'👤', x:52.58, y:92.95, zoom:5 }, // ✅
  { id:'secretaria',        label:'Secretaría',               category:'admin',    icon:'📝', x:55.08, y:92.64, zoom:5 }, // ✅
  { id:'utp',               label:'UTP',                      category:'admin',    icon:'📋', x:63.19, y:94.34, zoom:5 }, // ✅
  { id:'sala-profesores',   label:'Sala de Profesores',       category:'admin',    icon:'👨‍🏫', x:62.58, y:87.96, zoom:5 }, // ✅
  { id:'oficina-pie',       label:'Oficina PIE',              category:'admin',    icon:'🤝', x:23.89, y:70.61,  zoom:5 }, // ⏳
  { id:'contabilidad',      label:'Contabilidad',             category:'admin',    icon:'💼', x:53.13, y:89.61,  zoom:5 }, // ⏳

  // ── ACADÉMICO ──────────────────────────────────────────────────────
  { id:'cra',               label:'CRA',                      category:'academic', icon:'📚', x:54.13, y:83.16, zoom:5 }, // ✅
  { id:'lab-ingles',        label:'Laboratorio de Inglés',    category:'academic', icon:'🗣️', x:62.86, y:85.21, zoom:5 }, // ✅
  { id:'lab-ciencias',      label:'Laboratorio de Ciencias',  category:'academic', icon:'🔬', x:62.94, y:81.85, zoom:5 }, // ✅
  { id:'multiuso',          label:'Multiuso',                 category:'academic', icon:'🏫', x:94.02, y:79.99, zoom:4 }, // ✅
  { id:'auditorio',         label:'Auditorio',                category:'academic', icon:'🎭', x:56.86, y:63.38,  zoom:5 }, // ⏳
  { id:'centro-innovacion', label:'Centro de Innovación',     category:'academic', icon:'💡', x:49.89,  y:70.84,  zoom:5 }, // ⏳
  { id:'taller-electricidad',             label:'Taller Electricidad',               category:'workshop', icon:'⚡', x:39.81, y:46.84, zoom:4 }, // ⏳
  { id:'taller-mecanica',                 label:'Taller Mecánica',                   category:'workshop', icon:'⚙️', x:22.72, y:50.28, zoom:4 }, // ⏳
  { id:'taller-edificacion',              label:'Taller Edificación',                category:'workshop', icon:'🏗️', x:30.24, y:51.79, zoom:4 }, // ⏳
  { id:'taller-instalaciones-sanitarias', label:'Taller Instalaciones Sanitarias',   category:'workshop', icon:'🚰', x:30.95, y:44.50, zoom:4 }, // ⏳
  { id:'taller-estructuras-metalicas',    label:'Taller Estructuras Metálicas',      category:'workshop', icon:'🏭', x:31.23, y:33.43, zoom:4 },

  // ── TALLERES / PABELLONES ──────────────────────────────────────────
  { id:'pabellon-a',        label:'Pabellón A',               category:'workshop', icon:'🔧', x:64.32, y:72.00, zoom:4 }, // ✅
  { id:'pabellon-b',        label:'Pabellón B',               category:'workshop', icon:'🔧', x:73.60, y:70.50, zoom:4 }, // ✅
  { id:'pabellon-c',        label:'Pabellón C',               category:'workshop', icon:'🔧', x:71.91, y:83.83, zoom:4 }, // ✅
  { id:'pabellon-d',        label:'Pabellón D',               category:'workshop', icon:'🔧', x:83.34, y:70.32, zoom:4 }, // ✅
  { id:'pabellon-e',        label:'Pabellón E',               category:'workshop', icon:'🔧', x:92.89, y:68.48, zoom:4 }, // ✅
  { id:'pabellon-f',        label:'Pabellón F',               category:'workshop', icon:'🔧', x:85.37, y:80.89, zoom:4 }, // ✅
 

  // ── ALIMENTACIÓN ───────────────────────────────────────────────────
  { id:'comedor-externo',   label:'Comedor Externo',          category:'food',     icon:'🪑', x:32.0,  y:39.0,  zoom:4 }, // ⏳
  { id:'comedor-interno',   label:'Comedor Interno',          category:'food',     icon:'🍽️', x:34.5,  y:39.0,  zoom:4 }, // ⏳
  { id:'cocina',            label:'Cocina',                   category:'food',     icon:'👨‍🍳', x:32.0,  y:43.0,  zoom:5 }, // ⏳
  { id:'casino',            label:'Casino',                   category:'food',     icon:'🍲', x:33.5,  y:47.0,  zoom:5 }, // ⏳

  // ── SERVICIOS ──────────────────────────────────────────────────────
  { id:'banos-1',           label:'Baños',                    category:'services', icon:'🚻', x:37.63, y:68.70, zoom:5 }, // ⏳
  { id:'banos-2',           label:'Baños',                    category:'services', icon:'🚻', x:26.45, y:66.97, zoom:5 }, // ⏳
  { id:'banos-3',           label:'Baños',                    category:'services', icon:'🚻', x:5.79,  y:13.67, zoom:5 }, // ⏳


  // ── EMERGENCIAS ────────────────────────────────────────────────────
  { id:'equipo-dea',        label:'Equipo DEA',               category:'emergency',icon:'🫀', x:65.49, y:76.90, zoom:5 }, // ✅
  { id:'equipo-dea-2',      label:'Equipo DEA',               category:'emergency',icon:'🫀', x:10.76, y:19.32, zoom:5 }, // ✅
  { id:'ps-patio-saesa',    label:'P.S. Patio Saesa',         category:'emergency',icon:'🟢', x:14.0,  y:30.5,  zoom:4 }, // ⏳
  { id:'red-humeda-1',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:57.86, y:87.70, zoom:4 }, // ✅
  { id:'red-humeda-2',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:57.97, y:81.11, zoom:4 }, // ✅
  { id:'red-humeda-3',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:65.57, y:78.27, zoom:4 }, // ✅
  { id:'red-humeda-4',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:70.08, y:76.52, zoom:4 }, // ✅
  { id:'red-humeda-5',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:82.72, y:75.25, zoom:4 }, // ✅
  { id:'red-humeda-6',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:27.03, y:66.84, zoom:4 }, // ✅
  { id:'red-humeda-7',      label:'Red Húmeda',               category:'emergency',icon:'🚰', x:44.21, y:51.77, zoom:4 }, // ✅
  { id:'grifos-1',          label:'Grifos Contra Incendio',   category:'emergency',icon:'🚒', x:14.36, y:44.16, zoom:4 }, // ✅
  { id:'grifos-2',          label:'Grifos Contra Incendio',   category:'emergency',icon:'🚒', x:82.23, y:87.65, zoom:4 }, // ✅
  { id:'grifos-3',          label:'Grifos Contra Incendio',   category:'emergency',icon:'🚒', x:57.66, y:43.91, zoom:4 }, // ✅
  { id:'salida-emergencia', label:'Salida de Emergencia',     category:'emergency',icon:'🚪', x:29.0,  y:78.0,  zoom:3 }, // ⏳
];

const MAP_CATEGORIES = {
  admin:     { label:'Administración', icon:'🏢' },
  academic:  { label:'Académico',      icon:'📘' },
  food:      { label:'Alimentación',   icon:'🍽️' },
  workshop:  { label:'Talleres',       icon:'⚙️'  },
  services:  { label:'Servicios',      icon:'🚻' },
  emergency: { label:'Emergencias',    icon:'🚨' },
};

// IDs que se muestran en el panel de emergencia
const MAP_EMERGENCY_IDS = [
  'equipo-dea',
  'equipo-dea-2',
  'ps-patio-saesa',
  'red-humeda-1',
  'red-humeda-2',
  'red-humeda-3',
  'red-humeda-4',
  'red-humeda-5',
  'red-humeda-6',
  'red-humeda-7',
  'grifos-1',
  'grifos-2',
  'grifos-3',
  'salida-emergencia'
];
