/* ──────────────────────────────────────────────────────────────
   FENNER – Asistente Virtual
   Reconocimiento de voz (Web Speech API) + Síntesis de voz (TTS)
   Requiere Chrome / Edge para reconocimiento de voz.
   ────────────────────────────────────────────────────────────── */

class FennerAssistant {
  constructor() {
    this.synth        = window.speechSynthesis;
    this.recognition  = null;
    this.isListening  = false;
    this.voices       = [];
    this.historiaText = '';

    this._responseTimer = null;

    this._loadVoices();
    this._initRecognition();
    this._fetchHistoria(); // async, fire-and-forget
    this.kb = this._buildKnowledgeBase();
  }

  // ── CARGAR HISTORIA DESDE ARCHIVO ─────────────────────────────
  async _fetchHistoria() {
    try {
      const r = await fetch('/data/historia.txt');
      if (r.ok) this.historiaText = await r.text();
    } catch (_) {}
  }

  // ── RECONOCIMIENTO DE VOZ ──────────────────────────────────────
  _initRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      const btn = document.getElementById('speak-btn');
      btn.disabled = true;
      btn.querySelector('#speak-lbl').textContent = 'Voz no disponible (usa Chrome)';
      document.querySelector('.ast-hint').textContent =
        'Reconocimiento de voz requiere Chrome o Edge';
      return;
    }

    this.recognition = new SR();
    this.recognition.lang            = 'es-CL';
    this.recognition.continuous      = false;
    this.recognition.interimResults  = false;
    this.recognition.maxAlternatives = 3;

    this.recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      this._handleInput(text);
    };

    this.recognition.onerror = (e) => {
      this._setIdle();
      if (e.error === 'no-speech')   this._respond('No logré escucharte. ¿Podrías intentarlo de nuevo, por favor?');
      if (e.error === 'not-allowed') this._respond('Para poder escucharte necesito acceso al micrófono. Por favor, concede el permiso cuando el navegador lo solicite.');
    };

    this.recognition.onend = () => this._setIdle();
  }

  // ── VOCES TTS ──────────────────────────────────────────────────
  _loadVoices() {
    const load = () => { this.voices = this.synth.getVoices(); };
    load();
    this.synth.addEventListener('voiceschanged', load);
  }

  _pickVoice() {
    return (
      this.voices.find(v => v.lang === 'es-CL' && v.localService) ||
      this.voices.find(v => v.lang === 'es-CL') ||
      this.voices.find(v => v.lang.startsWith('es') && v.localService) ||
      this.voices.find(v => v.lang.startsWith('es')) ||
      null
    );
  }

  // ── TOGGLE ─────────────────────────────────────────────────────
  toggle() {
    if (this.isListening) {
      this._setIdle();
      try { this.recognition.stop(); } catch(_) {}
    } else {
      this._startListening();
    }
  }

  _startListening() {
    if (!this.recognition) return;
    if (this.synth.speaking) this.synth.cancel();

    this.isListening = true;
    document.getElementById('speak-btn').classList.add('is-listening');
    document.getElementById('speak-lbl').textContent = 'Toca para detener';
    document.getElementById('listening-bar').classList.remove('hidden');
    document.getElementById('ast-status').textContent = 'Escuchando…';
    document.getElementById('ast-dot').className = 'ast-dot dot-listening';

    try { this.recognition.start(); } catch(_) { this._setIdle(); }
    if (window.resetIdleTimer) window.resetIdleTimer();
  }

  _setIdle() {
    this.isListening = false;
    document.getElementById('speak-btn').classList.remove('is-listening');
    document.getElementById('speak-lbl').textContent = 'Hablar con FENNER';
    document.getElementById('listening-bar').classList.add('hidden');
    document.getElementById('ast-status').textContent = 'Listo para ayudarte';
    document.getElementById('ast-dot').className = 'ast-dot dot-idle';
  }

  // ── PREGUNTA TOCABLE (preguntas frecuentes) ───────────────────
  ask(text) {
    if (this.isListening) { this._setIdle(); try { this.recognition.stop(); } catch(_) {} }
    this._handleInput(text);
  }

  // ── PROCESAR ENTRADA ───────────────────────────────────────────
  _handleInput(text) {
    this._addMessage(text, 'user');
    if (this.synth.speaking) this.synth.cancel();
    clearTimeout(this._responseTimer);
    const answer = this._match(text.toLowerCase());
    this._responseTimer = setTimeout(() => {
      Promise.resolve(answer).then(a => this._respond(a));
    }, 380);
  }

  _respond(text) {
    this._addMessage(text, 'bot');
    this._speak(text);
  }

  _addMessage(text, who) {
    const log  = document.getElementById('chat-log');
    const time = new Date().toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });
    const div  = document.createElement('div');
    div.className = `msg msg-${who}`;
    div.innerHTML = `<div class="bubble">${text}</div><span class="msg-time">${time}</span>`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  _speak(text) {
    if (!this.synth) return;
    this.synth.cancel();

    const utt    = new SpeechSynthesisUtterance(text);
    utt.lang     = 'es-CL';
    utt.rate     = 0.95;
    utt.pitch    = 1;
    utt.volume   = 1;
    const v = this._pickVoice();
    if (v) utt.voice = v;

    utt.onstart = () => {
      document.getElementById('ast-status').textContent = 'Hablando…';
      document.getElementById('ast-dot').className = 'ast-dot dot-speaking';
    };
    utt.onend = utt.onerror = () => {
      document.getElementById('ast-status').textContent = 'Listo para ayudarte';
      document.getElementById('ast-dot').className = 'ast-dot dot-idle';
    };

    this.synth.speak(utt);
  }

  // ── UBICACIÓN EN EL MAPA ──────────────────────────────────────
  _matchLocation(t) {
    const norm = t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const locWords = ['donde','ubic','como llego','esta la','esta el','encuentro','hallo','busco','necesito llegar'];
    if (!locWords.some(w => norm.includes(w))) return null;

    // Pregunta por el liceo mismo → entregar la dirección, no el plano interno
    if (['liceo','colegio','establecimiento','escuela'].some(w => norm.includes(w))) {
      return `El Liceo se encuentra ubicado en ${SCHOOL.address}. ` +
             `Si buscas un lugar dentro del establecimiento, también puedo mostrártelo en el mapa.`;
    }

    const sectorDesc = {
      admin:     'en el sector administrativo del establecimiento',
      academic:  'en el sector académico del establecimiento',
      food:      'en el sector de alimentación del establecimiento',
      workshop:  'en el sector de talleres del establecimiento',
      services:  'dentro del establecimiento',
      emergency: 'dentro del establecimiento',
    };

    if (typeof MAP_LOCATIONS !== 'undefined') {
      for (const loc of MAP_LOCATIONS) {
        const ln = loc.label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        const words = ln.split(/\s+/).filter(w => w.length > 2);
        if (words.some(w => norm.includes(w))) {
          this._openAndHighlight(loc.id);
          const sector = sectorDesc[loc.category] || 'en el establecimiento';
          return `${loc.label} se encuentra ${sector}. Te lo estoy mostrando en el mapa.`;
        }
      }
    }

    // Fallback con palabras clave compuestas
    const extras = [
      { id:'comedor-externo',   kw:['comedor','almuerzo'],              name:'El Comedor',             sector:'en el sector de alimentación' },
      { id:'taller-mecanica',   kw:['mecanica','automotriz'],           name:'El Taller de Mecánica',  sector:'en el sector de talleres' },
      { id:'taller-electricidad',kw:['electricidad','electric'],        name:'El Taller de Electricidad', sector:'en el sector de talleres' },
      { id:'centro-innovacion', kw:['innovaci','centro inn'],           name:'El Centro de Innovación',sector:'en el sector académico' },
      { id:'oficina-director',  kw:['director','secretar'],             name:'La Dirección',           sector:'en el sector administrativo' },
      { id:'cra',               kw:['biblioteca','cra','libro'],        name:'El CRA',                 sector:'en el sector académico' },
    ];
    for (const z of extras) {
      if (z.kw.some(k => norm.includes(k))) {
        this._openAndHighlight(z.id);
        return `${z.name} se encuentra ${z.sector}. Te lo estoy mostrando en el mapa.`;
      }
    }

    // Sin ubicación específica: abrir el mapa
    if (typeof openSection === 'function') openSection('mapa');
    return 'Aquí tienes el plano del establecimiento. ' +
           'Puedes usar el buscador del panel lateral para encontrar cualquier espacio.';
  }

  _openAndHighlight(zoneId) {
    if (typeof openSection === 'function') openSection('mapa');
    setTimeout(() => {
      if (typeof window.highlightMapZone === 'function') window.highlightMapZone(zoneId);
    }, 480);
  }

  // ── BASE DE CONOCIMIENTO ───────────────────────────────────────
  _match(t) {
    // El tótem no entrega información del clima
    const climaKw = ['clima','temperatura','lluvia','llover','calor','frío','frio'];
    if (climaKw.some(k => t.includes(k))) {
      return 'La información del clima no está disponible en este tótem. ' +
             '¿Te puedo ayudar con una ubicación, las especialidades o la historia del liceo?';
    }

    // Location queries: "dónde está X", "dónde queda X", etc.
    const loc = this._matchLocation(t);
    if (loc) return loc;

    // Historia: responde con extracto del archivo historia.txt
    const histKw = ['historia','fundación','fundacion','fundado','creado','origen',
                    'comenzó','cuántos años','cuando fue','desde cuando','trayectoria',
                    'antiguo','antigua','legado','fenner ruedi'];
    if (histKw.some(k => t.includes(k))) return this._historiaResponse();

    // Logros / WorldSkills: responde y abre la sección en pantalla
    const lgKw = ['worldskills','world skills','medalla','logro','premio','reconocimiento','campeon','campeón'];
    if (lgKw.some(k => t.includes(k))) {
      if (typeof openSection === 'function') openSection('logros');
      const tot = SCHOOL.logros.medallero.reduce(
        (a, m) => ({ oro: a.oro + m.oro, plata: a.plata + m.plata, bronce: a.bronce + m.bronce }),
        { oro: 0, plata: 0, bronce: 0 });
      return `Desde 2012 nuestro liceo ha obtenido ${tot.oro} medallas de oro, ` +
             `${tot.plata} de plata y ${tot.bronce} de bronce en competencias WorldSkills, ` +
             `destacando en robótica móvil y electricidad KNX. ` +
             `Te estoy mostrando el medallero completo en pantalla.`;
    }

    for (const item of this.kb) {
      if (item.kw.some(k => t.includes(k))) return item.r;
    }
    return this._fallback(t);
  }

  _historiaResponse() {
    if (this.historiaText) {
      const firstPara = this.historiaText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 40 && !/^[A-ZÁÉÍÓÚÑ\s·]+$/.test(l))
        .shift() || '';
      if (firstPara) {
        const excerpt = firstPara.length > 220 ? firstPara.slice(0, 220) + '…' : firstPara;
        return `${excerpt} Te invito a tocar "Nuestra Historia" en el menú para conocer toda nuestra trayectoria.`;
      }
    }
    return `El ${SCHOOL.name} inició sus actividades en ${SCHOOL.founded} en la ciudad de La Unión, Región de Los Ríos, ` +
      `gracias al impulso de la Fundación Ricardo Fenner Ruedi. Desde entonces hemos formado generaciones de técnicos ` +
      `comprometidos con el desarrollo del país. Te invito a tocar "Nuestra Historia" en el menú para conocer más.`;
  }

  _fallback(t) {
    const norm = (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    // Pregunta específica sin datos → no inventar nada
    const specificQ = [
      'cuanto','cuanta','cuantos','cuantas','quien','quienes',
      'cuando','cual','cuales','por que','porque',
      'que es','que significa','que hace','me puede decir',
    ];
    if (specificQ.some(q => norm.includes(q))) {
      return 'No tengo esa información en los datos cargados del liceo. ' +
             'Te recomiendo consultar directamente en secretaría del establecimiento.';
    }

    // Consulta vaga → sugerir categorías
    const suggestions = [
      '¿En qué te puedo ayudar? Puedes preguntarme por una ubicación, sobre las especialidades técnicas o la historia del liceo.',
      '¿Buscas una ubicación, información sobre especialidades o la historia del liceo? Dime cómo puedo orientarte.',
      '¿Podrías ser un poco más específico? Puedo ayudarte con ubicaciones, horarios, matrícula, especialidades y más.',
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  _buildKnowledgeBase() {
    const s = SCHOOL;
    return [
      {
        kw: ['hola','buenos','buenas','buen día','buen dia','hey','saludos'],
        r:  `¡Hola! Bienvenido al ${s.name}. Soy FENNER, tu asistente virtual, ` +
            `y estoy aquí para ayudarte. ¿Qué necesitas saber?`,
      },
      {
        kw: ['especialidad','especialidades','carrera','carreras','que estudian','se estudia','ofrecen'],
        r:  `Contamos con cinco especialidades técnico-profesionales: Electricidad, Edificación, ` +
            `Mecánica Automotriz, Construcciones Metálicas e Instalaciones Sanitarias. ` +
            `Todas otorgan el título de Técnico de Nivel Medio. ` +
            `Para conocer más detalles, toca "Especialidades" en el menú principal.`,
      },
      {
        kw: ['electricidad','eléctric','electrica'],
        r:  `La especialidad de Electricidad forma técnicos en instalaciones eléctricas ` +
            `residenciales, comerciales e industriales. ` +
            `Nuestros egresados dominan las normas de seguridad y las tecnologías más actuales del sector.`,
      },
      {
        kw: ['edificación','edificacion','construcción','construccion civil','albañil'],
        r:  `La especialidad de Edificación prepara a los estudiantes en construcción, ` +
            `lectura de planos, materialidad y técnicas constructivas modernas. ` +
            `Es uno de los sectores con mayor dinamismo y demanda laboral en el país.`,
      },
      {
        kw: ['mecánica','mecanica','automotriz','vehículo','vehiculo','auto'],
        r:  `La especialidad de Mecánica Automotriz está orientada al diagnóstico, ` +
            `mantención y reparación de vehículos livianos. ` +
            `Es una de las especialidades con mayor inserción laboral en nuestra región.`,
      },
      {
        kw: ['metálica','metalica','soldadura','estructura','estructura metálica'],
        r:  `La especialidad de Construcciones Metálicas forma técnicos en soldadura industrial, ` +
            `fabricación y montaje de estructuras metálicas. ` +
            `Tiene una gran proyección en la industria y la construcción del país.`,
      },
      {
        kw: ['sanitaria','sanitarias','agua potable','alcantarillado','gasfiter','gasfitería','calefacción'],
        r:  `La especialidad de Instalaciones Sanitarias capacita en redes de agua potable, ` +
            `alcantarillado y sistemas de calefacción. ` +
            `Es una especialidad esencial para el bienestar de las comunidades, con alta demanda en todo Chile.`,
      },
      {
        kw: ['horario','hora','clases','cuando','entrada','salida','jornada','turno'],
        r:  `La jornada escolar se desarrolla de lunes a viernes, ` +
            `desde las ${s.horarios.entrada} hasta las ${s.horarios.salida}. ` +
            `El horario de almuerzo es a las ${s.horarios.almuerzo}. ` +
            `Los talleres prácticos pueden tener horarios diferenciados según la especialidad.`,
      },
      {
        kw: ['matrícula','matricula','inscripción','inscripcion','postular','ingresar','requisito'],
        r:  `El proceso de matrícula se lleva a cabo entre noviembre y enero. ` +
            `Para postular, es necesario haber cursado 8° básico o 1° medio ` +
            `y presentar certificado de notas, cédula de identidad y fotografías. ` +
            `Puedes acercarte a secretaría para recibir más información.`,
      },
      {
        kw: ['rector','director','directora','jefe','autoridad'],
        r:  `La dirección del establecimiento está a cargo del director, señor ${s.rector}. ` +
            `Su oficina se encuentra en el sector administrativo, junto a secretaría, ` +
            `que atiende de ${s.horarios.secretaria}.`,
      },
      {
        kw: ['dirección','direccion','donde queda','ubicación','ubicacion','llegar','cómo llegar'],
        r:  `El Liceo se encuentra ubicado en ${s.address}. ` +
            `También puedes consultar el plano del establecimiento tocando ` +
            `"Mapa del Establecimiento" en el menú principal.`,
      },
      {
        kw: ['teléfono','telefono','contacto','comunicar','llamar','correo','email','mail'],
        r:  `Puedes comunicarte con el establecimiento al correo electrónico ${s.email}` +
            (s.phone ? ` o al teléfono ${s.phone}` : '') + `. ` +
            `Secretaría atiende de ${s.horarios.secretaria}.`,
      },
      {
        kw: ['mapa','plano','instalaciones','donde está','cancha'],
        r:  `Para ver el plano del establecimiento, toca "Mapa del Establecimiento" ` +
            `en el menú principal. Desde allí podrás ubicar salas, talleres, el CRA y muchos más sectores. ` +
            `También puedes preguntarme directamente dónde está cualquier lugar.`,
      },
      {
        kw: ['casino','almuerzo','comida','menu','menú','alimentación'],
        r:  `El casino del liceo ofrece almuerzo de lunes a viernes ` +
            `con menú subvencionado para los estudiantes. ` +
            `El horario de almuerzo es a las ${s.horarios.almuerzo}.`,
      },
      {
        kw: ['deporte','club','atletismo','fútbol','futbol','basketball','actividad','extracurricular'],
        r:  `Contamos con actividades deportivas y talleres extracurriculares para nuestros estudiantes. ` +
            `Te invitamos a acercarte a la dirección del establecimiento ` +
            `para conocer todos los programas disponibles.`,
      },
      {
        kw: ['oportunidad','futuro','trabajo','empleo','laboral','vida'],
        r:  `En el ${s.name}, nuestra misión es entregar una formación técnica de excelencia ` +
            `que abra mejores oportunidades en la vida personal, laboral y profesional de cada estudiante. ` +
            `¡Aquí se forman los técnicos del futuro!`,
      },
      {
        kw: ['gracias','muchas gracias','thank','agradec'],
        r:  `¡Con mucho gusto! Espero haber sido de ayuda. ` +
            `Si tienes más preguntas, aquí estaré.`,
      },
      {
        kw: ['adiós','adios','chao','hasta luego','bye','nos vemos'],
        r:  `¡Hasta pronto! Fue un placer poder ayudarte. ¡Que tengas un excelente día!`,
      },
    ];
  }
}
