import './style.css';
import portfolioData from './data/portfolio.json';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const cleanText = (str = '') =>
  String(str)
    .replaceAll('Â·', '·')
    .replaceAll('â€“', '–')
    .replaceAll('â€”', '—')
    .replaceAll('â†’', '→')
    .replaceAll('â†—', '↗')
    .replaceAll('âŒ˜', '⌘')
    .replaceAll('Ã—', '×')
    .replaceAll('Â©', '©');

/* -------------------------------------------------------------
   00. Sensory UI: Tactile Audio Synthesizer & Haptics (Web Audio API)
------------------------------------------------------------- */
class TactileAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('piyush_audio_muted') === 'true';
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleSound() {
    this.initContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('piyush_audio_muted', String(this.isMuted));
    this.updateSoundUi();
    if (!this.isMuted) {
      this.playClick();
    }
    this.triggerHaptic(10);
    return !this.isMuted;
  }

  updateSoundUi() {
    const icon = $('#sound-icon');
    const label = $('#sound-label');
    const heroBtn = $('#hero-sound-toggle');
    const heroText = $('.hero-sound-text');
    const heroDot = $('.sound-status-dot');

    if (this.isMuted) {
      if (icon) icon.textContent = '🔇';
      if (label) label.textContent = 'MUTED';
      if (heroText) heroText.textContent = 'AUDIO OFF';
      if (heroDot) heroDot.classList.add('is-muted');
    } else {
      if (icon) icon.textContent = '🔊';
      if (label) label.textContent = 'SOUND';
      if (heroText) heroText.textContent = 'AUDIO ON';
      if (heroDot) heroDot.classList.remove('is-muted');
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.015);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Audio fallback silent
    }
  }

  playWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio fallback silent
    }
  }

  playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.01);
    } catch {}
  }

  playChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.035, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.38);
      });
    } catch {}
  }

  triggerHaptic(duration = 10) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {}
    }
  }
}

const audio = new TactileAudioEngine();

let deferredInstallPrompt = null;
let reelAnimFrameId = null;
let isReelPaused = false;
let reelSpeed = 0.55;

document.addEventListener('DOMContentLoaded', () => {
  audio.updateSoundUi();
  initSoundToggles();
  initProfileData();
  initDevBadge();
  initBentoMetrics();
  initHorizontalProjectReel();
  initExperienceSection();
  initPeriodicTechMatrix();
  initLabSection();
  initContactSection();
  initPixarAvatarInteraction();
  initPreziPortal();
  initPortraitInteraction();
  initPwaInstall();
  initNavigationHighlighting();
  initScrollHeader();
  initDialogHandlers();
  initCommandPalette();
  initOfflineBanner();
  initServiceWorker();
  initInteractiveAudioListeners();
});

/* -------------------------------------------------------------
   01. Sound Toggles & Interactive Listeners
------------------------------------------------------------- */
function initSoundToggles() {
  const topBtn = $('#sound-toggle-btn');
  const heroBtn = $('#hero-sound-toggle');

  const handleToggle = () => audio.toggleSound();

  if (topBtn) topBtn.addEventListener('click', handleToggle);
  if (heroBtn) heroBtn.addEventListener('click', handleToggle);

  // Resume AudioContext on first interaction
  const resumeFirstGesture = () => {
    audio.initContext();
    window.removeEventListener('pointerdown', resumeFirstGesture);
    window.removeEventListener('keydown', resumeFirstGesture);
  };
  window.addEventListener('pointerdown', resumeFirstGesture, { once: true });
  window.addEventListener('keydown', resumeFirstGesture, { once: true });
}

function initInteractiveAudioListeners() {
  // Bind click sounds to interactive controls
  document.addEventListener('click', (e) => {
    const interactive = e.target.closest('button, .nav-link, .contact-pill-btn, .action-btn, .tech-filter-btn, .tech-element-card');
    if (interactive && !interactive.id?.includes('sound-toggle')) {
      audio.playClick();
      audio.triggerHaptic(10);
    }
  });
}

/* -------------------------------------------------------------
   02. Profile Facts
------------------------------------------------------------- */
function initProfileData() {
  const { profile, education } = portfolioData;

  const facts = [
    ['CURRENT LOCATION', profile.location],
    ['DEGREE PROGRAM', cleanText(`${education.degree} (${education.period})`)],
    ['CORE RUNTIME', 'React · Node · TypeScript · Python'],
    ['ACADEMIC PERFORMANCE', education.grade]
  ];

  const factsContainer = $('#profile-facts');
  if (factsContainer) {
    factsContainer.innerHTML = facts
      .map(
        ([label, value]) => `
      <article class="fact-card">
        <span class="fact-label">${label}</span>
        <strong class="fact-value">${cleanText(value)}</strong>
      </article>`
      )
      .join('');
  }
}

