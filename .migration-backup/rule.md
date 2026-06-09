# Cybork Design System — rule.md

Reference-faithful implementation of the AXYS card-stack UI pattern, adapted for the Cybork Discord bot landing page. Use this document to stay 100% consistent across all components and future pages.

---

## 1. Color Palette

All colors use CSS custom properties with space-separated HSL values (no `hsl()` wrapper in variable definitions).

### Core

| Token | HSL | Purpose |
|---|---|---|
| `--background` | `30 5% 7%` | Page background — near-black with warm undertone |
| `--foreground` | `0 0% 92%` | Primary text — off-white |
| `--border` | `0 0% 18%` | Default border color |

### Cards

| Token | HSL | Purpose |
|---|---|---|
| `--card` | `30 4% 11%` | Card surface — slightly lighter than background |
| `--card-foreground` | `0 0% 92%` | Text on cards |
| `--card-border` | `0 0% 17%` | Card border |

### Accent (Amber/Gold)

| Token | HSL | Purpose |
|---|---|---|
| `--primary` | `35 75% 52%` | Amber gold — CTAs, highlights, icons |
| `--primary-foreground` | `0 0% 5%` | Dark text on amber buttons |

### Muted / Inputs

| Token | HSL | Purpose |
|---|---|---|
| `--muted` | `30 4% 14%` | Subtle background surfaces |
| `--muted-foreground` | `0 0% 50%` | Secondary text, captions, metadata |
| `--input` | `0 0% 20%` | Input border (visible on card bg) |

### Raw rgba values used directly in inline styles

```
Card border:                rgba(255, 255, 255, 0.085)
Back ghost card border:     rgba(255, 255, 255, 0.055)
Middle ghost card border:   rgba(255, 255, 255, 0.07)
Amber icon bg:              rgba(200, 140, 40, 0.12)
Amber icon border:          rgba(200, 140, 40, 0.20)
Amber badge bg:             rgba(200, 140, 40, 0.10)
Divider lines:              rgba(255, 255, 255, 0.06)
```

---

## 2. Typography

### Font Family
- **Primary**: `Inter` (Google Fonts) — used for all UI text
- Fallback: `system-ui, sans-serif`
- Loaded via `@import url(...)` as the FIRST line of `index.css`

### Scale

| Role | Size | Weight | Color |
|---|---|---|---|
| Page heading | `text-2xl` (24px) | 600 | `hsl(0 0% 93%)` |
| Section heading | `text-xl` (20px) | 600 | `hsl(0 0% 92%)` |
| Card title | `text-base` (16px) | 600 | `hsl(0 0% 92%)` |
| Feature title | `text-sm` (14px) | 600 | `hsl(0 0% 92%)` |
| Body / description | `text-sm` (14px) | 400 | `hsl(0 0% 48–50%)` |
| Caption / meta | `text-xs` (12px) | 400 | `hsl(0 0% 40–50%)` |
| Section label | `text-xs` uppercase tracking-widest | 600 | `hsl(35 65% 55%)` |
| Command text | `font-mono text-sm` | 500 | `hsl(0 0% 85%)` |

### Letter spacing
- Default body: `--tracking-normal: -0.01em`
- Wordmark / brand name: `letter-spacing: 0.14em`
- Section labels: `tracking-widest` (~0.1em)

---

## 3. The Stacked Card System

This is the central visual motif. Every section uses it.

### Structure
Three visible layers:
1. **Back card** — rotated `-2.6deg`, translated `5px` down, scaled `0.968×`
2. **Middle card** — rotated `+1.9deg`, translated `3px` down, scaled `0.984×`
3. **Front card** — flat, `z-index: 2`, carries all content

### Implementation (inline styles, not Tailwind classes)

```tsx
function CardStack({ children }) {
  return (
    <div className="relative">
      {/* Back card */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "1rem",
        background: "hsl(30 4% 11%)",
        border: "1px solid rgba(255,255,255,0.055)",
        transform: "rotate(-2.6deg) translateY(5px) scale(0.968)",
        zIndex: 0,
      }} />
      {/* Middle card */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "1rem",
        background: "hsl(30 4% 11%)",
        border: "1px solid rgba(255,255,255,0.07)",
        transform: "rotate(1.9deg) translateY(3px) scale(0.984)",
        zIndex: 1,
      }} />
      {/* Front card */}
      <div style={{
        position: "relative",
        borderRadius: "1rem",
        background: "hsl(30 4% 11%)",
        border: "1px solid rgba(255,255,255,0.085)",
        zIndex: 2,
      }}>
        {children}
      </div>
    </div>
  );
}
```

### Border radius
- Cards: `border-radius: 1rem` (`rounded-2xl`)
- Icon containers: `border-radius: 0.75rem` (`rounded-xl`)
- Buttons: `border-radius: 0.75rem` (`rounded-xl`)
- Small badges/pills: `border-radius: 9999px` (`rounded-full`)

---

## 4. Ambient Glow (Background Atmosphere)

The signature warm amber/golden glow. Applied via `radial-gradient` on an absolutely positioned overlay.

