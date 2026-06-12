/* ──────────────────────────────────────────────────────────────
   APP – Lógica principal del kiosk
   ────────────────────────────────────────────────────────────── */

const IDLE_MS = 60_000;

let assistant;
let idleTimer  = null;
let sleeping   = true;
let mapCleanup = null;

// Historia section state – cleaned up when navigating away
const hist = { raf: null, slide: null, paused: false, touching: false };

document.addEventListener('DOMContentLoaded', () => {
  assistant = new FennerAssistant();
  startClock();
  initIdle();
  initNav();
  document.getElementById('back-btn').addEventListener('click', showNav);
  document.getElementById('speak-btn').addEventListener('click', () => assistant.toggle());
});

// ── RELOJ ──────────────────────────────────────────────────────────
function startClock() {
  function tick() {
    const now  = new Date();
    const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    document.getElementById('idle-time').textContent = time;
    document.getElementById('idle-date').textContent = date;
    document.getElementById('hdr-time').textContent  = time;
    document.getElementById('hdr-date').textContent  = date;
  }
  tick();
  setInterval(tick, 1000);
}

// ── IDLE ───────────────────────────────────────────────────────────
function initIdle() {
  const overlay = document.getElementById('idle-overlay');
  overlay.addEventListener('click',      wakeUp);
  overlay.addEventListener('touchstart', wakeUp, { passive: true });

  ['click', 'touchstart', 'keydown'].forEach(ev =>
    document.addEventListener(ev, resetIdleTimer, { passive: true })
  );
  window.resetIdleTimer = resetIdleTimer;
}

function wakeUp() {
  if (!sleeping) return;
  sleeping = false;
  const overlay = document.getElementById('idle-overlay');
  const app     = document.getElementById('app');
  overlay.classList.add('hidden');
  app.classList.remove('app-hidden');
  setTimeout(() => { overlay.style.display = 'none'; }, 650);
  resetIdleTimer();
}

function goToSleep() {
  sleeping = true;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  showNav();
  const overlay = document.getElementById('idle-overlay');
  const app     = document.getElementById('app');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.remove('hidden'));
  app.classList.add('app-hidden');
}

function resetIdleTimer() {
  if (sleeping) return;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(goToSleep, IDLE_MS);
}

// ── NAVEGACIÓN ─────────────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => openSection(btn.dataset.section));
  });
}

function cleanupHistoria() {
  if (hist.raf)   { cancelAnimationFrame(hist.raf); hist.raf   = null; }
  if (hist.slide) { clearInterval(hist.slide);      hist.slide = null; }
  hist.paused   = false;
  hist.touching = false;
  document.getElementById('content-body').classList.remove('hist-mode');
}

function cleanupMapa() {
  if (mapCleanup) { mapCleanup(); mapCleanup = null; }
}

function showNav() {
  cleanupHistoria();
  cleanupMapa();
  document.getElementById('nav-grid').style.display = 'grid';
  document.getElementById('content-panel').classList.add('hidden');
}

async function openSection(section) {
  cleanupHistoria();
  cleanupMapa();

  document.getElementById('nav-grid').style.display = 'none';
  document.getElementById('content-panel').classList.remove('hidden');

  const titles = {
    historia:       'Nuestra Historia',
    mapa:           'Mapa del Establecimiento',
    logros:         'Logros WorldSkills',
    clima:          'Clima',
    especialidades: 'Especialidades',
  };
  document.getElementById('content-title').textContent = titles[section] || section;

  const body = document.getElementById('content-body');

  if (section === 'historia') {
    body.classList.add('hist-mode');
    body.innerHTML = historiaSkeletonHTML();
    loadHistoria(); // async, intentionally not awaited here
    return;
  }

  switch (section) {
    case 'mapa':
      body.innerHTML = renderMapa();
      initMap();
      break;
    case 'especialidades': body.innerHTML = renderEspecialidades(); break;
    case 'logros':         body.innerHTML = renderLogros();         break;
    case 'clima':
      body.innerHTML = '<div class="clima-loading"><div class="spinner"></div><span>Cargando clima…</span></div>';
      loadClima();
      break;
  }
}

