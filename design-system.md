# Design System & Visual Specification

> Phase 1 Deliverable: Approved Design System
> Locked visual tokens and interaction rules adhering strictly to the approved reference image and production build plan.

---

## 1. Core Principles (Anti-Vibe-Coding Rules)
- **Zero Purple Gradients**: Strict monochrome-first color palette (`#0f0f10`, `#ffffff`, `#fbfbfa`, warm grays). Color is reserved solely for interactive reveals (portrait photograph hover, project preview hover).
- **Zero Pill Buttons**: All buttons and interactive tags use crisp geometric rectangles with subtle, elegant 3px–4px radius and 1px hairline borders (`#dcdbd6` / `#121212`).
- **Zero AI-Slop Copy / Vague Text**: Direct, factual engineering statements derived strictly from verified projects and work history.
- **Zero Fake Metrics / Reviews**: No fabricated customer counts, star ratings, or arbitrary percentages.
- **Zero Emoji Icons**: Custom, high-precision SVG line icons with uniform 1.5px stroke weight.
- **Zero Em Dashes**: Clean typographic hyphens or space-separated markers.
- **Zero Over-the-Top Scrolljacking**: Natural browser scrolling preserved with smooth subtle GPU-accelerated reveals.

---

## 2. Typography System
```css
:root {
  /* Editorial Serif Display */
  --font-display: 'Cinzel', 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
  
  /* Personal Signature & Accents */
  --font-script: 'Caveat', 'Reenie Beanie', cursive;
  
  /* Clean Technical Sans-Serif */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  /* Monospace Metadata */
  --font-mono: 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

---

## 3. Color Tokens
```css
:root {
  --color-paper: #ffffff;
  --color-paper-alt: #fbfbf9;
  --color-paper-subtle: #f5f4f0;
  
  --color-ink: #111111;
  --color-ink-secondary: #4a4944;
  --color-ink-muted: #7e7c75;
  --color-ink-faint: #b4b2aa;
  
  --color-line: #e4e2dc;
  --color-line-subtle: #eeece6;
  --color-line-dark: #121212;
  
  --color-focus: #111111;
}
```

---

## 4. First Viewport Measurements (LOCKED)
- **Outer Canvas**: Centered desktop editorial card with subtle hairline border and soft ambient shadow mimicking window chrome.
- **Logo (Top-Left)**:
  - Line 1: `Piyush` (Script, 28px, `-2deg` rotation, dark ink)
  - Line 2: `Sonawane` (Script, 28px, `-2deg` rotation, dark ink)
  - Line 3: `WEB DEVELOPER` (Sans, 9.5px, uppercase, letter-spacing: 0.28em, font-weight 500, color `#111111`)
- **Top-Right Control**:
  - `+ Install App` button (12px, border: 1px solid `#d5d4ce`, radius: 4px, padding: 6px 14px, geometric rectangular).
- **Center Portrait**:
  - Max width: 440px (desktop), height: auto, crisp transparent cutout.
  - Layered behind: Display Serif `ABOUT` (Cinzel / Cormorant Garamond, 110px-130px, letter-spacing: 0.35em, color `rgba(0,0,0,0.22)`).
  - Flanking script:
    - Left of hands: `Piyush` (Script, 44px, `-6deg` tilt)
    - Right of hands: `Sonawane` (Script, 44px, `4deg` tilt)
- **Right Margin**:
  - Circular indicator: 38px outer ring (1px solid `#1a1a1a`), 4px solid centered dot.
  - Vertical watermark: `© 2026 Piyush Sonawane` (rotated 90deg, 11px, letter-spacing 0.15em, color `#8a8880`).
- **Bottom-Left Margin**:
  - Monochrome SVG icons: Twitter/X and GitHub (16px x 16px, color `#111111`, gap 14px).

---

## 5. Interaction Model
- **Portrait Hover**: Smooth 500ms ease transition from monochrome high contrast to authentic color, with optional cursor-relative photographic reveal.
- **Ink Reveal**: Subtle hairline underline animation on text links and headings.
- **Command Palette**: Triggered via `Cmd+K` or `Ctrl+K`, trapped focus, full keyboard arrow navigation.
- **PWA Installation**: Handled via `beforeinstallprompt` event with progressive fallback sheet for Safari/iOS.
