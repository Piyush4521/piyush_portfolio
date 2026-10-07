# Piyush Sonawane --- Portfolio PWA

> **Production build specification / source of truth**
>
> This document defines the product, visual identity, UX, interaction
> rules, Angular architecture, PWA behavior, performance requirements,
> accessibility requirements, project-content strategy, testing, CI/CD,
> deployment, and implementation sequence for the portfolio.

------------------------------------------------------------------------

## 0. Non-Negotiable Product Rule

### The first viewport is LOCKED.

The approved reference design is the visual source of truth for the
opening experience.

**Do not redesign, reinterpret, simplify, rearrange, or replace the
first screen.**

The following are locked:

-   Portrait position
-   Portrait scale and crop
-   Black-and-white editorial treatment
-   `ABOUT` typography and placement
-   Handwritten `Piyush`
-   Handwritten `Sonawane`
-   Top-left logo/name treatment
-   `WEB DEVELOPER` micro-label
-   `+ Install App` button placement and general appearance
-   Social icons at the bottom-left
-   Circular indicator on the right
-   Whitespace and composition
-   Monochrome visual language
-   Browser-like presentation shown in the approved concept
-   Desktop hero composition
-   Mobile hero composition

The first viewport is the **identity of the product**.

New functionality must be implemented as progressive enhancement without
disturbing the approved composition.

> **HERO IMMUTABILITY:** The initial viewport must preserve the approved
> visual composition exactly. Functionality may react to the user, but
> it must not alter the approved hierarchy, positioning, typography,
> imagery, whitespace, or primary controls.

------------------------------------------------------------------------

# 1. Product Vision

This is not a résumé website.

It is a **minimalist editorial engineering portfolio PWA** that
communicates:

-   who Piyush is
-   how Piyush thinks
-   what Piyush builds
-   how Piyush engineers systems
-   what Piyush has learned
-   where Piyush works/has worked
-   how to contact or hire Piyush

The experience should feel like:

> **60% editorial magazine + 25% engineering system + 15% restrained
> playful interaction.**

The interface should never shout for attention.

> **Interaction philosophy: reward curiosity, do not demand attention.**

Target feeling:

``` text
LOOK
  ↓
NOTICE
  ↓
MOVE
  ↓
DISCOVER
  ↓
CLICK
  ↓
EXPLORE
```

Avoid:

``` text
20 animations
↓
popup
↓
gradient
↓
noise
↓
video
↓
more noise
```

------------------------------------------------------------------------

# 2. Visual Direction

## 2.1 Core aesthetic

Use:

-   Editorial typography
-   Large serif display text
-   Handwritten/script personal signature
-   High-quality portrait photography
-   Monochrome first
-   Restrained gray tones
-   Generous whitespace
-   Thin borders
-   Tiny utility typography
-   Fine circular indicators
-   Minimal controls
-   Subtle motion
-   Hand-drawn/ink-inspired details
-   Technical diagrams that feel editorial rather than corporate

Do not turn the site into:

-   A generic SaaS landing page
-   A neon developer portfolio
-   A glassmorphism showcase
-   A dashboard
-   A GitHub clone
-   A résumé PDF rendered as HTML
-   A 3D-heavy experiment

------------------------------------------------------------------------

# 3. First-Visit Experience

When a visitor opens the site, the first thing they should see is the
approved hero.

Conceptual structure:

``` text
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  Piyush                          + Install App                 │
│  Sonawane                                                     │
│  WEB DEVELOPER                                                │
│                                                               │
│                                                               │
│                         [ PORTRAIT ]                           │
│                                                               │
│                         A B O U T                              │
│                                                               │
│              Piyush                   Sonawane                 │
│                                                               │
│  social icons                                      ○          │
│                                                   •           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

Do not add a conventional hero CTA such as:

-   `Hire Me`
-   `View My Work`
-   `Get Started`

unless it can be incorporated without changing the approved composition.

The design already communicates curiosity and invites scrolling.

------------------------------------------------------------------------

# 4. Interaction System

The site should be playful **without becoming visually noisy**.

## 4.1 Portrait

Default:

``` css
filter: grayscale(100%) contrast(1.1);
```

Hover:

``` css
filter: grayscale(0%) contrast(1);
```

Target transition:

-   400--600ms
-   `ease-in-out`
-   GPU-friendly properties only
-   No layout movement

Use the transparent color portrait as the source asset.

Preferred implementation:

``` text
portrait-bw
      +
portrait-color
      ↓
stacked layers
      ↓
opacity / mask reveal
```

Optional advanced interaction:

-   soft radial color reveal around the pointer
-   color develops like a photograph
-   no hard circular mask
-   no glow
-   no neon

If pointer interaction is unavailable, use a normal tap/focus
interaction.

### Accessibility

Never make color the only way to understand the interaction.

Support:

-   keyboard focus
-   touch
-   reduced motion
-   semantic accessible labels

------------------------------------------------------------------------

## 4.2 Subtle parallax

Pointer movement may influence:

``` text
Portrait      ±3px
ABOUT         ±1px
Name          ±2px
Background    ±0.5px
```

Rules:

-   Never move layout boxes.
-   Use `transform`.
-   Keep movement extremely subtle.
-   Disable/reduce for `prefers-reduced-motion`.
-   Do not create scroll-jacking.
-   Do not make text difficult to read.

------------------------------------------------------------------------

## 4.3 Circular indicator

The existing circular indicator on the right is part of the approved
design.

Do not replace it with a large custom cursor.

It may:

-   subtly respond to pointer position
-   change state when hovering an interactive element
-   indicate navigation/scroll state

Cursor states can be:

``` text
DEFAULT
○ •

LINK
◉

PROJECT
VIEW →

IMAGE
COLOR →

