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

  // Centro de Innovación – espacio destacado dentro de "Talleres"
  // (texto base según la historia oficial; ajústalo con la información real)
  centroInnovacion: {
    logo: 'assets/logo-innovacion.png',
    name: 'Centro de Innovación',
    desc: 'Espacio equipado con laboratorios de robótica, electromovilidad, domótica, ' +
          'automatización y programación, donde nuestros estudiantes desarrollan proyectos ' +
          'de industria 4.0 y entrenan para competencias nacionales e internacionales como WorldSkills.',
    badge: 'Industria 4.0 · Tecnología',
  },

  // Logros del liceo (fuente: documento "Logros y trayectoria hasta 2026")
  logros: {
    intro:
      'En más de 30 años de historia, nuestra Unidad Educativa se ha transformado en un ' +
      'referente de la formación técnica del sur de Chile, con hitos en la excelencia académica, ' +
      'la innovación, las competencias técnicas y el compromiso con la comunidad.',

    // Medallero WorldSkills Chile (desde 2016)
    medallero: [
      { skill:'Robótica Móvil',      icon:'🤖', oro:7, plata:1, bronce:1, extra:'2 veces «Mejor de los Mejores»' },
      { skill:'Electricidad KNX',    icon:'⚡', oro:5, plata:1, bronce:0, extra:'2 veces «Mejor de los Mejores»' },
      { skill:'Soldadura',           icon:'🔥', oro:1, plata:2, bronce:1, extra:'1 medalla de excelencia' },
      { skill:'Fontanería',          icon:'🚰', oro:0, plata:3, bronce:0 },
      { skill:'Edificación',         icon:'🏗️', oro:1, plata:0, bronce:0 },
      { skill:'Tecnología Mecánica', icon:'⚙️', oro:0, plata:0, bronce:1, extra:'1 medalla de excelencia' },
    ],
    destacado:
      '🏆 WorldSkills Américas 2025 (Chile): medalla de plata en Electricidad KNX y ' +
      'medalla de bronce en Robótica Móvil. Ambos equipos aseguraron cupo directo al ' +
      'Mundial WorldSkills 2026 en Shanghái, China.',

    // Categorías de logros más allá de WorldSkills
    categorias: [
      {
        icon: '🌐', titulo: 'Trayectoria WorldSkills',
        items: [
          '2012: 4° lugar en Electricidad en WorldSkills Américas (Sao Paulo, Brasil), detrás de EE.UU., Canadá y Brasil.',
          '2014: reconocimiento al Mejor Técnico de la Delegación Chilena en WorldSkills Américas (Bogotá, Colombia).',
          '2015: participación en el Mundial WorldSkills (Brasil), compitiendo en Electricidad junto a 60 países.',
          '2016–2018: pódium sistemático a nivel nacional en Electricidad, Construcciones Metálicas e Instalaciones Sanitarias.',
          '2018: Primer Lugar Nacional en Robótica en su primera participación.',
          '2 docentes han representado a Chile como Expertos WorldSkills en Soldadura y Tecnología Mecánica (EE.UU. y Francia).',
        ],
      },
      {
        icon: '🎓', titulo: 'Excelencia Académica',
        items: [
          'Dos décadas de Excelencia Académica reconocidas por sus resultados en el SIMCE; distinguido como «Liceo Exitoso» por el MINEDUC.',
          'Acreditación de las especialidades técnicas por Chile Califica (2005–2010): Construcciones Metálicas, Mecánica Automotriz, Electricidad e Instalaciones Sanitarias.',
          'Liceo Bicentenario de Excelencia desde 2019, con el puntaje más alto a nivel nacional en su postulación.',
          'Reconocimiento SUPÉRATE 2016 (INACAP y Revista Qué Pasa) por el progreso escolar en la Región de Los Ríos.',
          'Nivel de Desempeño Alto de la Agencia de Calidad en 2016, 2017 y 2018.',
        ],
      },
      {
        icon: '🏅', titulo: 'Competencias SNA Educa',
        items: [
          'Robótica: 1° Lugar Nacional en 2024.',
          'Debate: 16 versiones — 2 primeros, 7 segundos y 3 terceros lugares.',
          'Folclore: 14 versiones — 7 primeros, 2 segundos y 1 tercer lugar.',
          'Olimpiada de Matemática: 10 versiones — 4 primeros, 3 segundos y 1 tercer lugar.',
        ],
      },
      {
        icon: '💡', titulo: 'Innovación y Tecnología',
        items: [
          '1° Lugar en las Olimpiadas Nacionales de Mecatrónica FESTO (2018), con capacitación en industria 4.0 en FESTO Sao Paulo, Brasil (2019).',
          'Sello Bicentenario enfocado en innovación y tecnología: automatización, programación y electromovilidad.',
        ],
      },
      {
        icon: '🌱', titulo: 'Medio Ambiente',
        items: [
          'Certificación Ambiental de Excelencia desde 2012 (SEREMI y Ministerio de Medio Ambiente).',
          'Reconocimiento por el mejoramiento en la gestión de residuos peligrosos (Ministerio de Medio Ambiente, en cooperación con el Gobierno Alemán).',
          'Premio Regional a la Gestión Medioambiental 2013, categoría Establecimientos Educacionales.',
          'Premios Latinoamérica Verde 2016: 1° nacional y 6° latinoamericano en categoría Energía, con el proyecto Sistema Solar para Agua Caliente Sanitaria.',
        ],
      },
      {
        icon: '🌎', titulo: 'Internacionalización',
        items: [
          '25 docentes en pasantías en EE.UU., Brasil, Colombia, Inglaterra, Suiza, Alemania, España, Francia, Corea y País Vasco.',
          '19 estudiantes han representado al liceo en el extranjero: WorldSkills Américas, APEC Youth Skills Camp (China) y pasantías SENA Colombia, entre otras.',
        ],
      },
      {
        icon: '🤝', titulo: 'Vinculación con la Comunidad',
        items: [
          'Reconocimiento de SECREDUC y DEPROVEDUC del Ranco por el aporte a la calidad y equidad en la educación (2012).',
          'Participación y compromiso en la realización de la Expo TP (2015).',
          'Reconocimiento por la destacada contribución a la Educación Técnico Profesional en la Provincia del Ranco (2016).',
          'Programa Academia ACCESS de inglés para estudiantes, en convenio entre SNA Educa y la Embajada de Estados Unidos (2015–2016).',
        ],
      },
      {
        icon: '📚', titulo: 'Investigación y Publicaciones',
        items: [
          'Libro «Claves en Educación Técnico Profesional: 10 Modelos a replicar», publicado por Fundación Libertad y Desarrollo (2013).',
          'Participación en el estudio del CIAE «Comprendiendo el Mejoramiento Sostenido en Educación Secundaria» (2017).',
          'Levantamiento de Práctica Pedagógica Exitosa por la Agencia de Calidad sobre Desarrollo de Habilidades Comunicacionales (2018).',
        ],
      },
      {
        icon: '⚽', titulo: 'Deporte',
        items: [
          'Selecciones de básquetbol, fútbol, futsal, vóleibol, handball, tenis de mesa y atletismo, con presencia constante en el pódium de los Juegos Escolares del IND.',
        ],
      },
      {
        icon: '📈', titulo: 'Crecimiento e Infraestructura',
        items: [
          'De 90 estudiantes en 1996 a más de 900 en 2026, distribuidos en 23 cursos de enseñanza media.',
          'Internado con 443 estudiantes; el Internado de Damas, inaugurado en 2018, cuenta con capacidad para 78.',
          'Parte de la Red Futuro TP de la Región de Los Ríos desde 2024, red colaborativa de la Educación Media Técnico Profesional.',
        ],
      },
    ],
  },

  horarios: {
    entrada: '08:00',
    salida:  '17:00',
    almuerzo: '13:00 – 14:00',
    secretaria: 'Lunes a Viernes, 08:30 – 17:00',
  },
};