/* -------------------------------------------------------------
   03. 3D Gyroscope Developer ID Badge Component (<app-dev-badge>)
------------------------------------------------------------- */
function initDevBadge() {
  const badge = $('#dev-id-badge');
  const glare = $('#badge-glare');
  const portraitTrigger = $('#badge-portrait-trigger');
  if (!badge) return;

  let rotateX = 0;
  let rotateY = 0;
  let isInteracting = false;

  const applyTilt = (rx, ry, gx = 50, gy = 50) => {
    badge.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glare) {
      glare.style.opacity = isInteracting ? '1' : '0';
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`;
    }
  };

  // Desktop Mouse Movement
  badge.addEventListener('mousemove', (e) => {
    isInteracting = true;
    badge.classList.add('is-interacting');
    const rect = badge.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX = ((y - centerY) / centerY) * -14;
    rotateY = ((x - centerX) / centerX) * 14;

    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;

    applyTilt(rotateX, rotateY, gx, gy);
  });

  badge.addEventListener('mouseleave', () => {
    isInteracting = false;
    badge.classList.remove('is-interacting');
    badge.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    applyTilt(0, 0);
    setTimeout(() => {
      badge.style.transition = 'transform 0.12s ease-out';
    }, 400);
  });

  // Mobile DeviceOrientation Gyroscope API
  const handleOrientation = (e) => {
    if (e.beta === null || e.gamma === null) return;
    const maxTilt = 15;
    const baseViewingAngle = 40;
    const beta = Math.max(-maxTilt, Math.min(maxTilt, e.beta - baseViewingAngle));
    const gamma = Math.max(-maxTilt, Math.min(maxTilt, e.gamma));

    isInteracting = true;
    badge.classList.add('is-interacting');
    const gx = 50 + gamma * 2.2;
    const gy = 50 + beta * 2.2;
    applyTilt(-beta, gamma, gx, gy);
  };

  if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
  }

  // Portrait Tap / Click toggle reveal
  if (portraitTrigger) {
    portraitTrigger.addEventListener('click', () => {
      badge.classList.toggle('is-interacting');
      audio.playClick();
    });
  }
}

/* -------------------------------------------------------------
   04. Bento Metric Grid (<app-metric-bento>) with Counting Animations
------------------------------------------------------------- */
function initBentoMetrics() {
  const grid = $('#bento-metric-grid');
  if (!grid) return;

  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;
    audio.playWhoosh();

    const counters = $$('.bento-number', grid);
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1600; // ms
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        // EaseOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = (target * ease).toFixed(decimals);

        el.textContent = `${current}${suffix}`;

        if (progress < 1) {
          if (Math.random() < 0.25) audio.playTick();
          requestAnimationFrame(update);
        } else {
          el.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    });

    setTimeout(() => {
      audio.playChime();
    }, 1650);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(grid);
}

/* -------------------------------------------------------------
   05. Periodic Table of Tech (<app-tech-matrix>)
------------------------------------------------------------- */
const periodicElements = [
  // Languages
  { num: 1, sym: 'Js', name: 'JavaScript', cat: 'LANGUAGES', weight: 'ES2024', role: 'Full-stack runtime, asynchronous event loops, browser APIs.', projects: ['OneOps', 'Robo App', 'Portfolio Core'] },
  { num: 2, sym: 'Ts', name: 'TypeScript', cat: 'LANGUAGES', weight: '5.x', role: 'Strict-mode type system, structural schema safety, interfaces.', projects: ['OneMeal', 'OneFlux', 'OneGaurd'] },
  { num: 3, sym: 'Py', name: 'Python', cat: 'LANGUAGES', weight: '3.11', role: 'Machine learning model pipelines, OpenCV, tensor transformations.', projects: ['AI Stroke Detection'] },
  { num: 4, sym: 'Jv', name: 'Java', cat: 'LANGUAGES', weight: '17', role: 'Object-oriented patterns, algorithm optimization, core systems.', projects: ['Academic Systems'] },
  { num: 5, sym: 'Sq', name: 'SQL', cat: 'LANGUAGES', weight: 'ANSI', role: 'Relational database schemas, indexing, complex query execution.', projects: ['OneMeal', 'MCMH Production'] },

  // Frontend
  { num: 6, sym: 'Re', name: 'React.js', cat: 'FRONTEND', weight: '18.x', role: 'Component hierarchy, concurrent rendering, custom hooks.', projects: ['TechOrbit', 'OneMeal', 'AI Stroke'] },
  { num: 7, sym: 'Vt', name: 'Vite', cat: 'FRONTEND', weight: 'ESM', role: 'Sub-second HMR bundler, Rollup build trees, asset optimization.', projects: ['TechOrbit', 'Portfolio Core'] },
  { num: 8, sym: 'Tw', name: 'Tailwind CSS', cat: 'FRONTEND', weight: '3.x', role: 'Utility-first layout grids, rapid aesthetic composition.', projects: ['TechOrbit', 'OneMeal'] },
  { num: 9, sym: 'Cs', name: 'CSS3 / Vanilla', cat: 'FRONTEND', weight: 'Modern', role: 'Custom properties, 3D perspective transforms, hardware acceleration.', projects: ['Portfolio Core'] },
  { num: 10, sym: 'Lf', name: 'Leaflet GIS', cat: 'FRONTEND', weight: 'Geo', role: 'Interactive geospatial tiles, polyline simplification, crisis routing.', projects: ['TechOrbit', 'OneTravel'] },

  // Backend
  { num: 11, sym: 'Nd', name: 'Node.js', cat: 'BACKEND', weight: '22.x', role: 'Event-driven I/O, child processes, hardware telemetry ingestion.', projects: ['OneOps', 'AI Stroke Gateway'] },
  { num: 12, sym: 'Ex', name: 'Express.js', cat: 'BACKEND', weight: '4.x', role: 'RESTful API routing, streaming middleware, CORS contracts.', projects: ['AI Stroke Detection'] },
  { num: 13, sym: 'Ap', name: 'REST APIs', cat: 'BACKEND', weight: 'HTTP/2', role: 'Stateless endpoints, defensive schema validation, idempotent verbs.', projects: ['OneOps', 'TechOrbit'] },
  { num: 14, sym: 'Jw', name: 'JWT Auth', cat: 'BACKEND', weight: 'OAuth', role: 'Cryptographic bearer tokens, RBAC claims, session revocation.', projects: ['AI Stroke Detection', 'MCMH'] },

  // AI & ML
  { num: 15, sym: 'Tf', name: 'TensorFlow', cat: 'AI_ML', weight: 'Keras', role: 'Deep learning CNN convolutions, medical scan segmentation.', projects: ['AI Stroke Detection'] },
  { num: 16, sym: 'Ge', name: 'Gemini Vision', cat: 'AI_ML', weight: 'Multimodal', role: 'Multimodal image inspection, prompt orchestration, automated grading.', projects: ['OneMeal'] },
  { num: 17, sym: 'Cv', name: 'OpenCV', cat: 'AI_ML', weight: 'Vision', role: 'DICOM windowing, CT slice contrast enhancement, contour maps.', projects: ['AI Stroke Detection'] },

  // Cloud & DevOps
  { num: 18, sym: 'Dk', name: 'Docker', cat: 'CLOUD_DEVOPS', weight: 'Containers', role: 'Isolated runtime sandboxes, automated PR verification containers.', projects: ['OneOps', 'AI Stroke Detection'] },
  { num: 19, sym: 'Aw', name: 'AWS Cloud', cat: 'CLOUD_DEVOPS', weight: 'Cloud', role: 'EC2 instances, S3 object storage, secure IAM boundary policies.', projects: ['Production Infrastructure'] },
  { num: 20, sym: 'Lx', name: 'Linux Shell', cat: 'CLOUD_DEVOPS', weight: 'Bash', role: 'Daemon logs, POSIX system calls, hardware serial bus diagnostics.', projects: ['OneOps', 'Robo App'] },
  { num: 21, sym: 'Gt', name: 'Git & GitHub', cat: 'CLOUD_DEVOPS', weight: 'VCS', role: 'Source tree automation, blame inspection, branching workflows.', projects: ['All 9 Repositories'] },
  { num: 22, sym: 'Ci', name: 'CI/CD Pipelines', cat: 'CLOUD_DEVOPS', weight: 'Actions', role: 'Automated test runners, build gates, edge deployment dispatch.', projects: ['TechOrbit', 'Portfolio Core'] },

  // Databases
  { num: 23, sym: 'Pg', name: 'PostgreSQL', cat: 'DATABASES', weight: 'Relational', role: 'ACID transactions, relational joins, complex query execution.', projects: ['MCMH Production'] },
  { num: 24, sym: 'Sb', name: 'Supabase', cat: 'DATABASES', weight: 'BaaS', role: 'Postgres row-level security, realtime subscriptions, edge functions.', projects: ['MCMH SDE Internship'] },
  { num: 25, sym: 'Mg', name: 'MongoDB', cat: 'DATABASES', weight: 'NoSQL', role: 'Document store, hospital audit log records, indexing.', projects: ['AI Stroke Detection'] },
  { num: 26, sym: 'Fs', name: 'Cloud Firestore', cat: 'DATABASES', weight: 'Realtime', role: 'Live document sync, offline client persistence, optimistic UI.', projects: ['OneMeal'] }
];

const techLogoMap = {
  Js: `<svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="4" fill="#F7DF1E"/><path d="M18.5 19.5c0 3.2 2 4.5 4.5 4.5 1.8 0 3.2-.8 3.8-1.8l-2.2-1.3c-.4.7-1 1-1.6 1-1 0-1.7-.6-1.7-2.1V12h-2.8v7.5zm-8.8 1.8c.8.6 1.8 1.1 2.9 1.1 1.4 0 2.2-.7 2.2-1.7 0-1-.7-1.5-2.2-2.1-2.2-.8-3.4-1.8-3.4-3.6 0-2 1.6-3.4 3.9-3.4 1.4 0 2.4.4 3.1.9l-1 2.1c-.6-.4-1.3-.7-2.1-.7-1 0-1.5.5-1.5 1.2 0 .9.7 1.3 2.2 1.9 2.2.9 3.5 1.9 3.5 3.8 0 2.2-1.7 3.6-4.4 3.6-1.6 0-2.9-.5-3.8-1.1l1.1-2z" fill="#000"/></svg>`,
  Ts: `<svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="4" fill="#3178C6"/><path d="M12.5 13.8v9.7H9.8v-9.7H6v-2.3h10.3v2.3h-3.8zm5.5 7.5c.8.6 1.8 1.1 2.9 1.1 1.4 0 2.2-.7 2.2-1.7 0-1-.7-1.5-2.2-2.1-2.2-.8-3.4-1.8-3.4-3.6 0-2 1.6-3.4 3.9-3.4 1.4 0 2.4.4 3.1.9l-1 2.1c-.6-.4-1.3-.7-2.1-.7-1 0-1.5.5-1.5 1.2 0 .9.7 1.3 2.2 1.9 2.2.9 3.5 1.9 3.5 3.8 0 2.2-1.7 3.6-4.4 3.6-1.6 0-2.9-.5-3.8-1.1l1.1-2z" fill="#fff"/></svg>`,
  Py: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M15.9 4c-5.8 0-5.4 2.5-5.4 2.5l.01 2.6h5.5v.8H8.3S4 9.4 4 15.3c0 5.8 3.8 5.6 3.8 5.6h2.3v-3.2s-.1-3.8 3.7-3.8h5.6s3.6.1 3.6-3.5V6.7S23.5 4 15.9 4zm-2.8 1.8a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fill="#3776AB"/><path d="M16.1 28c5.8 0 5.4-2.5 5.4-2.5l-.01-2.6h-5.5v-.8h7.7s4.3.5 4.3-5.4c0-5.8-3.8-5.6-3.8-5.6h-2.3v3.2s.1 3.8-3.7 3.8h-5.6s-3.6-.1-3.6 3.5v3.7s-.5 2.7 7.1 2.7zm2.8-1.8a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" fill="#FFD438"/></svg>`,
  Jv: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M13 22c5 0 8-1 11-4-2 .8-5 1.2-8 1.2-4 0-6-.7-8-1.8 1.2 2.2 3.6 4.6 5 4.6zm-1-3.5c4 0 7-.8 10-3-2 .5-4 .8-6.5.8-3 0-5-.5-7-1.3.8 1.8 2.3 3.5 3.5 3.5zm7-7.5s2 1.5 0 3c3-.5 4.5-2.5 2-4-3-1.8-6 0-6 0s2-1 4 1zm-4.5 4.5c2.5 0 5-.5 7.5-1.5-2-.5-4-.8-6.5-.8-3 0-5 .4-7 1.2.9 1 3.5 1.1 6 1.1zM24 24c-8 3-17 0-17 0 3 .8 7 1.2 11 1 4-.2 7-1 7-1z" fill="#EA2D2E"/></svg>`,
  Sq: `<svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="8" rx="10" ry="4" fill="#0284c7"/><path d="M6 8v7c0 2.2 4.5 4 10 4s10-1.8 10-4V8" fill="none" stroke="#0284c7" stroke-width="2.2"/><path d="M6 15v7c0 2.2 4.5 4 10 4s10-1.8 10-4v-7" fill="none" stroke="#0284c7" stroke-width="2.2"/></svg>`,
  Re: `<svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="#00D8FF" stroke-width="1.8" transform="rotate(30 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="#00D8FF" stroke-width="1.8" transform="rotate(90 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="#00D8FF" stroke-width="1.8" transform="rotate(150 16 16)"/><circle cx="16" cy="16" r="2.2" fill="#00D8FF"/></svg>`,
  Vt: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M26.8 5.5L16.5 27 6.2 5.5l9.2 1.8 11.4-1.8z" fill="#41D1FF"/><path d="M22 4.5L16 17l-3-4.5L17.5 4l4.5.5z" fill="#BD34FE"/><path d="M16 17l-2 5 2.5-3.5L16 17z" fill="#FFD859"/></svg>`,
  Tw: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 9c-3 0-5.5 1.5-6.5 4.5 1.2-1.5 2.6-2 4-1.5 1 .3 1.7 1.1 2.5 1.9C17.3 15.2 19 17 22.5 17c3 0 5.5-1.5 6.5-4.5-1.2 1.5-2.6 2-4 1.5-1-.3-1.7-1.1-2.5-1.9C21.2 10.8 19.5 9 16 9zm-6.5 8c-3 0-5.5 1.5-6.5 4.5 1.2-1.5 2.6-2 4-1.5 1 .3 1.7 1.1 2.5 1.9C10.8 23.2 12.5 25 16 25c3 0 5.5-1.5 6.5-4.5-1.2 1.5-2.6 2-4 1.5-1-.3-1.7-1.1-2.5-1.9C14.7 18.8 13 17 9.5 17z" fill="#06B6D4"/></svg>`,
  Cs: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M6 4l2.2 21.8L16 28.5l7.8-2.7L26 4H6z" fill="#1572B6"/><path d="M16 6.2v20l6.2-2.1 1.7-17.9H16z" fill="#33A9DC"/><path d="M16 11.5h-5.2l.3 3h4.9v-3zm0 6h-3.4l.2 2.5 3.2.9v-3.4zm0-9h8.3l-.3 3H16v-3zm0 6h5.8l-.5 5.5-5.3 1.5v-7z" fill="#fff"/></svg>`,
  Lf: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M25 6c-8 0-16 8-16 18 0 2 1 3 3 3 8 0 17-9 17-19 0-1-.8-2-4-2zm-6 17c-3-2-6-5-7-9 4 1 8 4 10 7-1 1-2 2-3 2z" fill="#199900"/></svg>`,
  Nd: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 4l10.4 6v12L16 28 5.6 22V10L16 4z" fill="#539E43"/><path d="M13.5 11v10h2.5v-5.5l3 5.5h2.5V11H19v5.5l-3-5.5h-2.5z" fill="#fff"/></svg>`,
  Ex: `<svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#1e293b"/><text x="16" y="21" font-family="sans-serif" font-weight="900" font-size="13" fill="#fff" text-anchor="middle">ex</text></svg>`,
  Ap: `<svg viewBox="0 0 32 32" width="28" height="28"><circle cx="8" cy="16" r="4" fill="#0ea5e9"/><circle cx="24" cy="9" r="4" fill="#10b981"/><circle cx="24" cy="23" r="4" fill="#8b5cf6"/><path d="M12 16h8m-3-4l4 4-4 4" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  Jw: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 4l9 4v7c0 6-4 11-9 13-5-2-9-7-9-13V8l9-4z" fill="#7c3aed"/><circle cx="16" cy="15" r="3" fill="#fff"/><path d="M16 18v3" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  Tf: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 5l8 4.6v9.2L16 23.4V5z" fill="#FF6F00"/><path d="M16 5L8 9.6v9.2l8 4.6V5z" fill="#FFA800"/><path d="M16 14.2l5.5-3.2v6.4L16 20.6v-6.4z" fill="#FF8F00"/></svg>`,
  Ge: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 4c.5 6 5.5 11 11.5 11.5-6 .5-11 5.5-11.5 11.5-.5-6-5.5-11-11.5-11.5 6-.5 11-5.5 11.5-11.5z" fill="url(#geminiGrad)"/><defs><linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4E82EE"/><stop offset="50%" stop-color="#9B72CF"/><stop offset="100%" stop-color="#D96570"/></linearGradient></defs></svg>`,
  Cv: `<svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="10" r="5" fill="#EF4444"/><circle cx="10" cy="21" r="5" fill="#10B981"/><circle cx="22" cy="21" r="5" fill="#3B82F6"/><circle cx="16" cy="10" r="2.2" fill="#fff"/><circle cx="10" cy="21" r="2.2" fill="#fff"/><circle cx="22" cy="21" r="2.2" fill="#fff"/></svg>`,
  Dk: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M28 17.5c-.8 0-1.5.3-2 .8-.7-.4-1.7-.6-2.7-.4l-.8-2h-3v2.8H7c-1.8 0-3 1.2-3 3 0 4.5 4.5 7.5 12 7.5s12.5-4 13-9.5c0-.4-.4-.8-.9-.8h-.1z" fill="#1D63ED"/><rect x="8" y="14" width="2.4" height="2" fill="#1D63ED"/><rect x="11.2" y="14" width="2.4" height="2" fill="#1D63ED"/><rect x="14.4" y="14" width="2.4" height="2" fill="#1D63ED"/><rect x="11.2" y="11.2" width="2.4" height="2" fill="#1D63ED"/><rect x="14.4" y="11.2" width="2.4" height="2" fill="#1D63ED"/></svg>`,
  Aw: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M7 19c6 4.5 12 4.5 18 0" stroke="#FF9900" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M23 16.5l2.5 2.5-3 1" fill="#FF9900"/><text x="16" y="14" font-family="sans-serif" font-weight="900" font-size="9" fill="#232F3E" text-anchor="middle">AWS</text></svg>`,
  Lx: `<svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="18" rx="8" ry="9" fill="#111"/><ellipse cx="16" cy="19" rx="5.5" ry="6.5" fill="#fff"/><circle cx="13" cy="11" r="1.5" fill="#111"/><circle cx="19" cy="11" r="1.5" fill="#111"/><path d="M14 13.5c1 .8 3 .8 4 0l-2 3-2-3z" fill="#FFA500"/><path d="M9 25c2 1 5 1 6 0m2 0c2 1 5 1 6 0" stroke="#FFA500" stroke-width="2" stroke-linecap="round"/></svg>`,
  Gt: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M27 14.5l-9.5-9.5c-.8-.8-2-.8-2.8 0l-9.5 9.5c-.8.8-.8 2 0 2.8l9.5 9.5c.8.8 2 .8 2.8 0l9.5-9.5c.8-.8.8-2 0-2.8z" fill="#F05032"/><circle cx="13" cy="14" r="2" fill="#fff"/><circle cx="19" cy="12" r="2" fill="#fff"/><circle cx="19" cy="20" r="2" fill="#fff"/><path d="M13 14h3v6h3m-3-6v-2h3" stroke="#fff" stroke-width="1.6" fill="none"/></svg>`,
  Ci: `<svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="10" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="14 4"/><circle cx="16" cy="16" r="4" fill="#10b981"/><path d="M16 6v3m0 14v3m10-10h-3M9 16H6" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  Pg: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 5c-5.5 0-9 4-9 8.5 0 3 1.5 5.5 4 7v4.5l3-2h2c5.5 0 9-4 9-8.5S21.5 5 16 5z" fill="#336791"/><path d="M14 11a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="#fff"/></svg>`,
  Sb: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M17.5 4.5l-9 12.5h8.5l-3 10.5 11-14h-8.5l3-9z" fill="#3ECF8E"/></svg>`,
  Mg: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M16 4s6 6 6 12c0 4.5-3 8-6 12-3-4-6-7.5-6-12 0-6 6-12 6-12z" fill="#47A248"/><path d="M16 6v21c-.5-.5-1-1.2-1-2 0-3 1-8 1-19z" fill="#3FA037"/></svg>`,
  Fs: `<svg viewBox="0 0 32 32" width="28" height="28"><path d="M7 23l1.5-15.5 5 5L7 23z" fill="#FFA000"/><path d="M16.5 4.5L7 23l18-3.5L16.5 4.5z" fill="#FFC400"/><path d="M25 19.5l-3.5-13L7 23l18-3.5z" fill="#FF8F00"/></svg>`
};

function initPeriodicTechMatrix() {
  const grid = $('#periodic-tech-grid');
  const filterBar = $('#tech-filter-bar');
  const panel = $('#element-inspector-panel');
  if (!grid || !filterBar) return;

  let activeFilter = 'ALL';
  let flipIntervalId = null;
  let flipStepIndex = 0;
  let isGridHovered = false;

  function renderGrid() {
    grid.innerHTML = periodicElements
      .map((elem) => {
        const isDimmed = activeFilter !== 'ALL' && elem.cat !== activeFilter;
        const logoSvg = techLogoMap[elem.sym] || `<span style="font-weight:700;font-size:1.1rem">${elem.sym}</span>`;

        return `
        <div 
          class="tech-flip-card ${isDimmed ? 'is-dimmed' : ''}" 
          data-element-num="${elem.num}"
          data-cat="${elem.cat}"
          role="button"
          tabindex="0"
          aria-label="${elem.name} (${elem.sym})">
          <div class="tech-flip-inner">
            <!-- Front Face: Periodic Chemical Element -->
            <div class="tech-face tech-face-front">
              <div class="elem-top-row">
                <span class="elem-num">${elem.num}</span>
                <span class="elem-weight">${elem.weight}</span>
              </div>
              <span class="elem-sym">${elem.sym}</span>
              <span class="elem-name">${elem.name}</span>
              <span class="elem-cat">${elem.cat.replace('_', ' ')}</span>
            </div>
            <!-- Back Face: Mechanical Watch Logo Face -->
            <div class="tech-face tech-face-back">
              <div class="watch-gear-notch" aria-hidden="true"></div>
              <div class="tech-logo-svg-wrap">
                ${logoSvg}
              </div>
              <span class="tech-back-name">${elem.name}</span>
              <span class="tech-back-pill">${elem.cat.replace('_', ' ')}</span>
            </div>
          </div>
        </div>`;
      })
      .join('');
  }

  function showInspector(num) {
    const elem = periodicElements.find((e) => e.num === num);
    if (!elem || !panel) return;
    const logoSvg = techLogoMap[elem.sym] || `<span style="font-weight:700">${elem.sym}</span>`;

    panel.innerHTML = `
      <div class="inspector-content">
        <div class="inspector-symbol-box" style="display:flex;align-items:center;justify-content:center;background:#faf5ff;border-color:#8b5cf6">
          <div style="transform:scale(1.15)">${logoSvg}</div>
        </div>
        <div>
          <h3 class="inspector-name">${elem.name} <span style="font-size:0.85rem;color:#8b5cf6">(${elem.sym})</span></h3>
          <span class="inspector-category">${elem.cat.replace('_', ' ')} · ${elem.weight}</span>
          <p class="inspector-usage">${elem.role}</p>
        </div>
        <div class="inspector-projects">
          <span class="inspector-proj-title">EVIDENCE IN PRODUCTION</span>
          <div class="inspector-proj-tags">
            ${elem.projects.map((p) => `<span class="tech-chip">${p}</span>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // Mechanical Watch-Like Auto-Flip Engine
  function startWatchAutoFlip() {
    stopWatchAutoFlip();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    flipIntervalId = setInterval(() => {
      if (isGridHovered) return;
      const cards = $$('.tech-flip-card:not(.is-dimmed)', grid);
      if (!cards.length) return;

      // Staggered rhythmic mechanical flip of 2 cards across the board
      const cardA = cards[flipStepIndex % cards.length];
      const cardB = cards[(flipStepIndex + 7) % cards.length];

      if (cardA && !cardA.matches(':hover')) {
        cardA.classList.toggle('is-flipped');
      }
      if (cardB && !cardB.matches(':hover')) {
        setTimeout(() => {
          if (!isGridHovered) cardB.classList.toggle('is-flipped');
        }, 300);
      }

      flipStepIndex = (flipStepIndex + 1) % cards.length;
    }, 1500);
  }

  function stopWatchAutoFlip() {
    if (flipIntervalId) {
      clearInterval(flipIntervalId);
      flipIntervalId = null;
    }
  }

  // Hover over the grid: Immediately PAUSE auto-flip
  grid.addEventListener('mouseenter', () => {
    isGridHovered = true;
    stopWatchAutoFlip();
  });

  // Leaving the grid: Resume gentle auto-flip
  grid.addEventListener('mouseleave', () => {
    isGridHovered = false;
    startWatchAutoFlip();
  });

  // When cursor comes onto any card: Stop and flip to TECH STACK face visible!
  grid.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.tech-flip-card');
    if (!card) return;
    isGridHovered = true;
    stopWatchAutoFlip();

    // Ensure the hovered card is flipped to the tech stack / logo side
    card.classList.add('is-flipped');
    const num = parseInt(card.dataset.elementNum, 10);
    showInspector(num);
  });

  // Click card toggles flip and plays audio
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.tech-flip-card');
    if (!card) return;
    card.classList.toggle('is-flipped');
    const num = parseInt(card.dataset.elementNum, 10);
    showInspector(num);
    audio.playClick();
    audio.triggerHaptic(8);
  });

  // Filter Buttons
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tech-filter]');
    if (!btn) return;
    activeFilter = btn.dataset.techFilter;
    $$('.tech-filter-btn', filterBar).forEach((b) => b.classList.toggle('is-active', b === btn));
    renderGrid();
    startWatchAutoFlip();
    audio.playClick();
    audio.triggerHaptic(10);
  });

  renderGrid();
  showInspector(1);
  startWatchAutoFlip();
}