DRAG
← →
```

Keep these states tiny and editorial.

------------------------------------------------------------------------

## 4.4 Ink reveal

Use the idea of physical ink appearing on paper.

Examples:

-   `Piyush` → subtle handwritten underline
-   `Sonawane` → subtle handwritten underline
-   `ABOUT` → slight darkening
-   Project title → thin underline/reveal
-   Image → grayscale-to-color transition

Avoid generic:

``` css
transform: scale(1.1);
box-shadow: ...
```

for every hover.

------------------------------------------------------------------------

# 5. Scroll Experience

The first viewport is the cover of the magazine.

Scrolling opens the magazine.

Primary flow:

``` text
HERO
  ↓
ABOUT
  ↓
SELECTED WORK
  ↓
PROJECT CASE STUDIES
  ↓
EXPERIENCE
  ↓
TECHNICAL UNIVERSE
  ↓
LAB
  ↓
CONTACT
```

The hero should transform into the About experience rather than simply
being duplicated.

Possible scroll progression:

``` text
Hero portrait
    ↓
Portrait transitions toward About
    ↓
ABOUT becomes section label
    ↓
Content becomes readable
```

Do not:

-   lock the page into artificial scroll stages
-   hijack wheel/touch events
-   prevent normal browser scrolling
-   create excessive scroll-triggered animation

------------------------------------------------------------------------

# 6. Information Architecture

Recommended top-level routes:

``` text
/
├── about
├── work
│   └── :slug
├── experience
├── stack
├── lab
└── contact
```

Potential route behavior:

``` text
/                  → editorial landing experience
/about             → about section/page
/work              → selected projects
/work/one-meal     → OneMeal case study
/work/ai-stroke    → AI Stroke Detection case study
/work/oneops       → OneOps case study
/work/me-and-myself → Me & Myself case study
/experience        → experience
/stack             → technical universe
/lab               → smaller builds
/contact           → contact
```

Routes can also support in-page section navigation if the final UX
favors a single-scroll experience.

### Important

Do not create unnecessary pages just to demonstrate routing.

Routing exists to improve:

-   shareability
-   deep linking
-   accessibility
-   SEO
-   navigation
-   case-study discoverability

------------------------------------------------------------------------

# 7. Portfolio Content Hierarchy

The portfolio should not present every GitHub repository equally.

Current portfolio inventory includes:

### Flagship candidates

-   OneMeal
-   AI Stroke Detection System
-   OneOps
-   Me & Myself

### Other builds / lab candidates

-   OneTravel
-   OneFlux
-   OneTest
-   OneGaurd
-   Robo
-   KH147-TechOrbit

### Existing portfolio/reference implementation

-   Portfolio_core

The repository contents/readmes should be revalidated before final
classification.

Use these categories:

``` text
FLAGSHIP
DEEP-DIVE
FEATURED
LAB / EXPERIMENT
UTILITY / SMALL BUILD
ARCHIVED / OMIT
```

Do not invent project details that are not supported by the repositories
or supplied materials.

------------------------------------------------------------------------

# 8. Selected Work

Do not use a conventional equal-card grid as the primary presentation.

Use editorial compositions.

Example:

``` text
01 ─────────────────────────────

ONE MEAL

AI-powered food distribution
platform

[ LARGE PROJECT VISUAL ]

React      Firebase      Gemini
Maps       TypeScript

                           VIEW CASE STUDY →
```

Then:

``` text
02 ─────────────────────────────

AI STROKE DETECTION

Computer vision + full-stack
medical imaging system

[ LARGE PROJECT VISUAL ]

React      Node
TensorFlow MongoDB
Docker

                           VIEW CASE STUDY →
```

Project images should follow the same interaction language:

``` text
DEFAULT → B&W
HOVER   → COLOR
CLICK   → CASE STUDY
```

------------------------------------------------------------------------

# 9. Project Case Study Standard

Every flagship project should have a deep-dive page.

Required sections:

## 9.1 Overview

Answer:

-   What is it?
-   Why was it built?
-   What problem does it solve?
-   Who is it for?
-   What did Piyush build?

## 9.2 Role

Explicitly state contribution:

``` text
Architecture
Frontend
Backend
API integration
Database
AI/ML integration
Testing
Deployment
```

Only include responsibilities actually supported by project evidence.

## 9.3 Project DNA

Example:

``` text
Frontend       React
Backend        Node
Database       Firebase
AI             Gemini
Maps           ...
Deployment     ...
```

Do not show a technology simply because it is familiar; show
technologies actually used by the project.

## 9.4 Architecture

Use editorial technical diagrams.

Example:

``` text
                 ┌─────────────┐
                 │    USER     │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │   FRONTEND  │
                 └──────┬──────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       DATABASE        AI           MAPS
          │
          ▼
       SERVICES
```

Architecture diagrams should be:

-   technically accurate
-   minimal
-   monochrome first
-   lightly hand-drawn/editorial
-   readable on mobile

Never invent architecture that is not supported by the repository.

## 9.5 What I Built

Examples:

``` text
AUTHENTICATION
API INTEGRATION
DATABASE LAYER
AI PIPELINE
LOCATION SYSTEM
VALIDATION
ERROR HANDLING
```

Only include verified functionality.

## 9.6 Engineering Decisions

Explain:

``` text
Why this framework?
Why this database?
Why this AI service?
Why this deployment model?
Why this architecture?
```

The purpose is to demonstrate technical reasoning rather than badge
collecting.

## 9.7 Challenges

Use:

``` text
PROBLEM
  ↓
INVESTIGATION
  ↓
SOLUTION
  ↓
RESULT
```

## 9.8 What I Learned

Examples:

-   Designing around users
-   Handling external API failure
-   Managing asynchronous workflows
-   Establishing frontend/backend boundaries

Use project-specific lessons rather than generic statements.

## 9.9 If I Built It Again

Include:

``` text
What I would change
What I would simplify
What I would scale differently
What I would test differently
```

This demonstrates engineering maturity.

## 9.10 Links

Where available:

``` text
LIVE DEMO →
GITHUB →
```

Never show a broken live-demo link.

------------------------------------------------------------------------

# 10. Project Transition

When opening a project:

``` text
PROJECT THUMBNAIL
       ↓