// ── HISTORIA ───────────────────────────────────────────────────────

function historiaSkeletonHTML() {
  return `
    <div class="hist-layout">
      <div class="hist-text-col">
        <div class="hist-scroll-box" id="hist-scroll-box">
          <div id="hist-scroll-content">
            <p class="hist-para" style="color:var(--txt3)">Cargando historia…</p>
          </div>
        </div>
        <div class="hist-scroll-hint" id="hist-hint">▶ Desplazamiento automático · Toca para pausar</div>
      </div>
      <div class="hist-photo-col">
        <div class="hist-slideshow" id="hist-slideshow">
          <img class="slide-img front" id="slide-a" alt="" />
          <img class="slide-img back"  id="slide-b" alt="" />
          <div class="slide-empty" id="slide-empty" style="display:none">
            <div class="slide-empty-icon">📷</div>
            <p>Fotografías próximamente</p>
            <small>Agrega imágenes en public/data/fotoshistoria/</small>
          </div>
          <div class="slide-counter" id="slide-counter" style="display:none"></div>
        </div>
        <div class="hist-dot-row" id="hist-dots"></div>
      </div>
    </div>`;
}

async function loadHistoria() {
  const [text, photos] = await Promise.all([
    fetch('/data/historia.txt').then(r => r.ok ? r.text() : '').catch(() => ''),
    fetch('/api/fotos-historia').then(r => r.json()).catch(() => []),
  ]);

  // Guard: user may have navigated away while loading
  const box = document.getElementById('hist-scroll-box');
  if (!box) return;

  const contentEl = document.getElementById('hist-scroll-content');
  contentEl.innerHTML = text
    ? formatHistoriaText(text)
    : '<p class="hist-para">Historia no disponible.</p>';

  startAutoScroll(box);
  startSlideshow(photos);
}

function formatHistoriaText(raw) {
  return raw.split('\n').map(line => {
    const t = line.trim();
    if (!t) return '<div class="hist-spacer"></div>';
    if (/^[•\-–—]/.test(t))
      return `<p class="hist-bullet">${t.replace(/^[•\-–—]\s*/, '')}</p>`;
    if (t === t.toUpperCase() && t.length > 3)
      return `<h3 class="hist-heading">${t}</h3>`;
    return `<p class="hist-para">${t}</p>`;
  }).join('');
}

function startAutoScroll(box) {
  const hintEl = document.getElementById('hist-hint');

  const updateHint = () => {
    if (!hintEl) return;
    if (hist.paused) {
      hintEl.textContent = '⏸ Pausado · Toca para reanudar';
      hintEl.classList.add('paused');
    } else {
      hintEl.textContent = '▶ Desplazamiento automático · Toca para pausar';
      hintEl.classList.remove('paused');
    }
  };

  // Tap = toggle pause (only when not in a drag gesture)
  box.addEventListener('click', () => {
    if (!hist.touching) {
      hist.paused = !hist.paused;
      updateHint();
    }
  });

  // Touch drag = suspend auto-scroll while finger is down
  box.addEventListener('touchstart', () => { hist.touching = true; },  { passive: true });
  box.addEventListener('touchend',   () => {
    setTimeout(() => { hist.touching = false; }, 250);
  }, { passive: true });

  let loopTimer = null;

  function step() {
    if (!hist.paused && !hist.touching) {
      box.scrollTop += 0.45;

      // Reached the bottom: pause 3 s then loop back to top
      if (box.scrollTop + box.clientHeight >= box.scrollHeight - 4) {
        if (!loopTimer) {
          loopTimer = setTimeout(() => {
            box.scrollTo({ top: 0, behavior: 'smooth' });
            loopTimer = null;
          }, 3000);
        }
      }
    }
    hist.raf = requestAnimationFrame(step);
  }

  hist.raf = requestAnimationFrame(step);
  updateHint();
}

