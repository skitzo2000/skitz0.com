# Requirements: Terminal Theme Engine

**Status: APPROVED**
**Priority: P0**
**GitHub Issue: #1**
**Date: 2026-03-05**

---

## 1. Problem Statement

The portfolio site has a hardcoded dark theme (lime green accent on dark gray) that doesn't match the developer's actual terminal aesthetic (Ghostty Duotone Dark). There is no way to personalize the visual experience, and the current CSS variable scheme is not designed for theme switching. This feature is the foundation that all other visual work (command bar, knowledge graph, project showcase) depends on.

## 2. Functional Requirements

### 2.1 Theme Engine Core

- **FR-1**: The site must support multiple color themes switchable at runtime
- **FR-2**: Theme switching is ONLY available via the command bar (`theme <name>`) — no UI toggle, no settings panel
- **FR-3**: 5 themes must ship at launch:
  1. **Duotone Dark** (default) — sourced from Ghostty `Duotone Dark` theme
  2. **Flexoki Light** — sourced from Ghostty `Flexoki Light` theme (the light option)
  3. **Homebrew** — sourced from Ghostty `Homebrew` theme
  4. **Dracula** — sourced from Ghostty `Dracula` theme
  5. **Nord** — sourced from Ghostty `Nord` theme
- **FR-4**: Theme data must be sourced directly from Ghostty theme files (accurate color mappings)

### 2.2 CSS Custom Property Schema

- **FR-5**: Expose the full terminal palette as raw CSS variables:
  - `--palette-0` through `--palette-15` (ANSI colors 0-15)
  - `--theme-bg` (background)
  - `--theme-fg` (foreground)
  - `--theme-cursor` (cursor color)
  - `--theme-cursor-text` (cursor text color)
  - `--theme-selection-bg` (selection background)
  - `--theme-selection-fg` (selection foreground)
- **FR-6**: Expose semantic aliases that map to palette slots:
  - `--bg-base` → `--theme-bg`
  - `--bg-elevated` → derived (slightly lighter/darker than bg)
  - `--bg-card` → derived (between base and elevated)
  - `--bg-hover` → derived
  - `--fg-primary` → `--theme-fg`
  - `--fg-secondary` → `--palette-7` (normal white / muted)
  - `--fg-muted` → `--palette-8` (bright black / dimmed)
  - `--accent` → `--palette-2` (green) or theme-specific accent
  - `--accent-dim` → derived from accent
  - `--accent-glow` → derived (accent with low alpha)
  - `--border` → derived from bg
  - `--border-focus` → accent
  - `--selection-bg` → `--theme-selection-bg`
  - `--selection-fg` → `--theme-selection-fg`
- **FR-7**: All existing components must use only the semantic CSS variables (no hardcoded colors)

### 2.3 Theme Application

- **FR-8**: Apply theme via `data-theme` attribute on the `<html>` element
- **FR-9**: Each theme defined as a CSS ruleset: `[data-theme="duotone-dark"] { ... }`
- **FR-10**: The `:root` block defines the default theme (Duotone Dark)

### 2.4 Persistence

- **FR-11**: Persist selected theme in `localStorage` under a key (e.g., `skitz0-theme`)
- **FR-12**: On page load, check localStorage first; if empty, check `prefers-color-scheme`:
  - `prefers-color-scheme: light` → apply Flexoki Light
  - `prefers-color-scheme: dark` or no preference → apply Duotone Dark
- **FR-13**: Apply theme before first paint (inline `<script>` in `<head>`) to prevent flash of wrong theme

### 2.5 Transitions

- **FR-14**: When switching themes, apply a CSS transition on color/background properties (< 100ms)
- **FR-15**: A temporary class (e.g., `.theme-transitioning`) enables transitions only during switch, not on page load

### 2.6 Grain Overlay

- **FR-16**: Grain overlay must be theme-aware:
  - Dark themes: light grain (current approach, ~4% opacity, white-ish noise)
  - Light themes: dark grain (inverted noise, ~3% opacity)
- **FR-17**: Grain opacity and/or color is a CSS variable per theme (`--grain-opacity`, `--grain-invert`)

## 3. Non-Functional Requirements

- **NFR-1**: Theme switch must complete in < 100ms (perceived)
- **NFR-2**: No flash of unstyled/wrong theme on page load (FOUC prevention)
- **NFR-3**: Zero JavaScript runtime for theme rendering — CSS-only after initial application
- **NFR-4**: All themes must meet WCAG 2.1 AA contrast ratio (4.5:1 for text, 3:1 for large text)
- **NFR-5**: `prefers-reduced-motion` must disable theme transition animations
- **NFR-6**: Theme engine must be extensible — adding a new theme means adding one data block (palette + semantic mapping), not changing multiple files

## 4. Theme Color Data