IMAGE EXPANDS
       ↓
PROJECT TITLE
       ↓
CASE STUDY
```

The transition should feel like the selected project becomes the new
page.

Avoid heavy page-transition libraries unless they provide a measurable
UX benefit.

Prefer:

-   CSS transforms
-   opacity
-   clip-path where appropriate
-   Angular route transitions only where safe
-   GPU-friendly properties

------------------------------------------------------------------------

# 11. About Section

Do not start with:

> Hello, I am Piyush...

Prefer a strong editorial statement:

``` text
ABOUT

I BUILD
SOFTWARE
THAT WORKS.

Full-stack systems.
AI-enabled applications.
APIs.
Cloud infrastructure.
Developer tooling.
```

Then provide concise professional context.

The professional narrative should position Piyush as a software engineer
building full-stack and AI-enabled systems across frontend, backend,
databases, AI/ML, testing, deployment, and DevOps.

------------------------------------------------------------------------

# 12. Experience

Primary experience:

``` text
MCMH
Software Development Engineer Intern
```

Present it as engineering work, not just a résumé entry.

Possible timeline:

``` text
2026
│
● MCMH
│
│ Software Development
│ Engineer Intern
│
│ React · TypeScript
│ Supabase · REST APIs
│ Git
│
└────────────
```

Include only verified responsibilities.

------------------------------------------------------------------------

# 13. Technical Universe

Avoid a wall of skill badges.

Desktop concept:

``` text
                 AI / ML

       FRONTEND          BACKEND

                 PIYUSH

       DATABASE           CLOUD

                  DEVOPS
```

Technology relationships can illuminate on hover.

Example:

``` text
TensorFlow
   │
   ├── Python
   ├── AI / ML
   └── Image Analysis
```

Mobile:

-   no complex orbit
-   use clean categorized lists
-   keep all information accessible

Suggested categories:

``` text
Frontend
Backend
Languages
Databases
AI / ML
Cloud
DevOps
Testing
Tools
```

Do not list technologies without evidence.

------------------------------------------------------------------------

# 14. GitHub Integration

GitHub should support the portfolio, not become the portfolio.

Potential section:

``` text
GITHUB

11 BUILDS

        ●
      ●   ●
   ●    ●    ●
      ●    ●
   ●       ●
        ●

EXPLORE REPOSITORIES →
```

Each dot may represent a repository.

Interaction:

``` text
Hover → repository name
Click → repository
```

Keep it subtle.

Do not turn the website into a GitHub analytics dashboard.

Avoid live GitHub API calls on the initial page unless they provide a
real product benefit.

For performance and reliability, prefer build-time/static portfolio data
for the primary experience.

------------------------------------------------------------------------

# 15. Lab

Smaller projects belong in:

``` text
LAB
```

Potential entries:

``` text
OneTravel
OneFlux
OneTest
OneGaurd
Robo
KH147-TechOrbit
Me & Myself
```

Each item can show:

``` text
name
one-line description
category
technology
GitHub link
```

Do not give every experiment a 1,000-word case study.

This section communicates:

> continuous experimentation and building.

------------------------------------------------------------------------

# 16. Currently Building

Optional small section:

``` text
CURRENTLY BUILDING

Portfolio PWA

Angular
Signals
Tailwind
Firebase

STATUS
██████████████░░
```

Make this data-driven.

Do not use a fake percentage unless it represents a meaningful project
state.

Prefer status values such as:

``` text
PLANNING
BUILDING
TESTING
POLISHING
SHIPPED
```

------------------------------------------------------------------------

# 17. Contact

Keep contact minimal.

``` text
LET'S BUILD
SOMETHING.

Have an interesting problem?

Email me →
LinkedIn →
GitHub →
Resume →
```

Avoid unnecessary contact-form complexity unless spam protection and
backend handling are properly designed.

------------------------------------------------------------------------

# 18. Resume

The résumé is an artifact, not the website.

Provide:

``` text
VIEW RESUME
DOWNLOAD RESUME
```

Do not render the entire résumé as the primary portfolio experience.

The portfolio should answer:

> What is it like to work with Piyush?

The résumé answers:

> What are Piyush's formal qualifications and history?

------------------------------------------------------------------------

# 19. PWA Requirements

The PWA must be useful, not decorative.

Required:

-   Web App Manifest
-   Angular service worker
-   Offline shell
-   Install experience
-   Cache strategy
-   Appropriate icons
-   Maskable icon
-   Standalone display
-   Theme metadata
-   Offline fallback state

Offline-accessible content should include:

-   About
-   Projects
-   Experience
-   Skills
-   Contact
-   Resume

External project demos naturally require network connectivity.

------------------------------------------------------------------------

# 20. Install Prompt

Keep the existing:

``` text
+ Install App
```

button.

Behavior:

``` text
Install available
      ↓
Show button

Already installed
      ↓
Hide button

Unsupported
      ↓
Hide button
```

Capture `beforeinstallprompt` without triggering the browser prompt
immediately.

Use a dedicated:

``` text
InstallPromptService
```

Responsibilities:

-   capture event
-   expose install availability through a Signal
-   trigger installation on user action
-   detect installed state
-   clear stored prompt event after use

For iOS/Safari or browsers without `beforeinstallprompt`, show a concise
manual-install instruction sheet only where useful.

Never pretend the native prompt is available when it is not.

------------------------------------------------------------------------

# 21. Offline UX

Do not show a generic browser error.

Use an editorial state:

``` text
OFFLINE

The portfolio is still available.

You can explore the work saved
on this device.

