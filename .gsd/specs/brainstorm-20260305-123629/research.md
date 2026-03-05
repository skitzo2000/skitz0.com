# Research: Portfolio Site Upgrade

## Current State
- Astro 5.17.1 static site, single page, ~677 lines of production code
- Terminal/CLI aesthetic with dark theme (lime green accent on dark gray)
- Content driven from single `site.json` — skills (9 categories, 73 items), 6 projects, social links
- Pure CSS, no frameworks. JetBrains Mono + DM Sans fonts
- Docker/nginx deployment
- Staggered reveal animations, grain overlay, responsive grids

## Competitive Landscape
- Terminal-themed portfolios trending (Ubuntu-themed, retro OS, CLI simulators)
- Best interactive portfolios provide "exit ramps" to content — interactivity should demonstrate skill, not gate content
- Performance budgets matter — heavy effects must earn their bytes
- Jacek Hirsz: dark theme + vibrant green, interactive background responding to mouse movement
- Lars Olson: retro-futuristic, floating elements

## Knowledge Graph Visualization Options
- **D3.js force-directed graph** — industry standard for interactive network visualizations
- d3-force module: velocity Verlet integrator, tick events, SVG/Canvas rendering
- Alternatives: KeyLines (commercial), GoJS (commercial), vis.js (free)
- D3 is the best fit — free, flexible, massive community, works great with Astro

## Theme System Research
### Ghostty Duotone Dark (user's current terminal theme)
- Background: #1f1d27 (deep purple-gray)
- Foreground: #b7a1ff (soft lavender)
- Cursor: #ff9839 (warm orange)
- Selection BG: #353147 (muted purple)
- Palette: red #d9393e, green #2dcd73, yellow #d9b76e, blue #ffc284, purple #de8d40, cyan #2488ff
- Bright white: #eae5ff

### Homebrew Theme
- Background: #000000 (pure black)
- Foreground: #00ff00 (classic green)
- Cursor: #23ff18

### Light Theme Option (Flexoki Light)
- Background: #fffcf0 (warm cream)
- Foreground: #100f0f (near black)
- Good contrast, warm palette

### Theme Engine Approach
- Base2Tone: DuoTone-based themes using CSS custom properties
- Map terminal palette slots (0-15 + bg/fg/cursor/selection) to CSS custom properties
- Theme switching via typing commands (e.g., `theme duotone-dark`, `theme homebrew`)