/* -------------------------------------------------------------
   06. Horizontal Project Showcase with Auto-Glide, Drag & Audio
------------------------------------------------------------- */
function initHorizontalProjectReel() {
  const track = $('#horizontal-reel-track');
  const container = $('#horizontal-reel-container');
  const statusDot = $('.glide-status-dot');
  const statusText = $('#glide-status-text');
  const prevBtn = $('#reel-prev-btn');
  const nextBtn = $('#reel-next-btn');

  if (!track || !container) return;

  // Render cards in exact priority order 1 to 9
  track.innerHTML = portfolioData.projects
    .map((project) => {
      const liveBtn = project.demo
        ? `<a class="action-btn action-live" href="${project.demo}" target="_blank" rel="noopener noreferrer">LIVE ↗</a>`
        : '';
      const githubBtn = project.github
        ? `<a class="action-btn action-github" href="${project.github}" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>`
        : '';

      return `
      <article class="reel-card" data-project-id="${project.id}">
        <div class="card-meta-bar">
          <span class="card-number">${project.number}</span>
          <span class="card-category">${cleanText(project.category)}</span>
        </div>
        
        <h3 class="card-title">
          <button type="button" class="card-title-btn" data-open-case="${project.id}">
            ${cleanText(project.title)}
          </button>
        </h3>
        
        <p class="card-tagline">${cleanText(project.tagline)}</p>
        
        <div class="card-schematic" aria-hidden="true">
          <div class="schematic-inner">
            <span class="schematic-label">SYSTEM ARCHITECTURE</span>
            <code class="schematic-flow">${cleanText(project.architecture)}</code>
          </div>
        </div>
        
        <div class="card-chips">
          ${project.technologies
            .slice(0, 5)
            .map((tech) => `<span class="tech-chip">${cleanText(tech)}</span>`)
            .join('')}
        </div>
        
        <div class="card-action-bar">
          <button type="button" class="action-btn action-case" data-open-case="${project.id}">
            CASE STUDY →
          </button>
          ${liveBtn}
          ${githubBtn}
        </div>
      </article>`;
    })
    .join('');

  // Continuous auto-glide engine
  function glideStep() {
    if (!isReelPaused && container) {
      container.scrollLeft += reelSpeed;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 2) {
        container.scrollLeft = 0;
      }
    }
    reelAnimFrameId = requestAnimationFrame(glideStep);
  }

  // Hover pauses gliding
  container.addEventListener('mouseenter', () => {
    isReelPaused = true;
    if (statusText) statusText.textContent = '❚❚ PAUSED';
    if (statusDot) statusDot.classList.add('is-paused');
  });

  container.addEventListener('mouseleave', () => {
    isReelPaused = false;
    if (statusText) statusText.textContent = 'SLOW GLIDE';
    if (statusDot) statusDot.classList.remove('is-paused');
  });

  // Manual Prev / Next arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      audio.playWhoosh();
      container.scrollBy({ left: -420, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      audio.playWhoosh();
      container.scrollBy({ left: 420, behavior: 'smooth' });
    });
  }

  // Mouse drag-to-scroll
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('button, a')) return;
    isDragging = true;
    isReelPaused = true;
    container.classList.add('is-dragging');
    startX = e.pageX - container.offsetLeft;
    startScrollLeft = container.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      container.classList.remove('is-dragging');
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = startScrollLeft - walk;
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reelAnimFrameId = requestAnimationFrame(glideStep);
  }
}

