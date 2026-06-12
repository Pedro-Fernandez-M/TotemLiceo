/* ──────────────────────────────────────────────────────────────
   CONTENIDO ESCOLAR – Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi
   Edita este archivo para actualizar la información del colegio.
   ────────────────────────────────────────────────────────────── */

const SCHOOL = {
  name:     'Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi',
  founded:  1996,
  address:  'La Unión, Región de Los Ríos, Chile',
  phone:    '', // Completar con el número real cuando esté disponible
  email:    'contacto@industrialfenner.cl',
  rector:   'Ernesto Uslar Goverts',

  // Coordenadas para el clima – La Unión, Región de Los Ríos
  lat: -40.2939,
  lon: -73.0833,
  weatherCity: 'La Unión, Los Ríos',

  historiaIntro:
    'Bienvenido al Liceo Bicentenario Industrial Ingeniero Ricardo Fenner Ruedi, ' +
    'un establecimiento de educación técnico-profesional de La Unión, Región de Los Ríos, ' +
    'perteneciente a la red nacional SNA Educa. Nuestra misión es entregar a cada estudiante ' +
    'una formación de excelencia que amplíe sus horizontes y les abra mejores oportunidades ' +
    'para su vida personal, laboral y profesional. Llevamos con orgullo el nombre del ' +
    'Ingeniero Ricardo Fenner Ruedi, cuyo sueño de crear un liceo industrial para los ' +
    'jóvenes del sur de Chile inspira cada día nuestra labor educativa.',

  timeline: [
    { year: 1994, text: 'La familia de don Ricardo Fenner Ruedi crea la Fundación Ricardo Fenner Ruedi, materializando su sueño de un liceo industrial para los jóvenes del sur de Chile.' },
    { year: 1995, text: 'El proyecto es presentado al Ministerio de Educación con una prematrícula de 90 estudiantes, bajo la administración de CODESSER, hoy SNA Educa.' },
    { year: 1996, text: 'Inicio oficial de las actividades académicas con 90 estudiantes. El 11 de abril el establecimiento obtiene su reconocimiento oficial.' },
    { year: 1997, text: 'El liceo se traslada a sus dependencias definitivas, con pabellones de clases, talleres técnicos, internado y comedor.' },
    { year: 2012, text: 'Comienza la destacada participación en WorldSkills y se obtiene la certificación ambiental de excelencia.' },
    { year: 2018, text: 'Primer lugar en las Olimpiadas Nacionales de Mecatrónica FESTO, abriendo formación internacional en industria 4.0.' },
    { year: 2019, text: 'Integración a la red de Liceos Bicentenario de Excelencia, con el puntaje más alto a nivel nacional.' },
    { year: 2025, text: 'Medalla de plata en electricidad KNX y bronce en robótica en WorldSkills Américas. Hoy el liceo supera los 900 estudiantes.' },
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
