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

let deferredInstallPrompt = null;
let reelAnimFrameId = null;
let isReelPaused = false;
let reelSpeed = 0.55; // Pixels per frame

document.addEventListener('DOMContentLoaded', () => {
  initProfileData();
  initHorizontalProjectReel();
  initExperienceSection();
  initTechnicalUniverse('Frontend');
  initLabSection();
  initContactSection();
  initPortraitInteraction();
  initPwaInstall();
  initNavigationHighlighting();
  initScrollHeader();
  initDialogHandlers();
  initCommandPalette();
  initOfflineBanner();
  initServiceWorker();
});

/* -------------------------------------------------------------
   01. Profile & Academic Foundations
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
   02. Horizontal Project Showcase with Auto-Glide & Drag
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

  // Auto-gliding engine via requestAnimationFrame
  function glideStep() {
    if (!isReelPaused && container) {
      container.scrollLeft += reelSpeed;
      // Loop seamlessly when near end
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

  // Manual Prev / Next arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -420, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: 420, behavior: 'smooth' });
    });
  }

  // Mouse drag-to-scroll implementation
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  container.addEventListener('mousedown', (e) => {
    // Avoid interfering with buttons or links
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

  // Start continuous gliding
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reelAnimFrameId = requestAnimationFrame(glideStep);
  }
}

/* -------------------------------------------------------------
   03. Experience Timeline
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

  // Accordion toggle
  container.addEventListener('click', (e) => {
    const trigger = e.target.closest('.timeline-trigger');
    if (!trigger) return;
    const parent = trigger.closest('.timeline-item');
    const isNowOpen = parent.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isNowOpen));
  });
}

/* -------------------------------------------------------------
   04. Technical Universe (DNA Board)
------------------------------------------------------------- */
function initTechnicalUniverse(activeCategory = 'Frontend') {
  const categories = portfolioData.technicalUniverse.categories;
  const board = $('#dna-board');
  const panel = $('#tech-panel');
  if (!board || !panel) return;

  const current = categories.find((c) => c.name.toLowerCase().includes(activeCategory.toLowerCase())) || categories[0];

  board.innerHTML = categories
    .map(
      (cat) => `
    <button type="button" class="dna-category-btn ${cat.name === current.name ? 'is-active' : ''}" data-category-name="${cat.name}">
      <span class="dna-cat-title">${cleanText(cat.name)}</span>
      <small class="dna-cat-count">${cat.skills.length} tools</small>
    </button>`
    )
    .join('');

  panel.innerHTML = `
    <div class="tech-panel-header">
      <span class="eyebrow">${cleanText(current.name).toUpperCase()} ARCHITECTURE</span>
    </div>
    <div class="tech-grid">
      ${current.skills
        .map(
          (skill) => `
        <div class="tech-card">
          <span class="tech-card-title">${cleanText(skill)}</span>
        </div>`
        )
        .join('')}
    </div>`;

  board.onclick = (e) => {
    const btn = e.target.closest('[data-category-name]');
    if (btn) {
      initTechnicalUniverse(btn.dataset.categoryName);
    }
  };
}

/* -------------------------------------------------------------
   05. The Lab Builds
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
   06. Contact Section
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
   07. First Viewport Portrait & Parallax
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
    });
  }

  // Subtle interactive cursor parallax
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
   08. Case Study Modal & Legal Modals
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

  // Generic close click on backdrop
  $$('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });

  if (caseClose && caseDialog) {
    caseClose.addEventListener('click', () => caseDialog.close());
  }

  // Open case study from cards
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-case]');
    if (!trigger) return;
    const projectId = trigger.dataset.openCase;
    const project = portfolioData.projects.find((p) => p.id === projectId);
    if (!project || !caseDialog || !caseContent) return;

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

  // Privacy Dialog
  if (privacyOpen && privacyDialog) {
    privacyOpen.addEventListener('click', () => privacyDialog.showModal());
  }
  if (privacyClose && privacyDialog) {
    privacyClose.addEventListener('click', () => privacyDialog.close());
  }

  // Terms Dialog
  if (termsOpen && termsDialog) {
    termsOpen.addEventListener('click', () => termsDialog.showModal());
  }
  if (termsClose && termsDialog) {
    termsClose.addEventListener('click', () => termsDialog.close());
  }
}

/* -------------------------------------------------------------
   09. Command Palette (⌘K)
------------------------------------------------------------- */
function initCommandPalette() {
  const dialog = $('#command-dialog');
  const input = $('#command-input');
  const list = $('#command-list');
  const triggerBtn = $('#cmd-k-btn');
  const orbitTrigger = $('#hero-orbit-trigger');

  if (!dialog || !input || !list) return;

  const entries = [
    { label: '01 · About Piyush', target: '#about', type: 'section' },
    { label: '02 · Selected Work', target: '#work', type: 'section' },
    { label: '03 · Production Experience', target: '#experience', type: 'section' },
    { label: '04 · Technical Universe', target: '#stack', type: 'section' },
    { label: '05 · The Lab Repositories', target: '#lab', type: 'section' },
    { label: '06 · Contact & Dispatch', target: '#contact', type: 'section' },
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

  input.addEventListener('input', () => renderMatches(input.value));

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-target]');
    if (!btn) return;
    const target = btn.dataset.target;
    dialog.close();

    if (target.startsWith('#')) {
      const el = $(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
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

/* -------------------------------------------------------------
   10. PWA Installation
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
    }
    deferredInstallPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredInstallPrompt = null;
  });
}

/* -------------------------------------------------------------
   11. Navigation Spy & Sticky Highlighting
------------------------------------------------------------- */
function initNavigationHighlighting() {
  const sections = $$('[data-section]');
  const navLinks = $$('.section-nav .nav-link, .mobile-nav a');

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
   12. Offline Banner & Service Worker
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