/* -------------------------------------------------------------
   07. Experience Timeline
------------------------------------------------------------- */
function initExperienceSection() {
  const container = $('#experience-list');
  if (!container) return;

  container.innerHTML = portfolioData.experience
    .map(
      (item) => `
    <article class="timeline-item open">
      <button type="button" class="timeline-trigger" aria-expanded="true">
        <span class="timeline-period">${cleanText(item.period)}</span>
        <strong class="timeline-company">${cleanText(item.company)}</strong>
        <em class="timeline-role">${cleanText(item.role)}</em>
      </button>
      <div class="timeline-detail">
        <p class="timeline-desc">${cleanText(item.description)}</p>
        <div class="timeline-stack">
          ${item.stack.map((tech) => `<span class="tech-chip">${cleanText(tech)}</span>`).join('')}
        </div>
        <ul class="timeline-bullets">
          ${item.points.map((pt) => `<li>${cleanText(pt)}</li>`).join('')}
        </ul>
      </div>
    </article>`
    )
    .join('');

  container.addEventListener('click', (e) => {
    const trigger = e.target.closest('.timeline-trigger');
    if (!trigger) return;
    const parent = trigger.closest('.timeline-item');
    const isNowOpen = parent.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isNowOpen));
    audio.playClick();
  });
}

