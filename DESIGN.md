---
name: DomFix
description: A Serbian marketplace connecting homeowners with verified local tradespeople
colors:
  primary: "#2563eb"
  primary-deep: "#1d4ed8"
  primary-soft: "#eff6ff"
  accent: "#f97316"
  accent-deep: "#ea580c"
  neutral-bg: "#f9fafb"
  neutral-surface: "#ffffff"
  neutral-border: "#e5e7eb"
  ink: "#111827"
  ink-muted: "#6b7280"
  ink-faint: "#9ca3af"
  status-pending-bg: "#fef9c3"
  status-pending-text: "#854d0e"
  status-accepted-bg: "#dbeafe"
  status-accepted-text: "#1e40af"
  status-rejected-bg: "#fee2e2"
  status-rejected-text: "#b91c1c"
  status-done-bg: "#dcfce7"
  status-done-text: "#166534"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  button-accent-hover:
    backgroundColor: "{colors.accent-deep}"
  card:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "20px"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  badge:
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: DomFix

## 1. Overview

**Creative North Star: "The Trusted Tradesman"**

DomFix should feel the way a good tradesman does: calm, competent, and not trying to sell you anything. Blue carries the everyday trust signals — navigation, credentials, the dashboard a majstor lives in. Orange is reserved for the moment a decision actually happens: "find a majstor," "send the request," "become a majstor." It's the spark that turns browsing into action, not a brand color smeared across every button.

This is a **product** surface first (per [PRODUCT.md](./PRODUCT.md)): the homepage exists to get someone into the real workflow — search, request, manage — as fast as possible. It explicitly rejects the cold, corporate SaaS-marketplace look (heavy gradients, glassy hero panels, stock-photo gloss) in favor of something plainer and more local: a community noticeboard energy, not a venture-backed gig platform.

**Key Characteristics:**
- One accent color, used sparingly, for one decision per screen
- Flat-by-default surfaces that lift only on interaction
- Plain, legible Serbian copy over clever or terse UI
- Soft pastel status language (pending/accepted/rejected/done) instead of harsh saturated alerts
- Generous touch targets and unambiguous labels, since homeowners booking trades skew less tech-savvy

## 2. Colors

The palette is restrained: one trust color (blue), one action color (orange), and a clean gray-neutral scaffold. No tertiary role — adding one would dilute the "one decision per screen" doctrine.

### Primary
- **Workshop Blue** (`#2563eb`): navigation, links, secondary buttons, info badges, the default interactive color across the dashboard and admin areas. This is the "everyday" color — present everywhere, never urgent.
- **Workshop Blue Deep** (`#1d4ed8`): hover/active state for blue elements.
- **Workshop Blue Soft** (`#eff6ff`): selected-state backgrounds, category chip fills, the active-link tint.

### Secondary
- **Spark Orange** (`#f97316`): reserved for the single primary call-to-action on a screen — "Traži majstora," "Postani majstor," "Registruj se kao majstor." Never used for navigation, secondary actions, or decoration.
- **Spark Orange Deep** (`#ea580c`): hover/active state for orange elements.

### Neutral
- **Paper** (`#f9fafb`): page background.
- **Surface White** (`#ffffff`): cards, panels, the navbar, modals.
- **Border Gray** (`#e5e7eb`): card borders, dividers, input strokes at rest.
- **Ink** (`#111827`): primary text, headings.
- **Ink Muted** (`#6b7280`): secondary text, descriptions, metadata.
- **Ink Faint** (`#9ca3af`): placeholder text, disabled states, empty-state icons.

### Status colors (the StatusBedz vocabulary)
- **Pending** (bg `#fef9c3` / text `#854d0e`): "Na čekanju" — a request awaiting response.
- **Accepted** (bg `#dbeafe` / text `#1e40af`): "Prihvaćen" — a majstor has taken the job.
- **Rejected** (bg `#fee2e2` / text `#b91c1c`): "Odbijen."
- **Done** (bg `#dcfce7` / text `#166534`): "Završen."

### Named Rules
**The One Spark Rule.** Spark Orange appears at most once per screen, on the single action the screen exists to drive. If two things are orange, one of them is wrong.
**The Soft Status Rule.** Status colors are always pastel-background-plus-dark-text pairs, never solid saturated fills. A request's state should read as information, not as an alarm.

## 3. Typography

**Display/Body Font:** Geist (via `next/font`), falling back to system-ui sans-serif.