function startSlideshow(photos) {
  const emptyEl   = document.getElementById('slide-empty');
  const counterEl = document.getElementById('slide-counter');
  const dotsEl    = document.getElementById('hist-dots');
  const imgA      = document.getElementById('slide-a');
  const imgB      = document.getElementById('slide-b');

  if (!imgA) return;

  if (!photos.length) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }

  // Counter
  if (counterEl) counterEl.style.display = 'block';

  // Dot indicators (only when ≤ 12 photos to avoid crowding)
  if (dotsEl && photos.length > 1 && photos.length <= 12) {
    dotsEl.innerHTML = photos.map((_, i) =>
      `<div class="hist-dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`
    ).join('');
  }

  let curr      = 0;
  let frontIsA  = true;

  const updateUI = () => {
    if (counterEl) counterEl.textContent = `${curr + 1} / ${photos.length}`;
    if (dotsEl) dotsEl.querySelectorAll('.hist-dot').forEach((d, i) =>
      d.classList.toggle('active', i === curr)
    );
  };

  // Show first image
  imgA.src       = photos[0];
  imgA.className = 'slide-img front';
  imgB.className = 'slide-img back';
  if (photos.length > 1) imgB.src = photos[1]; // pre-load next
  updateUI();

  if (photos.length === 1) return;

  hist.slide = setInterval(() => {
    curr = (curr + 1) % photos.length;
    const preload = (curr + 1) % photos.length;

    if (frontIsA) {
      imgB.src = photos[curr];
      // Small delay so browser processes the new src before fading in
      setTimeout(() => {
        imgB.className = 'slide-img front';
        imgA.className = 'slide-img back';
        imgA.src = photos[preload];
        frontIsA = false;
        updateUI();
      }, 60);
    } else {
      imgA.src = photos[curr];
      setTimeout(() => {
        imgA.className = 'slide-img front';
        imgB.className = 'slide-img back';
        imgB.src = photos[preload];
        frontIsA = true;
        updateUI();
      }, 60);
    }
  }, 4000);
}

// ── ESPECIALIDADES ─────────────────────────────────────────────────
function renderEspecialidades() {
  const cards = SCHOOL.especialidades.map(e =>
    `<div class="esp-card">
       <div class="esp-icon">${e.icon}</div>
       <div class="esp-name">${e.name}</div>
       <div class="esp-desc">${e.desc}</div>
       <span class="esp-badge">${e.nivel}</span>
     </div>`
  ).join('');
  return `<div class="esp-grid">${cards}</div>`;
}