● Cached
```

The offline state should be visually consistent with the rest of the
design.

------------------------------------------------------------------------

# 22. Angular Technology Strategy

Use modern Angular with:

-   Standalone components
-   Signals
-   Computed state
-   Effects only when side effects are genuinely required
-   Lazy routes where beneficial
-   Modern Angular control flow
-   Strict TypeScript
-   Angular CLI
-   Modern production builder
-   SCSS for complex visual behavior
-   Tailwind for utility/layout styling

Do not introduce NgModules for new application architecture.

Do not introduce a global state library unless the application genuinely
needs it.

Static portfolio content does not require Redux-style state management.

------------------------------------------------------------------------

# 23. Angular Architecture

Recommended:

``` text
src/app/
├── core/
│   ├── models/
│   │   └── portfolio.model.ts
│   └── services/
│       ├── portfolio.service.ts
│       ├── install-prompt.service.ts
│       └── theme.service.ts
│
├── layout/
│   ├── app-shell/
│   ├── desktop-sidebar/
│   ├── mobile-bottom-nav/
│   └── install-app-button/
│
├── features/
│   ├── portfolio/
│   │   ├── portfolio-container/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── selected-work/
│   │   ├── project-detail/
│   │   ├── experience/
│   │   ├── technical-universe/
│   │   ├── lab/
│   │   └── contact/
│   │
│   └── command-palette/
│
├── shared/
│   ├── tag/
│   ├── hand-drawn-divider/
│   ├── project-image/
│   ├── section-label/
│   └── editorial-link/
│
├── app.component.ts
└── app.routes.ts
```

------------------------------------------------------------------------

# 24. Component Responsibilities

## AppComponent

Owns:

-   global shell
-   router outlet
-   global accessibility behavior
-   high-level layout

It should not contain project data.

## PortfolioContainer

Owns:

-   portfolio data retrieval
-   high-level Signals
-   data passed into presentational components

## HeroComponent

Owns:

-   locked hero composition
-   portrait interaction
-   circular indicator
-   install button placement
-   social icon placement

The Hero must not become a general-purpose UI playground.

## ProjectGrid / SelectedWork

Owns:

-   project ordering
-   editorial project presentations
-   project hover interactions
-   links to case studies

## ProjectDetail

Owns:

-   case study content
-   architecture
-   engineering decisions
-   project links
-   related projects

------------------------------------------------------------------------

# 25. State Management

Use Signals.

Example conceptual state:

``` ts
readonly portfolio = signal<PortfolioData | null>(null);

readonly projects = computed(
  () => this.portfolio()?.projects ?? []
);

readonly featuredProjects = computed(
  () => this.projects().filter(project => project.featured)
);
```

Use `effect()` only for actual side effects such as:

-   document metadata
-   analytics where appropriate
-   installation state
-   controlled DOM integration

Do not use effects as a replacement for ordinary computed derivation.

------------------------------------------------------------------------

# 26. Data Model

Create strict interfaces.

Conceptually:

``` ts
interface PortfolioData {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  socialLinks: SocialLink[];
  availability: Availability;
  navigation: NavigationItem[];
}
```

Project:

``` ts
interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  description: string;
  featured: boolean;
  technologies: Technology[];
  responsibilities: string[];
  images: ProjectImage[];
  links: ProjectLinks;
  caseStudy?: CaseStudy;
}
```

Keep content separate from presentation.

------------------------------------------------------------------------

# 27. Data Source

Primary content should be static and typed.

Recommended:

``` text
src/assets/data/portfolio.json
```

Potentially split later:

``` text
src/assets/data/
├── profile.json
├── projects.json
├── experience.json
├── skills.json
└── navigation.json
```

Start with one source if it remains manageable.

Do not create a backend merely to store portfolio text.

------------------------------------------------------------------------

# 28. Styling Strategy

Use:

### Tailwind

For:

-   layout
-   spacing
-   responsive behavior
-   flex/grid
-   typography utilities
-   sizing
-   standard states

### SCSS

For:

-   portrait reveal
-   complex editorial animations
-   hand-drawn borders
-   advanced masks
-   pointer interaction
-   bespoke keyframes

Do not create giant global SCSS files containing every component style.

Prefer component-scoped styles.

------------------------------------------------------------------------

# 29. Design Tokens

Define design tokens before implementing components.

Conceptual groups:

``` text
COLOR
--paper
--ink
--ink-muted
--line
--gray-1
--gray-2

TYPOGRAPHY
--font-display
--font-body
--font-script
--font-mono

SPACING
--space-1
--space-2
...
--space-section

MOTION
--ease-editorial
--duration-fast
--duration-normal
--duration-slow
```

Use CSS variables for values that need global consistency.

------------------------------------------------------------------------

# 30. Typography Rules

Typography is one of the most important parts of the design.

Use distinct roles:

``` text
Display serif
→ ABOUT
→ major section headings

Script
→ Piyush
→ Sonawane
→ signature elements

Sans-serif
→ body/UI

Monospace
→ technical metadata / code-like information
```

Do not use more fonts than necessary.

Typography should preserve:

-   letter spacing
-   line height
-   scale
-   weight
-   whitespace
-   editorial hierarchy

Avoid overly bold UI typography.

------------------------------------------------------------------------

# 31. Color System

Primary palette:

``` text
Paper / near-white
Black / near-black
Warm gray
Neutral gray
```

Color is an interaction/reveal layer, not the default visual language.

Use color for:

-   portrait reveal
-   project image reveal
-   selected state
-   meaningful status
-   small interaction accents

Do not introduce:

-   neon purple
-   neon blue
-   rainbow gradients
-   generic AI gradients
-   large colorful backgrounds

------------------------------------------------------------------------

# 32. Images

Use the supplied transparent portrait as the primary hero source.

Prepare optimized variants:

``` text
portrait.webp
portrait.avif (if pipeline supports it)
portrait-bw.webp
portrait-color.webp
```

Use appropriate responsive image sizes.

Do not ship a huge source image to every device.

Use:

``` html
<picture>
  ...
