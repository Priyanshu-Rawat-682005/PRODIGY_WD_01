/* ---------------------------------------------------------
   Wavefold interactive layer
   Sections: scroll state, colored nav cables, active-section
   tracking, mobile menu, hero spotlight, tilting module cards,
   and the live knob-driven waveform.
--------------------------------------------------------- */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Scroll progress bar ---- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}

/* ---- Nav scroll state ---- */
const nav = document.getElementById('nav');
function onScroll(){
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  updateScrollProgress();
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---- Colored patch cable per nav link ---- */
const CABLE_COLORS = {
  amber:  '#f5a83c',
  violet: '#b98af0',
  teal:   '#4fe0c4',
  ember:  '#f0563f'
};

const navLinksWrap = document.getElementById('navLinks');
const navCable = document.getElementById('navCable');
const links = Array.from(navLinksWrap.querySelectorAll('a'));

function placeCableOn(el){
  const wrapRect = navLinksWrap.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const color = CABLE_COLORS[el.dataset.color] || CABLE_COLORS.amber;
  navCable.style.left = (rect.left - wrapRect.left) + 'px';
  navCable.style.width = rect.width + 'px';
  navCable.style.background = color;
  navCable.style.boxShadow = `0 0 9px 1px ${color}`;
}

links.forEach(link => {
  link.addEventListener('mouseenter', () => placeCableOn(link));
});
navLinksWrap.addEventListener('mouseleave', () => {
  const active = navLinksWrap.querySelector('a.active');
  if (active) placeCableOn(active);
});

window.addEventListener('load', () => {
  const active = navLinksWrap.querySelector('a.active');
  if (active) placeCableOn(active);
});

/* ---- Active section tracking ---- */
const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = '#' + entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      const active = navLinksWrap.querySelector('a.active');
      if (active && !navLinksWrap.matches(':hover')) placeCableOn(active);
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
sections.forEach(s => sectionObserver.observe(s));

/* ---- Mobile menu toggle ---- */
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => navLinksWrap.classList.toggle('open'));
links.forEach(l => l.addEventListener('click', () => navLinksWrap.classList.remove('open')));

/* ---- Hero cursor spotlight ---- */
const heroSection = document.getElementById('heroSection');
const heroSpotlight = document.getElementById('heroSpotlight');
if (!reduceMotion){
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
    const my = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
    heroSpotlight.style.setProperty('--mx', mx);
    heroSpotlight.style.setProperty('--my', my);
  });
}

/* ---- Tilting module cards ---- */
if (!reduceMotion){
  document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;    // 0..1
      const rotY = (px - 0.5) * 10;   // left/right tilt
      const rotX = (0.5 - py) * 8;    // up/down tilt
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

/* ---- Live knob-driven waveform ----
   FOLD: 0..1, unipolar, knob range -135deg..135deg
   SHAPE: -1..1, bipolar, knob range -135deg..135deg, center 0deg
   DRIVE: 0..1, unipolar, knob range -135deg..135deg
------------------------------------------------------------ */
const wavePath = document.getElementById('wavePath');
const foldReadout = document.getElementById('foldReadout');
const valFold = document.getElementById('valFold');
const valShape = document.getElementById('valShape');
const valDrive = document.getElementById('valDrive');

const knobs = {
  fold:  { el: document.getElementById('knobFold'),  value: 0.0,  min: 0,  max: 1, default: 0.0 },
  shape: { el: document.getElementById('knobShape'), value: 0.0,  min: -1, max: 1, default: 0.0 },
  drive: { el: document.getElementById('knobDrive'), value: 0.3,  min: 0,  max: 1, default: 0.3 }
};

function valueToDeg(param, value){
  if (param === 'shape') return value * 135;               // bipolar: center = 0deg
  const t = (value - 0) / (1 - 0);                          // unipolar 0..1
  return -135 + t * 270;
}

function applyKnobVisual(param){
  const k = knobs[param];
  k.el.style.setProperty('--rot', valueToDeg(param, k.value) + 'deg');
}

function refreshReadouts(){
  valFold.textContent = Math.round(knobs.fold.value * 100) + '%';
  valShape.textContent = Math.round(knobs.shape.value * 100) + '%';
  valDrive.textContent = Math.round(knobs.drive.value * 100) + '%';
  foldReadout.textContent = 'FOLD ' + String(Math.round(knobs.fold.value * 100)).padStart(2, '0');
}

function smoothPath(pts){
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++){
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${xc.toFixed(1)},${yc.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)},${last.y.toFixed(1)}`;
  return d;
}

let phase = 0;
function computeWavePoints(){
  const width = 760, mid = 45, amp = 34, cycles = 3, N = 96;
  const foldVal = knobs.fold.value;
  const shapeVal = knobs.shape.value;
  const driveVal = knobs.drive.value;
  const pts = [];
  for (let i = 0; i <= N; i++){
    const x = (i / N) * width;
    const t = (i / N) * cycles * Math.PI * 2 + phase;
    let raw = Math.sin(t) * (0.4 + driveVal * 2.6);
    raw += shapeVal * 0.55;
    const folded = Math.sin(raw * (0.6 + foldVal * 5));
    const y = mid - folded * amp;
    pts.push({ x, y });
  }
  return pts;
}

function renderWave(){
  wavePath.setAttribute('d', smoothPath(computeWavePoints()));
}

/* ---- Knob interaction: pointer drag (vertical) + keyboard ---- */
function bindKnob(param){
  const k = knobs[param];
  const el = k.el;
  let dragging = false;
  let startY = 0;
  let startValue = 0;
  const range = k.max - k.min;
  const SENSITIVITY = 160; // px for full range

  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    startY = e.clientY;
    startValue = k.value;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
  });

  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const delta = (startY - e.clientY) / SENSITIVITY * range;
    k.value = Math.min(k.max, Math.max(k.min, startValue + delta));
    applyKnobVisual(param);
    refreshReadouts();
    if (reduceMotion) renderWave();
  });

  function endDrag(e){
    if (!dragging) return;
    dragging = false;
    el.style.cursor = 'grab';
    try { el.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);

  el.addEventListener('dblclick', () => {
    k.value = k.default;
    applyKnobVisual(param);
    refreshReadouts();
    if (reduceMotion) renderWave();
  });

  el.addEventListener('keydown', (e) => {
    const step = range * 0.04;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight'){
      k.value = Math.min(k.max, k.value + step);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft'){
      k.value = Math.max(k.min, k.value - step);
    } else {
      return;
    }
    e.preventDefault();
    applyKnobVisual(param);
    refreshReadouts();
    if (reduceMotion) renderWave();
  });
}

['fold', 'shape', 'drive'].forEach(param => {
  applyKnobVisual(param);
  bindKnob(param);
});
refreshReadouts();

/* ---- Animation loop: gives the waveform a living, oscilloscope
   feel even at rest. Skipped entirely under reduced motion. ---- */
if (!reduceMotion){
  function tick(){
    phase += 0.012;
    renderWave();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
} else {
  renderWave();
}
