# Active Magical Effects — Subpage Background Enhancement

**Date:** 2026-07-16  
**Scope:** work.html (Scholar's Archive) + cv.html (Engineer's Wing)  
**Approach:** Layered CSS + JS runes (Approach A)

## Goal

Add active magical atmosphere to both subpage backgrounds — floating runes, pulsing sigil rings, and enhanced aurora curtains — while preserving existing identities and staying lightweight.

## Changes

### 1. Floating Rune Layer

- New container: `<div class="rune-field" aria-hidden="true"></div>` in both HTML files
- JS spawns 10-15 SVG rune `<span>` elements per page into `.rune-field`
- Each rune: fixed position, drifts upward (20-40s), rotates gently, fades in/out
- Scholar's Archive runes: crescent moon, star, constellation glyphs in moonlight silver (`--wing-accent`)
- Engineer's Wing runes: anvil, hammer, ember sigils in ember-amber (`--wing-accent`)
- Mobile: reduced to 6 runes
- `prefers-reduced-motion`: static, no animation

### 2. Pulsing Sigil Ring

- New container: `<div class="sigil-ring" aria-hidden="true"></div>` in both HTML files
- Pure CSS: large centered circle with dashed border + inner counter-rotating ring
- Scholar's Archive: moonlight silver, pentacle-style dashed ring, 80s rotation
- Engineer's Wing: ember-amber, octagonal ring, 90s rotation
- Slow `scale` pulse (0.95-1.05 over 8s) for breathing effect
- Positioned at `z-index: -2`, behind all content

### 3. Enhanced Aurora Curtain

- Tighten existing aurora gradient stops for sharper curtain bands
- Add second aurora layer with complementary accent offset 60deg
- Increase opacity from 0.5/0.55 to 0.65
- Apply to both `.observatory-aurora` and `.forge-aurora`

## Files Modified

| File | Changes |
|------|---------|
| `work.html` | Add `.rune-field` and `.sigil-ring` divs |
| `cv.html` | Add `.rune-field` and `.sigil-ring` divs |
| `assets/wing-scholar.css` | Rune field, sigil ring, aurora enhancement styles |
| `assets/wing-engineer.css` | Rune field, sigil ring, aurora enhancement styles |
| `assets/wing.js` | Rune spawning logic (~40 lines) |

## Performance

- +10-15 DOM elements per page (same as existing star count)
- All animations on `transform`/`opacity` (GPU-composited)
- Mobile: reduced rune count (6 vs 12)
- `prefers-reduced-motion`: all frozen, static visible

## Anti-patterns Avoided

- No gradient text
- No glassmorphism
- No side-stripe borders
- No hand-drawn SVG illustrations
- No decorative grid backgrounds