function renderMapa() {
  const catOrder = ['admin','academic','food','workshop','services','emergency'];
  const listHtml = catOrder.map(cid => {
    const cat   = MAP_CATEGORIES[cid];
    const items = MAP_LOCATIONS.filter(l => l.category === cid);
    if (!items.length) return '';
    return `<div class="mapa-cat-hdr" data-cat="${cid}">${cat.icon} ${cat.label}</div>` +
      items.map(l =>
        `<div class="mapa-loc-item" data-id="${l.id}" data-label="${l.label}" data-cat="${cid}">` +
        `<span class="mapa-loc-ico">${l.icon}</span>` +
        `<span class="mapa-loc-name">${l.label}</span></div>`
      ).join('');
  }).join('');

  const emrgCards = MAP_EMERGENCY_IDS.map(id => {
    const l = MAP_LOCATIONS.find(x => x.id === id);
    if (!l) return '';
    return `<div class="mapa-emrg-card" data-goto="${l.id}">
      <div class="mapa-emrg-ci">${l.icon}</div>
      <div class="mapa-emrg-cl">${l.label}</div>
    </div>`;
  }).join('');

  return `
    <div class="mapa-wrap">
      <div class="mapa-toolbar">
        <span class="mapa-hint">Toca una ubicación · Pellizca o rueda del ratón para zoom</span>
        <div class="mapa-controls">
          <button class="mapa-zbn" id="mzoom-in"    title="Acercar">＋</button>
          <button class="mapa-zbn" id="mzoom-out"   title="Alejar">－</button>
          <button class="mapa-zbn" id="mzoom-reset" title="Ver todo">⌂</button>
          <button class="mapa-zbn" id="mzoom-full"  title="Pantalla completa">⛶</button>
          <button class="mapa-zbn" id="mapa-debug-toggle" style="display:none"
                  title="Modo debug: clic en el mapa para ver coordenadas">🎯</button>
          <button class="mapa-emrg-btn" id="mapa-emrg-btn">🚨 Emergencia</button>
        </div>
      </div>
      <div class="mapa-body">
        <div class="mapa-viewport" id="mapa-vp">
          <div class="mapa-canvas" id="mapa-cv">
            <img src="assets/mapa.png" id="mapa-img" draggable="false"
                 alt="Mapa del establecimiento" />
          </div>
          <!-- Pines fuera del canvas: posicionados en coords de viewport -->
          <div id="mapa-pins" class="mapa-pins-layer"></div>
          <div class="mapa-active-lbl" id="mapa-active-lbl"></div>
          <div class="mapa-debug-lbl" id="mapa-debug-lbl"></div>
          <div id="mapa-pin-tt" class="mapa-pin-tt"></div>
        </div>
        <div class="mapa-sidebar">
          <div class="mapa-search-wrap">
            <input type="text" class="mapa-search" id="mapa-search"
                   placeholder="🔍 Buscar…" autocomplete="off" />
          </div>
          <div class="mapa-loc-list" id="mapa-loc-list">${listHtml}</div>
        </div>
      </div>
      <div class="mapa-emrg-panel" id="mapa-emrg-panel">
        <div class="mapa-emrg-inner">
          <div class="mapa-emrg-header">
            <span class="mapa-emrg-title">🚨 Información de Emergencia</span>
            <button class="mapa-emrg-close" id="mapa-emrg-close">✕ Cerrar</button>
          </div>
          <div class="mapa-emrg-grid">${emrgCards}</div>
          <div class="mapa-emrg-note">
            Toca una tarjeta para ubicar en el mapa &nbsp;·&nbsp;
            Emergencias: <strong>131</strong> Bomberos · <strong>132</strong> Ambulancia
          </div>
        </div>
      </div>
    </div>`;
}

// ── LOGROS WORLDSKILLS ─────────────────────────────────────────────
function renderLogros() {
  const lg = SCHOOL.logros;

  const totals = lg.medallero.reduce(
    (a, m) => ({ oro: a.oro + m.oro, plata: a.plata + m.plata, bronce: a.bronce + m.bronce }),
    { oro: 0, plata: 0, bronce: 0 }
  );

  const medalRow = (n, medal, lbl) => n
    ? `<span class="lg-medal">${medal} ${n} ${lbl}${n > 1 ? 's' : ''}</span>` : '';

  const cards = lg.medallero.map(m =>
    `<div class="lg-card">
       <div class="lg-card-icon">${m.icon}</div>
       <div class="lg-card-name">${m.skill}</div>
       <div class="lg-card-medals">
         ${medalRow(m.oro, '🥇', 'oro')}
         ${medalRow(m.plata, '🥈', 'plata')}
         ${medalRow(m.bronce, '🥉', 'bronce')}
       </div>
       ${m.extra ? `<div class="lg-card-extra">⭐ ${m.extra}</div>` : ''}
     </div>`
  ).join('');

  const otros = lg.otros.map(o =>
    `<div class="lg-otro">
       <span class="lg-otro-year">${o.year}</span>
       <span class="lg-otro-text">${o.text}</span>
     </div>`
  ).join('');

  return `
    <div class="lg-wrap">
      <p class="lg-intro">${lg.intro}</p>
      <div class="lg-totals">
        <div class="lg-total"><span class="lg-total-medal">🥇</span><span class="lg-total-n">${totals.oro}</span><span class="lg-total-lbl">Oro</span></div>
        <div class="lg-total"><span class="lg-total-medal">🥈</span><span class="lg-total-n">${totals.plata}</span><span class="lg-total-lbl">Plata</span></div>
        <div class="lg-total"><span class="lg-total-medal">🥉</span><span class="lg-total-n">${totals.bronce}</span><span class="lg-total-lbl">Bronce</span></div>
      </div>
      <div class="lg-destacado">${lg.destacado}</div>
      <div class="lg-grid">${cards}</div>
      <h3 class="lg-subtitle">Otros reconocimientos</h3>
      <div class="lg-otros">${otros}</div>
    </div>`;
}