</picture>
```

where it provides meaningful optimization.

Hero/LCP image must be prioritized appropriately.

Non-critical project images should be lazy-loaded.

------------------------------------------------------------------------

# 33. Responsive Design

Do not treat mobile as scaled desktop.

### Desktop

Use:

-   editorial canvas
-   large portrait
-   sidebar/floating utility navigation if part of final design
-   generous horizontal whitespace
-   pointer interactions

### Mobile

Use:

-   top identity
-   portrait
-   editorial content
-   bottom navigation
-   touch interactions
-   reduced motion
-   simplified diagrams

The mobile reference is a separate composition.

------------------------------------------------------------------------

# 34. Touch Interaction Rules

Hover is enhancement only.

Every important action must work with:

-   tap
-   keyboard
-   focus
-   screen reader interaction where applicable

Touch targets should be comfortably tappable.

Do not hide essential functionality behind hover.

------------------------------------------------------------------------

# 35. Command Palette

Optional but recommended.

Shortcut:

``` text
Cmd/Ctrl + K
```

Commands:

``` text
About
Selected Work
Experience
Stack
Lab
GitHub
Resume
Contact
```

Rules:

-   keyboard accessible
-   Escape closes
-   arrow keys navigate
-   Enter activates
-   focus is trapped while open
-   no page scroll behind modal
-   reduced-motion friendly

Do not show the command palette by default.

------------------------------------------------------------------------

# 36. Easter Eggs

Maximum:

-   1--2 meaningful Easter eggs

Potential examples:

``` text
Typing "hello"
Typing "piyush"
Custom 404
Konami code
```

Rules:

-   never required
-   never block navigation
-   never affect performance
-   never create accessibility problems
-   never make the portfolio look unserious

------------------------------------------------------------------------

# 37. Animation Rules

### Use

-   opacity
-   transform
-   filter
-   clip-path where measured
-   mask where justified

### Avoid

-   layout-heavy animation
-   width/height animation where unnecessary
-   constant infinite animation
-   scroll-jacking
-   large blur animations
-   expensive canvas effects
-   particle systems

Every animation should answer:

> Why does this animation exist?

If there is no strong answer, remove it.

------------------------------------------------------------------------

# 38. Reduced Motion

Respect:

``` css
@media (prefers-reduced-motion: reduce)
```

Disable or greatly simplify:

-   parallax
-   portrait transitions
-   page transitions
-   ink animations
-   cursor movement
-   large reveal animations

The content and interaction model must remain usable.

------------------------------------------------------------------------

# 39. Accessibility

Target WCAG 2.2 AA-level practices.

Requirements:

-   semantic HTML
-   correct heading hierarchy
-   keyboard navigation
-   visible focus
-   accessible names
-   alt text
-   sufficient contrast
-   no color-only meaning
-   reduced-motion support
-   logical reading order
-   accessible dialogs
-   accessible mobile navigation
-   accessible links
-   no hover-only essential content

Do not sacrifice accessibility for visual fidelity.

The design can remain minimalist while still being accessible.

------------------------------------------------------------------------

# 40. SEO

Implement:

-   unique `<title>` per route
-   meta description
-   canonical URLs
-   Open Graph metadata
-   Twitter/X metadata where useful
-   semantic headings
-   structured data where appropriate
-   sitemap
-   robots.txt
-   descriptive image alt text
-   clean URLs

The homepage should clearly communicate:

``` text
Piyush Sonawane
Software Engineer
Full-stack / AI / Systems
```

Avoid keyword stuffing.

------------------------------------------------------------------------

# 41. Performance

Primary performance principles:

1.  Small initial JavaScript
2.  No unnecessary third-party libraries
3.  Lazy-load secondary features
4.  Optimize hero images
5.  Preload only truly critical assets
6.  Use modern image formats
7.  Avoid runtime GitHub API calls for core content
8.  Use Angular lazy routes where valuable
9.  Use `@defer` for non-critical UI where appropriate
10. Keep animations GPU-friendly
11. Avoid huge fonts/images
12. Cache stable assets through the PWA service worker

Target:

``` text
Lighthouse Performance     95+
Accessibility              95+
Best Practices             95+
SEO                        95+
```

Ultimate goal:

``` text
100 / 100 / 100 / 100
```

But never compromise real UX simply to manipulate Lighthouse.

------------------------------------------------------------------------

# 42. Core Web Vitals

Pay particular attention to:

-   LCP
-   CLS
-   INP

Hero image must not cause layout shift.

Reserve image dimensions.

Do not load decorative JavaScript before the hero becomes usable.

The first meaningful render should be fast.

------------------------------------------------------------------------

# 43. Service Worker Strategy

Use Angular's service worker.

Conceptual strategy:

``` text
APP SHELL
→ prefetch

STATIC ASSETS
→ cache

PROJECT IMAGES
→ lazy/cache strategy

NON-CACHED EXTERNAL DEMOS
→ network dependent
```

Do not cache private/personal data.

Do not implement overly aggressive cache rules that make deployments
appear stale indefinitely.

Plan a versioning/update strategy.

------------------------------------------------------------------------

# 44. Firebase Hosting

Use Firebase Hosting for deployment if it remains the chosen hosting
platform.

Requirements:

-   HTTPS
-   CDN
-   SPA fallback
-   caching headers
-   production domain
-   preview deployments where useful

For Angular routing, configure fallback to the application entry point.

Never expose secrets in frontend configuration.

------------------------------------------------------------------------

# 45. Environment Configuration

Separate:

``` text
development
production
```

Do not put secrets in:

``` text
environment.ts
```

if they are truly secret.

Remember:

> Anything shipped to the browser is public.

Firebase client configuration is not a secret by itself, but privileged
credentials must never be shipped.

------------------------------------------------------------------------

# 46. GitHub Actions

CI should run on pull requests and pushes to the production branch.

Recommended pipeline:

``` text
Checkout
   ↓