### Hero top glow
```css
background: radial-gradient(
  ellipse 60% 42% at 50% 0%,
  rgba(165, 105, 22, 0.30) 0%,
  transparent 100%
);
```

### Section center glow (mid-page)
```css
background: radial-gradient(
  ellipse 50% 30% at 50% 50%,
  rgba(120, 75, 10, 0.10) 0%,
  transparent 100%
);
```

### CTA bottom glow
```css
background: radial-gradient(
  ellipse 55% 40% at 50% 100%,
  rgba(165, 105, 22, 0.22) 0%,
  transparent 100%
);
```

> **Rule**: The glow is always warm amber/gold. It is never bright, never harsh. It simulates a distant warm light source above or behind the cards. Opacity range: 0.10 – 0.30.

---

## 5. Buttons

### Primary CTA (Amber)
```tsx
<button style={{
  background: "hsl(35 75% 52%)",
  color: "hsl(0 0% 5%)",
  borderRadius: "0.75rem",
  fontWeight: 600,
  fontSize: "0.875rem",
  padding: "0.75rem 1.25rem",
}}>
  Add to Discord
</button>
```

### Secondary / Ghost
```tsx
<button style={{
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "hsl(0 0% 70%)",
  borderRadius: "0.75rem",
  fontWeight: 500,
  fontSize: "0.875rem",
}}>
  Explore features
</button>
```

### Hover interaction
- Primary: `hover:opacity-90 active:scale-95`
- Secondary: `hover-elevate` class from the elevation system
- Never use `hover:bg-*` Tailwind classes on colored backgrounds — use opacity instead

---

## 6. Icon Containers

### Amber icon pill
```tsx
<div style={{
  width: "2.5rem", height: "2.5rem",
  borderRadius: "0.75rem",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(200, 140, 40, 0.12)",
  border: "1px solid rgba(200, 140, 40, 0.20)",
}}>
  <Icon size={18} className="text-amber-400" />
</div>
```

Icon color: always `text-amber-400` (`hsl(43 96% 56%)`)

---

## 7. Animation System

Built on `framer-motion`. All animations fire once (viewport-triggered).

### Section card entrance
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
>
```

### Feature card stagger
```tsx
// delay = index * 0.06
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
>
```

### Stat counter pop
```tsx
initial={{ opacity: 0, scale: 0.9 }}
whileInView={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.4, delay }}
```

### Easing curve
All transitions use `[0.22, 1, 0.36, 1]` — an ease-out-expo curve. This matches the natural deceleration feel of the reference design.

---

## 8. Spacing Conventions

| Element | Padding |
|---|---|
| Hero card | `px-10 py-12` |
| Section cards | `px-8 py-8` to `px-8 py-10` |
| CTA card | `px-10 py-12` |
| Feature cards | `p-6` |
| Section vertical gap | `py-24` |
| Divider lines | `height: 1px; background: rgba(255,255,255,0.06)` |

---

## 9. Navbar

- Fixed, `h-16`
- Transparent at top; `backdrop-filter: blur(16px)` + semi-transparent bg when scrolled
- Scrolled bg: `rgba(19, 16, 13, 0.88)` (dark warm)
- Scrolled border-bottom: `1px solid rgba(255,255,255,0.07)`
- Logo: icon + wordmark in `tracking-wide text-sm font-semibold`
- Nav links: `text-xs font-medium`, color `hsl(0 0% 50%)`, hover `text-white`

---

## 10. Inputs / Form Fields (reference only)

From the original AXYS screenshot:

```
Input background:   hsl(30 4% 9%)  (darker than card)
Input border:       1px solid rgba(255,255,255,0.10)
Input border-radius: 0.75rem
Placeholder color:  hsl(0 0% 40%)
Text color:         hsl(0 0% 88%)
Padding:            12px 16px
```

---

## 11. Footer

```
Background: hsl(30 5% 6%)  — slightly darker than page bg
Border-top: 1px solid rgba(255,255,255,0.06)
Text color: hsl(0 0% 28–35%)
```

---

## 12. Do / Don't Rules

| Do | Don't |
|---|---|
| Use inline `style` for pixel-critical values | Use Tailwind classes for exact colors — they round |
| Keep all ghost cards the same bg as front card | Use different bg for ghost cards |
| Use `rgba` alpha for borders and overlays | Use `border-gray-*` Tailwind classes |
| Use `text-amber-400` for all accent icons | Mix orange, yellow, or gold tones |
| Apply `once: true` to all scroll animations | Re-animate on scroll-back |
| Match glow opacity to section importance | Apply glow to every element |
| Use `rounded-2xl` for cards, `rounded-xl` for buttons | Mix border-radius values |
| Import `Inter` via Google Fonts as FIRST CSS line | Use system fonts for headings |
| Keep muted text at `hsl(0 0% 48–50%)` | Use `text-gray-500` which may differ in dark mode |

---

## 13. File Locations

```
artifacts/cybork/src/
├── index.css              ← All CSS variables, dark theme, card-stack utilities
├── App.tsx                ← Router — add pages here
└── pages/
    └── Landing.tsx        ← Full landing page (Hero, Features, Commands, Stats, CTA, Footer)

rule.md                    ← This file — design system reference
```