/* -------------------------------------------------------------
   08. The Lab Builds
------------------------------------------------------------- */
function initLabSection() {
  const container = $('#lab-list');
  if (!container) return;

  container.innerHTML = portfolioData.labBuilds
    .map(
      (lab) => `
    <article class="lab-card">
      <div class="lab-tag-row">
        <span class="lab-tag">${cleanText(lab.tag)}</span>
      </div>
      <h3 class="lab-title">${cleanText(lab.name)}</h3>
      <p class="lab-desc">${cleanText(lab.description)}</p>
      <div class="lab-tech">${cleanText(lab.tech)}</div>
      <div class="lab-links">
        ${lab.demo ? `<a class="lab-link" href="${lab.demo}" target="_blank" rel="noopener noreferrer">LIVE DEMO ↗</a>` : ''}
        ${lab.github ? `<a class="lab-link" href="${lab.github}" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>` : ''}
      </div>
    </article>`
    )
    .join('');
}

/* -------------------------------------------------------------
   09. Contact Section
------------------------------------------------------------- */
function initContactSection() {
  const { profile } = portfolioData;
  const container = $('#contact-links');
  if (!container) return;

  const links = [
    ['EMAIL', `mailto:${profile.email}`, false],
    ['PHONE', `tel:${profile.phone.replace(/[^0-9+]/g, '')}`, false],
    ['GITHUB', profile.social.github, true],
    ['LINKEDIN', profile.social.linkedin, true],
    ['RESUME (PDF)', '/assets/resume/Piyush_Sonawane_Resume.pdf', true]
  ];

  container.innerHTML = links
    .map(
      ([label, url, external]) => `
    <a class="contact-pill-btn" href="${url}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
      ${label} →
    </a>`
    )
    .join('');
}