// ── CLIMA ────────────────────────────────────────────────────────────
async function loadClima() {
  try {
    const res  = await fetch(`/api/weather?lat=${SCHOOL.lat}&lon=${SCHOOL.lon}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const c         = data.current;
    const temp      = Math.round(c.temperature_2m);
    const feelsLike = Math.round(c.apparent_temperature);
    const humidity  = c.relative_humidity_2m;
    const wind      = Math.round(c.wind_speed_10m);
    const { icon, desc } = weatherInfo(c.weather_code);

    document.getElementById('content-body').innerHTML = `
      <div class="clima-main">
        <div class="clima-hero">
          <div class="clima-icon">${icon}</div>
          <div>
            <div class="clima-temp">${temp}<sup>°C</sup></div>
            <div class="clima-desc">${desc}</div>
            <div class="clima-city">${SCHOOL.weatherCity}</div>
          </div>
        </div>
        <div class="clima-cards">
          <div class="clima-card">
            <div class="cc-icon">🌡️</div>
            <div class="cc-val">${feelsLike}°C</div>
            <div class="cc-lbl">Sensación térmica</div>
          </div>
          <div class="clima-card">
            <div class="cc-icon">💧</div>
            <div class="cc-val">${humidity}%</div>
            <div class="cc-lbl">Humedad</div>
          </div>
          <div class="clima-card">
            <div class="cc-icon">💨</div>
            <div class="cc-val">${wind} km/h</div>
            <div class="cc-lbl">Viento</div>
          </div>
        </div>
      </div>`;
  } catch {
    document.getElementById('content-body').innerHTML =
      `<div class="clima-err">
         ⚠️ No se pudo cargar el clima.<br/>
         <small>Verifica la conexión a internet.</small>
       </div>`;
  }
}

function weatherInfo(code) {
  const map = {
    0:{icon:'☀️',desc:'Despejado'},1:{icon:'🌤️',desc:'Mayormente despejado'},
    2:{icon:'⛅',desc:'Parcialmente nublado'},3:{icon:'☁️',desc:'Nublado'},
    45:{icon:'🌫️',desc:'Neblina'},48:{icon:'🌫️',desc:'Escarcha de niebla'},
    51:{icon:'🌦️',desc:'Llovizna leve'},53:{icon:'🌦️',desc:'Llovizna moderada'},
    55:{icon:'🌧️',desc:'Llovizna intensa'},61:{icon:'🌧️',desc:'Lluvia leve'},
    63:{icon:'🌧️',desc:'Lluvia moderada'},65:{icon:'🌧️',desc:'Lluvia intensa'},
    71:{icon:'❄️',desc:'Nevada leve'},73:{icon:'❄️',desc:'Nevada moderada'},
    75:{icon:'❄️',desc:'Nevada intensa'},80:{icon:'🌦️',desc:'Chubascos leves'},
    81:{icon:'🌧️',desc:'Chubascos moderados'},82:{icon:'⛈️',desc:'Chubascos intensos'},
    95:{icon:'⛈️',desc:'Tormenta eléctrica'},96:{icon:'⛈️',desc:'Tormenta con granizo'},
    99:{icon:'⛈️',desc:'Tormenta intensa'},
  };
  return map[code] ?? { icon:'🌡️', desc:'Condición desconocida' };
}

// ── MAPA INTERACTIVO ─────────────────────────────────────────────────
function initMap() {
  const vp       = document.getElementById('mapa-vp');
  const cv       = document.getElementById('mapa-cv');
  const img      = document.getElementById('mapa-img');
  const pinsEl   = document.getElementById('mapa-pins');
  const activLbl = document.getElementById('mapa-active-lbl');
  const pinTt    = document.getElementById('mapa-pin-tt');

  let _ttTimer = null;
  function showPinTt(pin, label) {
    const r  = pin.getBoundingClientRect();
    const vr = vp.getBoundingClientRect();
    pinTt.textContent = label;
    pinTt.style.left  = (r.left + r.width / 2 - vr.left) + 'px';
    pinTt.style.top   = (r.top  - vr.top  - 6) + 'px';
    pinTt.classList.add('visible');
  }
  function hidePinTt() {
    clearTimeout(_ttTimer);
    pinTt.classList.remove('visible');
  }

  let scale = 1, tx = 0, ty = 0, MIN = 0.05;
  const MAX = 12;
  let dragging = false, dragX = 0, dragY = 0;
  let pinchDist0 = 0, scale0 = 1;
  let debugMode = false, _mouseDownX = 0, _mouseDownY = 0;

  // ── Transform ──────────────────────────────────────────────────────
  function applyTx(animate) {
    cv.style.transition = animate ? 'transform .32s cubic-bezier(.25,.8,.25,1)' : 'none';
    cv.style.transform  = `translate(${tx}px,${ty}px) scale(${scale})`;
    updateAllPins();
  }

  function clamp() {
    const vw = vp.clientWidth, vh = vp.clientHeight;
    const iw = img.naturalWidth * scale, ih = img.naturalHeight * scale;
    tx = iw <= vw ? (vw - iw) / 2 : Math.min(0, Math.max(vw - iw, tx));
    ty = ih <= vh ? (vh - ih) / 2 : Math.min(0, Math.max(vh - ih, ty));
  }

  function resetView(animate) {
    MIN   = Math.min(vp.clientWidth / img.naturalWidth, vp.clientHeight / img.naturalHeight);
    scale = MIN;
    const iw = img.naturalWidth * scale, ih = img.naturalHeight * scale;
    tx = (vp.clientWidth  - iw) / 2;
    ty = (vp.clientHeight - ih) / 2;
    applyTx(animate);
  }

  function zoomAt(ns, cx, cy, animate = false) {
    const rct = vp.getBoundingClientRect();
    const mx = cx - rct.left, my = cy - rct.top;
    const ox = (mx - tx) / scale, oy = (my - ty) / scale;
    scale = Math.min(MAX, Math.max(MIN, ns));
    tx = mx - ox * scale; ty = my - oy * scale;
    clamp(); applyTx(animate);
  }

  // ── Pins ───────────────────────────────────────────────────────────
  function updateAllPins() {
    pinsEl.querySelectorAll('.mapa-pin').forEach(pin => {
      pin.style.left = (tx + parseFloat(pin.dataset.imgX) * scale) + 'px';
      pin.style.top  = (ty + parseFloat(pin.dataset.imgY) * scale) + 'px';
    });
  }

  function clearPins() {
    pinsEl.innerHTML = '';
    activLbl.textContent = '';
    activLbl.classList.remove('visible');
    document.querySelectorAll('.mapa-loc-item.active').forEach(el => el.classList.remove('active'));
  }

  function addPin(loc, emergency, selected = false) {
    const catId = emergency ? 'emergency' : (loc.category || 'academic');
    const icon  = (MAP_CATEGORIES[catId] || {}).icon || '📍';
    const pin   = document.createElement('div');
    pin.className    = `mapa-pin pin-cat-${catId}${selected ? ' pin-selected' : ''}`;
    pin.dataset.imgX = (loc.x / 100) * img.naturalWidth;
    pin.dataset.imgY = (loc.y / 100) * img.naturalHeight;
    pin.innerHTML    = `<div class="mapa-pin-bubble">${icon}</div><div class="mapa-pin-stem"></div>`;

    pin.addEventListener('mouseenter', () => showPinTt(pin, loc.label));
    pin.addEventListener('mouseleave', hidePinTt);
    pin.addEventListener('touchstart', () => {
      showPinTt(pin, loc.label);
      clearTimeout(_ttTimer);
      _ttTimer = setTimeout(hidePinTt, 2500);
    }, { passive: true });

    pinsEl.appendChild(pin);
    updateAllPins();
    return pin;
  }

  function goToLocation(loc, emergency) {
    if (!loc || !img.naturalWidth) return;
    clearPins();
    addPin(loc, emergency, true);

    const targetScale = Math.min(MAX, MIN * (loc.zoom || 4));
    const px = (loc.x / 100) * img.naturalWidth;
    const py = (loc.y / 100) * img.naturalHeight;
    scale = targetScale;
    tx = vp.clientWidth  / 2 - px * scale;
    ty = vp.clientHeight / 2 - py * scale;
    clamp(); applyTx(true);

    activLbl.textContent = '📍 ' + loc.label;
    activLbl.classList.add('visible');

    const sideItem = document.querySelector(`.mapa-loc-item[data-id="${loc.id}"]`);
    if (sideItem) {
      sideItem.classList.add('active');
      sideItem.scrollIntoView({ block:'nearest', behavior:'smooth' });
    }
  }

  // ── Init image ─────────────────────────────────────────────────────
  function onReady() {
    resetView(false);
  }
  if (img.complete && img.naturalWidth) onReady();
  else img.addEventListener('load', onReady);

  const _onResize = () => resetView(false);
  window.addEventListener('resize', _onResize);

  // ── Input events ───────────────────────────────────────────────────
  vp.addEventListener('wheel', e => {
    e.preventDefault();
    zoomAt(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
  }, { passive: false });

  vp.addEventListener('mousedown', e => {
    hidePinTt();
    dragging = true; dragX = e.clientX - tx; dragY = e.clientY - ty;
    _mouseDownX = e.clientX; _mouseDownY = e.clientY;
    vp.style.cursor = 'grabbing';
  });
  const _onMouseMove = e => {
    if (!dragging) return;
    tx = e.clientX - dragX; ty = e.clientY - dragY; clamp(); applyTx(false);
  };
  const _onMouseUp = () => { dragging = false; vp.style.cursor = debugMode ? 'crosshair' : ''; };
  document.addEventListener('mousemove', _onMouseMove);
  document.addEventListener('mouseup',  _onMouseUp);

  vp.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      dragging = true;
      dragX = e.touches[0].clientX - tx; dragY = e.touches[0].clientY - ty;
    } else if (e.touches.length === 2) {
      dragging = false;
      pinchDist0 = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY);
      scale0 = scale;
    }
  }, { passive: true });

  vp.addEventListener('touchmove', e => {
    e.preventDefault();
    hidePinTt();
    if (e.touches.length === 1 && dragging) {
      tx = e.touches[0].clientX - dragX; ty = e.touches[0].clientY - dragY;
      clamp(); applyTx(false);
    } else if (e.touches.length === 2) {
      const d  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY);
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoomAt(scale0 * (d / pinchDist0), cx, cy);
    }
  }, { passive: false });

  vp.addEventListener('touchend', () => { dragging = false; });

  // ── Debug click: obtener coordenadas de imagen ──────────────────────
  vp.addEventListener('click', e => {
    if (!debugMode) return;
    if (Math.hypot(e.clientX - _mouseDownX, e.clientY - _mouseDownY) > 8) return;
    const rct  = vp.getBoundingClientRect();
    const imgX = (e.clientX - rct.left - tx) / scale;
    const imgY = (e.clientY - rct.top  - ty) / scale;
    const xPct = (imgX / img.naturalWidth  * 100).toFixed(2);
    const yPct = (imgY / img.naturalHeight * 100).toFixed(2);
    const dbgLbl = document.getElementById('mapa-debug-lbl');
    dbgLbl.textContent = `x: ${xPct}  y: ${yPct}`;
    dbgLbl.classList.add('visible');
    console.log(`{ id:'', label:'', category:'', icon:'', x:${xPct}, y:${yPct}, zoom:4 },`);
  });

  // ── Zoom buttons ───────────────────────────────────────────────────
  document.getElementById('mzoom-in').addEventListener('click', () => {
    const r = vp.getBoundingClientRect();
    zoomAt(scale * 1.5, r.left + r.width / 2, r.top + r.height / 2, true);
  });
  document.getElementById('mzoom-out').addEventListener('click', () => {
    const r = vp.getBoundingClientRect();
    zoomAt(scale / 1.5, r.left + r.width / 2, r.top + r.height / 2, true);
  });
  document.getElementById('mzoom-reset').addEventListener('click', () => {
    clearPins(); resetView(true);
  });

  // ── Pantalla completa ──────────────────────────────────────────────
  const fullBtn = document.getElementById('mzoom-full');
  fullBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      fullBtn.textContent = '⊠';
    } else {
      document.exitFullscreen?.();
      fullBtn.textContent = '⛶';
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) fullBtn.textContent = '⛶';
  });

  // ── Debug toggle (oculto: 5 toques rápidos en el texto de ayuda lo revelan) ──
  let _hintTaps = 0, _hintTapTimer = null;
  document.querySelector('.mapa-hint').addEventListener('click', () => {
    _hintTaps++;
    clearTimeout(_hintTapTimer);
    _hintTapTimer = setTimeout(() => { _hintTaps = 0; }, 2000);
    if (_hintTaps >= 5) {
      _hintTaps = 0;
      const btn = document.getElementById('mapa-debug-toggle');
      btn.style.display = btn.style.display === 'none' ? '' : 'none';
    }
  });

  document.getElementById('mapa-debug-toggle').addEventListener('click', () => {
    debugMode = !debugMode;
    document.getElementById('mapa-debug-toggle').classList.toggle('debug-active', debugMode);
    vp.style.cursor = debugMode ? 'crosshair' : '';
    const dbgLbl = document.getElementById('mapa-debug-lbl');
    if (!debugMode) dbgLbl.classList.remove('visible');
  });

  // ── Sidebar location list ──────────────────────────────────────────
  document.getElementById('mapa-loc-list').querySelectorAll('.mapa-loc-item').forEach(item => {
    const handler = () => {
      const loc = MAP_LOCATIONS.find(l => l.id === item.dataset.id);
      if (loc) goToLocation(loc, false);
    };
    item.addEventListener('click',    handler);
    item.addEventListener('touchend', e => { e.preventDefault(); handler(); });
  });

  // ── Search ─────────────────────────────────────────────────────────
  const searchInput = document.getElementById('mapa-search');
  const locList     = document.getElementById('mapa-loc-list');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    locList.querySelectorAll('.mapa-loc-item').forEach(el => {
      el.classList.toggle('mapa-hidden', !!q && !el.dataset.label.toLowerCase().includes(q));
    });
    locList.querySelectorAll('.mapa-cat-hdr').forEach(hdr => {
      const hasVisible = [...locList.querySelectorAll(`.mapa-loc-item[data-cat="${hdr.dataset.cat}"]`)]
        .some(el => !el.classList.contains('mapa-hidden'));
      hdr.classList.toggle('mapa-hidden', !hasVisible);
    });
  });

  // ── Emergency panel ────────────────────────────────────────────────
  const emrgBtn   = document.getElementById('mapa-emrg-btn');
  const emrgPanel = document.getElementById('mapa-emrg-panel');
  let emrgOpen    = false;

  function setEmergency(open) {
    emrgOpen = open;
    emrgPanel.classList.toggle('open', open);
    emrgBtn.classList.toggle('active', open);
    if (open) {
      clearPins();
      MAP_EMERGENCY_IDS.forEach(id => {
        const loc = MAP_LOCATIONS.find(l => l.id === id);
        if (loc) addPin(loc, true);
      });
      resetView(true);
    }
  }

  emrgBtn.addEventListener('click', () => setEmergency(!emrgOpen));
  document.getElementById('mapa-emrg-close').addEventListener('click', () => setEmergency(false));

  emrgPanel.querySelectorAll('.mapa-emrg-card[data-goto]').forEach(card => {
    card.addEventListener('click', () => {
      const loc = MAP_LOCATIONS.find(l => l.id === card.dataset.goto);
      if (loc) { setEmergency(false); goToLocation(loc, true); }
    });
  });

  // ── FENNER integration ─────────────────────────────────────────────
  window.highlightMapZone = id => {
    const loc = MAP_LOCATIONS.find(l => l.id === id);
    if (loc) goToLocation(loc, false);
  };

  // ── Cleanup ────────────────────────────────────────────────────────
  mapCleanup = () => {
    document.removeEventListener('mousemove', _onMouseMove);
    document.removeEventListener('mouseup',  _onMouseUp);
    window.removeEventListener('resize', _onResize);
    window.highlightMapZone = null;
  };
}
