/* ──────────────────────────────────────────────────────────────
   CONTENIDO ESCOLAR – Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi
   Edita este archivo para actualizar la información del colegio.
   ────────────────────────────────────────────────────────────── */

const SCHOOL = {
  name:     'Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi',
  founded:  1910,
  address:  'La Unión, Región de Los Ríos, Chile',
  phone:    '(064) 2XXX XXX',
  email:    'contacto@industrialfenner.cl',
  rector:   'Sr. Director(a) del Establecimiento',
  utp:      'Jefe(a) de UTP',

  // Coordenadas para el clima – La Unión, Región de Los Ríos
  lat: -40.2939,
  lon: -73.0833,
  weatherCity: 'La Unión, Los Ríos',

  historiaIntro:
    'Bienvenido al Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi, ' +
    'un establecimiento de educación técnico-profesional con profundo arraigo en La Unión, ' +
    'Región de Los Ríos. Nuestra misión es entregar a cada estudiante una formación de ' +
    'excelencia que amplíe sus horizontes y les abra mejores oportunidades para su vida ' +
    'personal, laboral y profesional. Llevamos con orgullo el nombre del Ingeniero Ricardo ' +
    'Fenner Ruedi, cuyo legado de trabajo, esfuerzo y compromiso con el progreso inspira ' +
    'cada día nuestra labor educativa.',

  timeline: [
    { year: 1910, text: 'Fundación del establecimiento como escuela industrial al servicio de La Unión y su comunidad.' },
    { year: 1940, text: 'Ampliación de talleres y consolidación de las primeras especialidades técnicas, fortaleciendo la formación de jóvenes trabajadores.' },
    { year: 1968, text: 'El establecimiento recibe con honor el nombre del Ingeniero Ricardo Fenner Ruedi, en reconocimiento a su invaluable aporte al desarrollo regional.' },
    { year: 1985, text: 'Renovación de infraestructura y equipamiento de talleres, mejorando las condiciones de aprendizaje de nuestros estudiantes.' },
    { year: 2000, text: 'Incorporación de nuevas especialidades en respuesta a las necesidades del mundo laboral y productivo de la región.' },
    { year: 2010, text: 'Obtención del sello Liceo Bicentenario, distinción que reconoce nuestra trayectoria y compromiso con la excelencia técnica.' },
    { year: 2018, text: 'Modernización de talleres con equipamiento de última generación, preparando a nuestros jóvenes para los desafíos de la industria actual.' },
    { year: 2024, text: 'Fortalecimiento de alianzas con empresas de la región, abriendo más y mejores oportunidades de práctica y empleabilidad para nuestros egresados.' },
  ],

  especialidades: [
    {
      icon:  '⚡',
      name:  'Electricidad',
      desc:  'Formamos técnicos competentes en instalaciones eléctricas residenciales, comerciales e industriales, brindándoles herramientas concretas para desempeñarse con éxito en el mundo del trabajo.',
      nivel: 'Técnico de Nivel Medio',
    },
    {
      icon:  '🏠',
      name:  'Edificación',
      desc:  'Preparamos a nuestros estudiantes en construcción, lectura de planos, materialidad y técnicas constructivas modernas, abriendo puertas en uno de los sectores más dinámicos del país.',
      nivel: 'Técnico de Nivel Medio',
    },
    {
      icon:  '🚗',
      name:  'Mecánica Automotriz',
      desc:  'Entregamos formación integral en diagnóstico, mantención y reparación de vehículos, habilitando a los estudiantes para insertarse con confianza en la industria del transporte y los servicios automotrices.',
      nivel: 'Técnico de Nivel Medio',
    },
    {
      icon:  '🏗️',
      name:  'Construcciones Metálicas',
      desc:  'Desarrollamos habilidades en fabricación y montaje de estructuras metálicas y soldadura industrial, dotando a los jóvenes de competencias altamente valoradas en la industria y la construcción.',
      nivel: 'Técnico de Nivel Medio',
    },
    {
      icon:  '🔩',
      name:  'Instalaciones Sanitarias',
      desc:  'Capacitamos a los estudiantes en instalación y mantención de redes de agua potable, alcantarillado y sistemas de calefacción, una especialidad esencial para el bienestar de las comunidades.',
      nivel: 'Técnico de Nivel Medio',
    },
  ],

  horarios: {
    entrada: '08:00',
    salida:  '17:00',
    almuerzo: '13:00 – 14:00',
    secretaria: 'Lunes a Viernes, 08:30 – 17:00',
  },
};