**Character:** A single, plain, highly legible sans family carries the entire system — no serif, no script, no display face. This is deliberate: DomFix is a tool people use under time pressure (something's broken, they need a majstor now), not a brand to admire.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, 1.1 line-height): hero headline on the homepage only.
- **Headline** (700, 1.875rem/30px, 1.2 line-height): page titles ("Pronađi majstora," "Kako funkcioniše?").
- **Title** (600, 1.25rem/20px, 1.3 line-height): card titles, section headings, modal titles.
- **Body** (400, 1rem/16px, 1.6 line-height): paragraph copy, descriptions. Cap prose at ~65–75ch.
- **Label** (500, 0.875rem/14px, 1.4 line-height): form labels, nav links, button text, badges.

### Named Rules
**The Plain-Copy Rule.** No jargon, no cleverness, no abbreviations in labels or errors. A homeowner who has never used a marketplace app should understand every label on first read.

## 4. Elevation

DomFix is flat at rest. Cards, inputs, and the navbar carry no shadow by default — separation comes from a 1px `Border Gray` stroke and the `Paper`/`Surface White` contrast. Shadow appears only as feedback for an interactive state: a majstor card lifts with `shadow-md` on hover, and floating elements (the account dropdown menu) carry `shadow-lg` because they're transient overlays, not resting surfaces.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`, i.e. Tailwind `shadow-md`): majstor cards and other clickable list items, on hover only.
- **Overlay** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`, i.e. `shadow-lg`): dropdown menus.
- **Modal** (Tailwind `shadow-xl`): the login/register card panels, which sit on their own page rather than inline content.

### Named Rules
**The Flat-By-Default Rule.** Nothing has a shadow at rest. Shadow is the system's only "you can act on this" signal — use it precisely or it stops meaning anything.

## 5. Components

### Buttons
- **Shape:** `rounded-lg` (8px) for primary/secondary actions, `rounded-xl` (12px) for large hero CTAs.
- **Primary (blue):** `bg-blue-600` text white, `hover:bg-blue-700`, used for in-context confirms (login, submit forms, dashboard actions).
- **Accent (orange):** `bg-orange-500` text white, `hover:bg-orange-600`, reserved per the One Spark Rule for the screen's single primary CTA.
- **Ghost / overlay (white-on-blur):** `bg-white/20 hover:bg-white/30 border border-white/40`, used only on the hero's dark blue gradient background where a solid button would compete with the primary CTA.
- **Disabled:** lighter tint of the same hue (e.g. `bg-blue-400`) plus the cursor staying default; never a separate gray "disabled" look — the action is still the action, just unavailable right now.

### Badges (StatusBedz)
- **Style:** `rounded-full`, `px-2.5 py-0.5`, `text-xs font-medium`, pastel bg + dark text pair per status (see Colors).
- **State:** static, no hover/interaction — badges are read-only status, never clickable.

### Cards / Containers
- **Corner Style:** `rounded-xl` (12px) for content cards (majstor listings, filter panels), `rounded-2xl` (16px) for full-page auth panels.
- **Background:** Surface White on Paper.
- **Shadow Strategy:** flat at rest; `shadow-md` on hover for clickable cards (see Elevation).
- **Border:** 1px `border-gray-200`, shifting to `border-blue-200` on hover for clickable cards.
- **Internal Padding:** `p-5` (20px) for list cards, `p-8` (32px) for auth/standalone panels.

### Inputs / Fields
- **Style:** `border border-gray-300`, `rounded-lg`, white background, `px-3`–`px-4` horizontal padding depending on density.
- **Focus:** `focus:ring-2 focus:ring-blue-500 focus:border-transparent` — the ring is the only focus signal, no color shift on the border itself.
- **Error:** an inline `bg-red-50 text-red-700` message block beneath the field, not a red border on the input.

### Navigation
- White background, `border-b border-gray-200`, sticky top, `h-16`. Logo is wordmark-as-color: "Dom" in Workshop Blue, "Fix" in Spark Orange — this is the one place outside a CTA where orange appears statically, and it's load-bearing for brand recognition, not decoration. Links are `text-gray-600`, hovering to `text-blue-600`. The logged-in account control is a blue-tinted pill (`bg-blue-50 text-blue-700`) with a circular initial avatar.

### Status flow (signature pattern)
The `OcenaZvezdice` (star rating) and `StatusBedz` (status badge) components are DomFix's signature trust primitives — every majstor card and request row shows both, because the entire brand promise ("verified, trusted majstor") is carried by these two small components more than by any hero copy. Stars use `#f59e0b` (amber) filled / `#d1d5db` (gray) empty, never the brand blue or orange — rating is its own visual language, intentionally distinct from action color.

## 6. Do's and Don'ts

### Do:
- **Do** use Spark Orange for exactly one action per screen — the thing the screen exists to make happen.
- **Do** keep everything flat at rest; reserve shadow for hover/overlay states only (the Flat-By-Default Rule).
- **Do** write plain, unambiguous Serbian labels and errors — favor a longer clear sentence over a terse clever one (the Plain-Copy Rule).
- **Do** pair every status with a pastel-bg/dark-text badge, never a solid saturated fill (the Soft Status Rule).
- **Do** keep touch targets generous (inputs at `py-2.5`–`py-3` minimum) since homeowners booking trade work may be less tech-savvy.

### Don't:
- **Don't** use gradients or glassy/blurred panels as decoration — DomFix's hero gradient is the one sanctioned exception, not a pattern to repeat elsewhere.
- **Don't** use stock-photo gloss or generic SaaS-marketplace visuals; this should read local and human, not venture-backed.
- **Don't** apply Spark Orange to more than one element per screen, including hover/active states on unrelated controls.
- **Don't** give status badges solid saturated backgrounds (no `bg-red-500 text-white`); they must stay in the soft pastel-bg/dark-text family.
- **Don't** use a colored `border-left`/`border-right` stripe as a card accent.
- **Don't** put gradient text on headings (`background-clip: text` with a gradient fill).