Setup Node
   ↓
npm ci
   ↓
Lint
   ↓
Unit tests
   ↓
Production build
   ↓
PWA/build verification
   ↓
Deploy
```

Production deployment should occur only after validation passes.

Use:

``` text
npm ci
```

rather than:

``` text
npm install
```

in CI.

------------------------------------------------------------------------

# 47. Git Strategy

Recommended branches:

``` text
main
develop
feature/*
fix/*
```

If working solo, a simpler model is acceptable:

``` text
main
feature/*
```

Commit examples:

``` text
feat: add editorial hero
feat: add project case studies
feat: add PWA install prompt
fix: correct mobile hero spacing
perf: optimize portrait assets
a11y: improve keyboard navigation
docs: update architecture plan
```

Keep commits focused.

------------------------------------------------------------------------

# 48. Testing

## Unit tests

Test:

-   PortfolioService
-   computed Signals
-   install state
-   data transformations
-   utility functions

## Component tests

Test:

-   Hero
-   navigation
-   project card
-   project detail
-   command palette
-   install button

## E2E tests

Test:

``` text
Open homepage
→ Hero visible

Navigate projects
→ project opens

Open case study
→ correct project

Open command palette
→ keyboard navigation works

Install button
→ appropriate browser behavior

Offline
→ cached shell opens
```

------------------------------------------------------------------------

# 49. Visual Regression

Because the first screen is pixel-sensitive, visual regression testing
is strongly recommended.

Capture screenshots at defined viewport sizes:

``` text
Desktop
1440×900
1366×768
1920×1080

Tablet
1024×1366
834×1194

Mobile
390×844
375×812
```

Compare against the approved reference.

The hero should have a dedicated visual regression test.

------------------------------------------------------------------------

# 50. Pixel-Accuracy Rules

When implementing the locked hero:

Measure, do not guess.

Record:

-   viewport-relative positions
-   max content width
-   portrait width/height
-   typography sizes
-   letter spacing
-   line heights
-   element offsets
-   button dimensions
-   icon dimensions
-   border widths
-   corner radius
-   spacing
-   image crop
-   z-index layers

Use CSS variables for measured values.

Example:

``` css
:root {
  --hero-max-width: ...;
  --hero-portrait-width: ...;
  --hero-title-size: ...;
}
```

Do not randomly tweak values until it "looks close."

Use screenshot comparison.

------------------------------------------------------------------------

# 51. Pixel-Accuracy Priority Order

When matching the reference, optimize in this order:

1.  Overall composition
2.  Portrait scale/position
3.  Main typography
4.  Handwritten name placement
5.  Header/logo
6.  Install button
7.  Social icons
8.  Circular indicator
9.  whitespace
10. fine borders/details

If the portrait is wrong, changing a 1px border will not fix the design.

------------------------------------------------------------------------

# 52. What NOT to Change in the Hero

Never independently decide to:

-   add gradients
-   change fonts
-   change the portrait
-   move the portrait
-   enlarge the logo
-   add a large CTA
-   add a navbar over the hero
-   add cards
-   add floating blobs
-   add particles
-   add 3D objects
-   add a video background
-   add a giant cursor
-   add a loading screen
-   add excessive animation

If a new feature conflicts with the reference, the reference wins.

------------------------------------------------------------------------

# 53. Desktop Navigation

The navigation should stay secondary to the visual composition.

Possible navigation model:

``` text
Home
Projects
About
Contact
```

Additional:

``` text
Experience
Stack
Lab
```

Navigation can appear as a desktop sidebar or subtle utility layer
according to the approved visual system.

Do not turn it into a conventional SaaS navbar.

------------------------------------------------------------------------

# 54. Mobile Navigation

Use the reference's bottom-navigation concept:

``` text
Home
Projects
About
Contact
```

Requirements:

-   accessible labels
-   active state
-   safe-area support
-   touch-friendly
-   no obstruction of content
-   keyboard/assistive technology support

------------------------------------------------------------------------

# 55. Status Indicator

Optional:

``` text
● ONLINE
```

Offline:

``` text
○ OFFLINE
CACHED VERSION
```

If used, keep it tiny.

It should reinforce the PWA concept rather than become a dashboard
element.

------------------------------------------------------------------------

# 56. Security

Requirements:

-   no frontend secrets
-   sanitize dynamic content
-   safe external links
-   appropriate `rel` attributes
-   CSP where practical
-   HTTPS only in production
-   dependency auditing
-   avoid unnecessary third-party scripts
-   do not inject unsanitized HTML

Do not render Markdown/HTML from project data without sanitization.

------------------------------------------------------------------------

# 57. Dependencies

Prefer a small dependency footprint.

Before adding a package ask:

``` text
Can Angular do this?
Can CSS do this?
Can browser APIs do this?
Is the dependency worth its bundle cost?
Will it improve maintainability?
```

Do not install a library simply because it makes a 20-line
CSS/TypeScript task easier.

------------------------------------------------------------------------

# 58. Icon Strategy

Use a consistent icon set.

Rules:

-   same stroke weight
-   same visual size
-   accessible labels
-   no random icon styles
-   no emoji for primary UI
-   keep icons visually subordinate

Social icons should match the approved reference.

------------------------------------------------------------------------

# 59. Typography Loading

Font loading must be performance-conscious.

Rules:

-   subset fonts if possible
-   preload only critical fonts
-   use `font-display`
-   avoid 6--10 font families
-   provide sensible fallback stacks

The visual identity depends heavily on typography, so font selection
should be locked before detailed spacing work.

------------------------------------------------------------------------

# 60. Content Rules

Portfolio content must be:

-   truthful
-   concise
-   technically specific
-   evidence-based
-   grammatically clean
-   easy to scan

Avoid:

> Passionate developer who loves turning ideas into reality.

Prefer:

> Built full-stack applications spanning frontend interfaces, APIs,
> databases, AI integrations, testing, and deployment.

Do not exaggerate project scale or responsibilities.

------------------------------------------------------------------------

# 61. Project Evidence Rule

Before writing a project case study:

1.  Read repository README.
2.  Inspect repository structure.
3.  Identify actual frameworks.
4.  Identify actual services.
5.  Identify actual database.
6.  Identify actual AI/ML components.
7.  Inspect screenshots/demo if available.
8.  Identify deployment evidence.
9.  Separate implemented features from planned features.
10. Write only verified claims.

No invented architecture.

No invented metrics.

No invented users.

No invented production scale.

------------------------------------------------------------------------

# 62. Project Classification Workflow

For each repository:

``` text
Repository
    ↓
README
    ↓
Source structure
    ↓
Technologies
    ↓
Features
    ↓
Screenshots/demo
    ↓
Engineering depth
    ↓
Portfolio category
```

Classification:

``` text
FLAGSHIP
→ full case study

FEATURED
→ strong project presentation

LAB
→ compact presentation

UTILITY
→ short listing

ARCHIVED
→ GitHub only / not shown
```

------------------------------------------------------------------------

# 63. Recommended Featured Hierarchy

Initial candidates:

``` text
1. OneMeal
2. AI Stroke Detection
3. OneOps
4. Me & Myself
```

But this is provisional.

Final order must be based on actual repository evidence and the quality
of the available visuals/demos.

------------------------------------------------------------------------

# 64. Analytics

If analytics are used:

-   privacy-conscious
-   minimal
-   no invasive tracking
-   lazy-load analytics
-   never block page rendering
-   do not track unnecessary personal information

Track only useful product events, such as:

``` text
project opened
resume opened
external demo clicked
GitHub clicked
contact clicked
PWA install
```

------------------------------------------------------------------------

# 65. Accessibility + Visual Design Rule

Do not use:

> "Pixel perfect"

as an excuse for inaccessible UI.

If a visual treatment conflicts with:

-   keyboard navigation
-   contrast
-   text alternatives
-   reduced motion
-   readable text

the solution should preserve the visual intent while making the
interaction accessible.

------------------------------------------------------------------------

# 66. Performance + Visual Design Rule

Do not use a 10 MB animation because it looks cool.

Prefer:

``` text
CSS
SVG
optimized WebP/AVIF
small JS
Angular primitives
```

Use JavaScript only when it provides a meaningful interaction that CSS
cannot reasonably provide.

------------------------------------------------------------------------

# 67. Loading Experience

Do not create a fake loading screen.

The browser should see useful content immediately.

If an actual loading state is required for data, keep it minimal.

For static portfolio data, there should normally be no artificial
loader.

------------------------------------------------------------------------

# 68. Error Handling

Create a custom 404 consistent with the editorial language.

Example:

``` text
404

THIS PAGE
DOESN'T EXIST.

← BACK TO THE PORTFOLIO
```

Offline:

``` text
OFFLINE

THE PORTFOLIO IS STILL AVAILABLE.

● CACHED
```

Avoid generic framework error pages.

------------------------------------------------------------------------

# 69. Recommended Development Order

## Phase 0 --- Evidence

Before coding:

-   inspect all repositories
-   inspect resume
-   inspect existing portfolio
-   inspect hero reference
-   inspect portrait assets
-   classify projects
-   verify project claims

Deliverable:

``` text
content-map.md
```

------------------------------------------------------------------------

## Phase 1 --- Design Lock

Create:

``` text
design-system.md
```

Lock:

-   fonts
-   typography
-   colors
-   spacing
-   hero measurements
-   breakpoints
-   image treatment
-   animation timings
-   interaction states

Deliverable:

**approved design system**

------------------------------------------------------------------------

## Phase 2 --- Angular Foundation

Create:

-   Angular project
-   standalone architecture
-   strict TypeScript
-   routing
-   Tailwind
-   SCSS
-   linting
-   formatting
-   test foundation

Do not build every feature yet.

------------------------------------------------------------------------

## Phase 3 --- Hero First

Build only:

-   app shell
-   hero
-   portrait
-   logo
-   Install App button
-   social icons
-   circular indicator

Then perform screenshot comparison.

**Do not proceed until the hero is visually approved.**

------------------------------------------------------------------------

## Phase 4 --- Hero Interaction

Add:

-   grayscale/color reveal
-   subtle pointer response
-   ink reveal
-   keyboard/touch behavior
-   reduced motion

Run visual regression again.

------------------------------------------------------------------------

## Phase 5 --- About

Build:

-   About
-   profile
-   professional narrative
-   subtle portrait transition

------------------------------------------------------------------------

## Phase 6 --- Selected Work

Build:

-   project data model
-   project renderer
-   editorial project presentations
-   grayscale/color project images
-   project navigation

------------------------------------------------------------------------

## Phase 7 --- Case Studies

Build:

-   overview
-   architecture
-   role
-   Project DNA
-   engineering decisions
-   challenges
-   lessons
-   rebuild/reflection
-   GitHub/demo

------------------------------------------------------------------------

## Phase 8 --- Experience

Build:

-   MCMH
-   timeline
-   responsibilities
-   technology context

------------------------------------------------------------------------

## Phase 9 --- Technical Universe

Build:

-   skill categories
-   desktop constellation/orbit
-   mobile categorized list
-   subtle interaction

------------------------------------------------------------------------

## Phase 10 --- Lab

Build:

-   smaller repository list
-   compact descriptions
-   GitHub links
-   optional GitHub constellation

------------------------------------------------------------------------

## Phase 11 --- Contact

Build:

-   minimal contact section
-   social links
-   resume links

------------------------------------------------------------------------

## Phase 12 --- Command Palette

Build only after core UX is stable.

------------------------------------------------------------------------

## Phase 13 --- PWA

Add:

-   manifest
-   icons
-   service worker
-   caching
-   install prompt
-   offline state
-   update strategy

------------------------------------------------------------------------

## Phase 14 --- SEO + Accessibility

Complete:

-   metadata
-   structured data
-   sitemap
-   robots
-   keyboard navigation
-   focus states
-   alt text
-   contrast
-   reduced motion

------------------------------------------------------------------------

## Phase 15 --- Testing

Run:

-   unit tests
-   component tests
-   E2E
-   visual regression
-   responsive tests
-   PWA tests
-   offline tests

------------------------------------------------------------------------

## Phase 16 --- Performance

Audit:

-   bundle
-   images
-   fonts
-   JavaScript
-   LCP
-   CLS
-   INP
-   caching

------------------------------------------------------------------------

## Phase 17 --- CI/CD

Implement:

``` text
PR
 ↓
lint
 ↓
test
 ↓
build
 ↓
audit
```

Production:

``` text
main
 ↓
CI
 ↓
build
 ↓
Firebase Hosting
```

------------------------------------------------------------------------

# 70. Definition of Done

The portfolio is not finished because:

``` text
ng build
```

works.

It is finished when:

### Visual

-   Hero matches approved reference
-   Responsive compositions match approved direction
-   Typography is consistent
-   Spacing is deliberate
-   Interactions are subtle
-   No visual noise

### UX

-   Navigation is obvious without being intrusive
-   Projects are easy to discover
-   Case studies are easy to scan
-   Contact is easy to find
-   Mobile experience is first-class

### Engineering

-   Strict TypeScript
-   Standalone Angular
-   Signals used appropriately
-   Typed content models
-   Lazy loading where beneficial
-   Small dependency footprint
-   Maintainable architecture

### PWA

-   Installable
-   Offline shell works
-   Manifest valid
-   Icons valid
-   Cache strategy works
-   Updates work correctly

### Accessibility

-   Keyboard accessible
-   Screen-reader friendly
-   Focus visible
-   Reduced motion
-   Good contrast
-   Touch accessible

### SEO

-   Titles
-   descriptions
-   canonical URLs
-   social metadata
-   sitemap
-   robots
-   structured data where appropriate

### Performance

-   optimized images
-   optimized fonts
-   minimal JS
-   no unnecessary runtime network requests
-   strong Core Web Vitals

### Deployment

-   CI passes
-   production build passes
-   Firebase deployment works
-   HTTPS works
-   SPA routes work on refresh

------------------------------------------------------------------------

# 71. Final Do / Don't List

## DO

-   Preserve the approved hero exactly.
-   Measure before adjusting pixels.
-   Use the transparent portrait.
-   Keep the monochrome-first language.
-   Reveal color through interaction.
-   Use subtle motion.
-   Use Signals for UI state.
-   Keep content data-driven.
-   Verify project claims against repositories.
-   Give flagship projects deep case studies.
-   Put smaller builds into Lab.
-   Make mobile a deliberate composition.
-   Support touch and keyboard.
-   Respect reduced motion.
-   Optimize images.
-   Keep dependencies minimal.
-   Test the hero visually.
-   Make the PWA genuinely useful.
-   Keep the site fast.
-   Keep the interface calm.

## DON'T

-   Redesign the first screen.
-   Add random gradients.
-   Add neon.
-   Add glassmorphism everywhere.
-   Add particles.
-   Add excessive 3D.
-   Add autoplay music.
-   Add giant cursor effects.
-   Add scroll-jacking.
-   Add fake loading screens.
-   Make every project a card.
-   Turn the portfolio into a GitHub dashboard.
-   Invent project features.
-   Invent metrics.
-   Invent architecture.
-   Hardcode portfolio content into components.
-   Introduce unnecessary state-management libraries.
-   Make hover the only way to access information.
-   Ship unoptimized full-resolution images.
-   Put secrets in frontend code.
-   Optimize for Lighthouse at the expense of UX.

------------------------------------------------------------------------

# 72. Final Product Model

The finished experience should feel like:

``` text
              PIYUSH SONAWANE
                    │
                    ▼
             ┌─────────────┐
             │ EXACT HERO  │
             └──────┬──────┘
                    │
                 curiosity
                    │
                    ▼
              ┌───────────┐
              │   ABOUT   │
              └─────┬─────┘
                    │
                    ▼
          ┌────────────────────┐
          │   SELECTED WORK    │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │   CASE STUDIES     │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │    EXPERIENCE      │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ TECHNICAL UNIVERSE │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │        LAB         │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │      CONTACT       │
          └────────────────────┘
```

The key principle is:

> **The hero creates curiosity. The interactions reward it. The projects
> prove engineering ability. The case studies prove engineering
> judgment. The experience proves professional context. The PWA proves
> engineering quality.**

------------------------------------------------------------------------

# 73. Implementation Priority

When trade-offs happen, use this priority order:

``` text
1. Hero fidelity
2. Content correctness
3. Accessibility
4. Performance
5. Core UX
6. Responsive quality
7. Engineering maintainability
8. PWA quality
9. Micro-interactions
10. Easter eggs
```

Never sacrifice items 1--7 to make item 9 more impressive.

------------------------------------------------------------------------

# 74. Source of Truth

During implementation, this README is the product specification.

If a later idea conflicts with it:

1.  identify the conflict
2.  decide whether the idea is worth changing the specification
3.  update the specification first
4.  then implement

Do not let architecture, UI, and content decisions drift independently.

**Design first. Evidence first. Hero first. Then implementation.**