### 4.1 Duotone Dark (Default)
```
palette 0-15: #1f1d27, #d9393e, #2dcd73, #d9b76e, #ffc284, #de8d40, #2488ff, #b7a1ff,
              #4e4a60, #d9393e, #2dcd73, #d9b76e, #ffc284, #de8d40, #2488ff, #eae5ff
background: #1f1d27    foreground: #b7a1ff
cursor: #ff9839        cursor-text: #1f1d27
selection-bg: #353147  selection-fg: #b7a2ff
```

### 4.2 Flexoki Light
```
palette 0-15: #100f0f, #af3029, #66800b, #ad8301, #205ea6, #a02f6f, #24837b, #6f6e69,
              #b7b5ac, #d14d41, #879a39, #d0a215, #4385be, #ce5d97, #3aa99f, #cecdc3
background: #fffcf0    foreground: #100f0f
cursor: #100f0f        cursor-text: #fffcf0
selection-bg: #cecdc3  selection-fg: #100f0f
```

### 4.3 Homebrew
```
palette 0-15: #000000, #990000, #00a600, #999900, #0d0dbf, #b200b2, #00a6b2, #bfbfbf,
              #666666, #e50000, #00d900, #e5e500, #0000ff, #e500e5, #00e5e5, #e5e5e5
background: #000000    foreground: #00ff00
cursor: #23ff18        cursor-text: #ff0018
selection-bg: #083905  selection-fg: #ffffff
```

### 4.4 Dracula
```
palette 0-15: #21222c, #ff5555, #50fa7b, #f1fa8c, #bd93f9, #ff79c6, #8be9fd, #f8f8f2,
              #6272a4, #ff6e6e, #69ff94, #ffffa5, #d6acff, #ff92df, #a4ffff, #ffffff
background: #282a36    foreground: #f8f8f2
cursor: #f8f8f2        cursor-text: #282a36
selection-bg: #44475a  selection-fg: #ffffff
```

### 4.5 Nord
```
palette 0-15: #3b4252, #bf616a, #a3be8c, #ebcb8b, #81a1c1, #b48ead, #88c0d0, #e5e9f0,
              #596377, #bf616a, #a3be8c, #ebcb8b, #81a1c1, #b48ead, #8fbcbb, #eceff4
background: #2e3440    foreground: #d8dee9
cursor: #eceff4        cursor-text: #282828
selection-bg: #eceff4  selection-fg: #4c566a
```

## 5. Scope Boundaries

### In Scope
- CSS custom property schema (raw palette + semantic aliases)
- 5 theme definitions with Ghostty-sourced colors
- Theme application via `data-theme` attribute
- localStorage persistence + `prefers-color-scheme` fallback
- FOUC prevention via inline head script
- Theme transition animation
- Theme-aware grain overlay
- Migrating all existing components to new CSS variables
- Extensibility: documented process for adding new themes

### Out of Scope
- Command bar implementation (issue #2 — will call a JS function exposed by this feature)
- UI-based theme picker (themes are switched only via typed commands)
- User-defined custom themes at runtime
- Per-component theme overrides

## 6. Dependencies

- **Depends on**: Nothing — this is the foundation
- **Blocks**: Issue #2 (command bar), #3 (knowledge graph), #4 (project showcase)

## 7. Technical Constraints

- Astro 5.17.x static site — no SSR, no server runtime
- Theme must be applied via inline `<script>` in `<head>` before body renders
- No additional npm dependencies required for the theme engine itself
- All theme data can be hardcoded in CSS (no JSON fetch needed at runtime)

## 8. Acceptance Criteria

- [ ] CSS custom property schema with raw palette (--palette-0 through --palette-15) and semantic aliases
- [ ] All 5 themes implemented with accurate Ghostty color mappings
- [ ] Theme applied via `data-theme` attribute on `<html>`
- [ ] Theme persists in localStorage across page reloads
- [ ] `prefers-color-scheme` respected when no localStorage value
- [ ] No flash of wrong theme on page load (inline head script)
- [ ] Theme transition < 100ms with `.theme-transitioning` class
- [ ] Duotone Dark is the default theme
- [ ] All existing components migrated to use new semantic CSS variables (no hardcoded colors remain)
- [ ] Grain overlay adapts to light/dark themes
- [ ] `prefers-reduced-motion` disables transition animation
- [ ] WCAG 2.1 AA contrast ratios for all themes
- [ ] Adding a new theme requires only one new CSS data block

## 9. Public API

The theme engine exposes a minimal JS API for the command bar (issue #2) to call:

```
window.__theme = {
  set(name: string): boolean   // Apply theme, persist, return success
  get(): string                 // Return current theme name
  list(): string[]              // Return available theme names
}
```

This API is set up by the inline `<head>` script so it's available immediately.

## 10. Open Questions

None — all questions resolved during elicitation.