/* -------------------------------------------------------------
   09b. 3D Pixar Avatar Interaction & Waving Sound Effects
------------------------------------------------------------- */
function initPixarAvatarInteraction() {
  const card = $('#avatar-interactive-card');
  const speechBubble = $('#avatar-speech-bubble');
  const waveIcon = $('#bubble-wave-icon');

  if (!card) return;

  // 3D card tilt tracking cursor
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  card.addEventListener('mouseenter', () => {
    audio.playWhoosh();
    audio.triggerHaptic(12);
  });

  card.addEventListener('click', () => {
    audio.playChime();
    audio.triggerHaptic([15, 30, 20]);
    if (speechBubble) {
      speechBubble.style.transform = 'scale(1.15)';
      setTimeout(() => {
        speechBubble.style.transform = '';
      }, 350);
    }
  });
}

function initPreziPortal() {
  const portal = $('#prezi-portal');
  if (!portal) return;

  portal.addEventListener('click', () => {
    triggerSpatialFlight('#about');
  });
}

/* -------------------------------------------------------------
   10. First Viewport Portrait & Parallax
------------------------------------------------------------- */
function initPortraitInteraction() {
  const portraitBtn = $('#portrait-trigger');
  const hero = $('#hero');
  const portrait = $('.portrait');
  const heroWord = $('.hero-word');
  const sigLeft = $('.signature-left');
  const sigRight = $('.signature-right');

  if (portraitBtn) {
    portraitBtn.addEventListener('click', () => {
      portraitBtn.classList.toggle('is-color');
      audio.playClick();
    });
  }

  if (
    hero &&
    portrait &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(pointer: fine)').matches
  ) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      portrait.style.transform = `translate3d(${normX * 8}px, ${normY * 8}px, 0)`;
      if (heroWord) {
        heroWord.style.transform = `translate(-50%, -50%) translate3d(${normX * -4}px, ${normY * -4}px, 0)`;
      }
      if (sigLeft) {
        sigLeft.style.transform = `rotate(-14deg) translate3d(${normX * 5}px, ${normY * 5}px, 0)`;
      }
      if (sigRight) {
        sigRight.style.transform = `rotate(-12deg) translate3d(${normX * 5}px, ${normY * 5}px, 0)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      portrait.style.transform = '';
      if (heroWord) heroWord.style.transform = 'translate(-50%, -50%)';
      if (sigLeft) sigLeft.style.transform = 'rotate(-14deg)';
      if (sigRight) sigRight.style.transform = 'rotate(-12deg)';
    });
  }
}

/* -------------------------------------------------------------
   11. Case Study Modal & Legal Dialogs
------------------------------------------------------------- */
function initDialogHandlers() {
  const caseDialog = $('#case-dialog');
  const caseContent = $('#case-dialog-content');
  const caseClose = $('#case-dialog-close');

  const privacyDialog = $('#privacy-dialog');
  const privacyOpen = $('#open-privacy-btn');
  const privacyClose = $('#privacy-close');

  const termsDialog = $('#terms-dialog');
  const termsOpen = $('#open-terms-btn');
  const termsClose = $('#terms-close');

  $$('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });

  if (caseClose && caseDialog) {
    caseClose.addEventListener('click', () => caseDialog.close());
  }

  // Open Case Study Modal
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-case]');
    if (!trigger) return;
    const projectId = trigger.dataset.openCase;
    const project = portfolioData.projects.find((p) => p.id === projectId);
    if (!project || !caseDialog || !caseContent) return;

    audio.playWhoosh();

    caseContent.innerHTML = `
      <div class="case-modal-header">
        <span class="case-eyebrow">PROJECT ${project.number} · ${cleanText(project.category)}</span>
        <h2 class="case-modal-title" id="case-dialog-title">${cleanText(project.title)}</h2>
        <p class="case-modal-tagline">${cleanText(project.tagline)}</p>
      </div>

      <div class="case-modal-grid">
        <div class="case-main-col">
          <section class="case-section">
            <h4 class="case-heading">System Overview</h4>
            <p>${cleanText(project.summary)}</p>
          </section>

          <section class="case-section">
            <h4 class="case-heading">Architecture & Flow</h4>
            <pre class="case-code-block"><code>${cleanText(project.architecture)}</code></pre>
          </section>

          <section class="case-section">
            <h4 class="case-heading">Key Technical Highlights</h4>
            <ul class="case-highlights">
              ${project.highlights.map((h) => `<li>${cleanText(h)}</li>`).join('')}
            </ul>
          </section>

          <section class="case-section">
            <h4 class="case-heading">Engineering Decisions & Trade-offs</h4>
            <p>${cleanText(project.engineeringDecisions)}</p>
          </section>

          <section class="case-section">
            <h4 class="case-heading">Challenges Overcome</h4>
            <p>${cleanText(project.challenges)}</p>
          </section>

          <section class="case-section">
            <h4 class="case-heading">What I Learned</h4>
            <p>${cleanText(project.lessonsLearned)}</p>
          </section>
        </div>

        <aside class="case-side-col">
          <div class="side-box">
            <h4 class="case-heading">Project DNA</h4>
            <dl class="dna-list">
              ${Object.entries(project.dna)
                .map(
                  ([k, v]) => `
                <div class="dna-pair">
                  <dt>${cleanText(k)}</dt>
                  <dd>${cleanText(v)}</dd>
                </div>`
                )
                .join('')}
            </dl>
          </div>

          <div class="side-box">
            <h4 class="case-heading">Stack</h4>
            <div class="card-chips">
              ${project.technologies.map((t) => `<span class="tech-chip">${cleanText(t)}</span>`).join('')}
            </div>
          </div>

          <div class="side-box case-actions-box">
            ${project.demo ? `<a class="action-btn action-live" href="${project.demo}" target="_blank" rel="noopener noreferrer">OPEN LIVE DEMO ↗</a>` : ''}
            ${project.github ? `<a class="action-btn action-github" href="${project.github}" target="_blank" rel="noopener noreferrer">VIEW REPOSITORY ↗</a>` : ''}
          </div>
        </aside>
      </div>`;

    caseDialog.showModal();
  });

  if (privacyOpen && privacyDialog) {
    privacyOpen.addEventListener('click', () => privacyDialog.showModal());
  }
  if (privacyClose && privacyDialog) {
    privacyClose.addEventListener('click', () => privacyDialog.close());
  }

  if (termsOpen && termsDialog) {
    termsOpen.addEventListener('click', () => termsDialog.showModal());
  }
  if (termsClose && termsDialog) {
    termsClose.addEventListener('click', () => termsDialog.close());
  }
}

/* -------------------------------------------------------------
   12. Command Palette (⌘K) & Prezi-Style Camera Navigation
------------------------------------------------------------- */
function initCommandPalette() {
  const dialog = $('#command-dialog');
  const input = $('#command-input');
  const list = $('#command-list');
  const triggerBtn = $('#cmd-k-btn');
  const orbitTrigger = $('#hero-orbit-trigger');

  if (!dialog || !input || !list) return;

  const entries = [
    { label: '01 · Professional Identity (About)', target: '#about', type: 'section' },
    { label: '02 · Verified Milestones (Metrics)', target: '#metrics', type: 'section' },
    { label: '03 · Selected Work (Priority Projects)', target: '#work', type: 'section' },
    { label: '04 · Production Practice (Experience)', target: '#experience', type: 'section' },
    { label: '05 · Periodic Table of Tech (Stack)', target: '#stack', type: 'section' },
    { label: '06 · The Lab (Repositories)', target: '#lab', type: 'section' },
    { label: '07 · Contact & Dispatch', target: '#contact', type: 'section' },
    { label: 'Audio Toggle (Mute / Unmute)', target: 'action:audio', type: 'action' },
    { label: 'Resume (PDF)', target: '/assets/resume/Piyush_Sonawane_Resume.pdf', type: 'external' },
    { label: 'Privacy Policy', target: 'action:privacy', type: 'action' },
    { label: 'Terms & Conditions', target: 'action:terms', type: 'action' },
    ...portfolioData.projects.map((p) => ({
      label: `Project: ${cleanText(p.title)}`,
      target: `case:${p.id}`,
      type: 'project'
    }))
  ];

  function renderMatches(query = '') {
    const q = query.trim().toLowerCase();
    const matched = entries.filter((e) => e.label.toLowerCase().includes(q));

    list.innerHTML = matched
      .map(
        (m) => `
      <button type="button" class="command-item-btn" data-target="${m.target}">
        <span class="cmd-item-label">${m.label}</span>
        <span class="cmd-item-arrow">↵</span>
      </button>`
      )
      .join('');
  }

  function openPalette() {
    audio.playWhoosh();
    input.value = '';
    renderMatches('');
    dialog.showModal();
    input.focus();
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openPalette);
  if (orbitTrigger) orbitTrigger.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) {
        dialog.close();
      } else {
        openPalette();
      }
    }
  });

  input.addEventListener('input', () => {
    audio.playTick();
    renderMatches(input.value);
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-target]');
    if (!btn) return;
    const target = btn.dataset.target;
    dialog.close();

    if (target.startsWith('#')) {
      triggerSpatialFlight(target);
    } else if (target === 'action:audio') {
      audio.toggleSound();
    } else if (target.startsWith('case:')) {
      const projId = target.replace('case:', '');
      const opener = $(`[data-open-case="${projId}"]`);
      if (opener) opener.click();
    } else if (target === 'action:privacy') {
      $('#privacy-dialog')?.showModal();
    } else if (target === 'action:terms') {
      $('#terms-dialog')?.showModal();
    } else {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  });
}

// Prezi-style spatial camera flight effect between sections
function triggerSpatialFlight(targetSelector) {
  const el = $(targetSelector);
  const stage = $('.stage');
  if (!el) return;

  audio.playWhoosh();
  audio.triggerHaptic(15);

  if (stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stage.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    stage.style.transform = 'scale(0.985) translate3d(0, -4px, 0)';

    el.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      stage.style.transform = 'none';
      setTimeout(() => {
        stage.style.transition = '';
      }, 450);
    }, 450);
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/* -------------------------------------------------------------
   13. PWA Installation
------------------------------------------------------------- */
function initPwaInstall() {
  const installBtn = $('#install-app-btn');
  if (!installBtn) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.style.display = 'none';
      audio.playChime();
      audio.triggerHaptic([10, 30, 10]);
    }
    deferredInstallPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredInstallPrompt = null;
  });
}

/* -------------------------------------------------------------
   14. Navigation Spy & Sticky Highlighting
------------------------------------------------------------- */
function initNavigationHighlighting() {
  const sections = $$('[data-section]');
  const navLinks = $$('.section-nav .nav-link, .mobile-nav a');

  // Intercept section nav clicks for spatial flight
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        e.preventDefault();
        triggerSpatialFlight(hash);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach((s) => observer.observe(s));
}

function initScrollHeader() {
  const nav = $('#section-nav');
  window.addEventListener(
    'scroll',
    () => {
      if (!nav) return;
      if (window.scrollY > window.innerHeight * 0.8) {
        nav.classList.add('is-sticky');
      } else {
        nav.classList.remove('is-sticky');
      }
    },
    { passive: true }
  );
}

/* -------------------------------------------------------------
   15. Offline Banner & Service Worker
------------------------------------------------------------- */
function initOfflineBanner() {
  const banner = $('#offline-banner');
  if (!banner) return;

  const update = () => banner.classList.toggle('visible', !navigator.onLine);
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

function initServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}
