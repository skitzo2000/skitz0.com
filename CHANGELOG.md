# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Terminal theme engine with 5 Ghostty-sourced themes (Duotone Dark, Flexoki Light, Homebrew, Dracula, Nord)
- CSS custom property schema with raw palette (`--palette-0` through `--palette-15`) and semantic aliases
- Theme persistence via localStorage with `prefers-color-scheme` fallback
- FOUC prevention via inline head script
- `window.__theme` API (`set`, `get`, `list`) for command bar integration
- Theme-aware grain overlay (adjusts opacity/inversion for light vs dark)
- Smooth theme transitions (80ms) with `prefers-reduced-motion` support
- Hybrid command bar overlay with `/` and `Ctrl+K`/`Cmd+K` keyboard shortcuts
- Core terminal commands: `theme`, `goto`, `filter`, `help`, `whoami`, `clear`, `history`
- 83 easter egg commands with 6+ rotating humorous response variants each
- `window.__terminal` API (`open`, `close`, `toggle`, `run`, `isOpen`) for programmatic access
- Custom events: `terminal:open`, `terminal:close`, `terminal:command`
- Mobile floating terminal trigger button (visible below 768px)
- First-visit hint toast ("Press / to open terminal")
- Tab completion for command names
- Command history via up/down arrows (sessionStorage, last 50 commands)
- Content filter with highlight/dim on skills and project cards
- Section ID attributes for `goto` navigation (`about`, `social`, `skills`, `projects`)
- Scrollable output history with 100-line buffer and auto-scroll
- Rich output formatting (ASCII art, pre-formatted text)
- Focus trap and ARIA attributes when command bar is open
- GitHub-sourced project showcase replacing static project cards
- Client-side GitHub API fetching with localStorage caching (1-hour TTL)
- Auto-rotating project carousel (8-second interval, pause on hover)
- Previous/Next navigation arrows for manual carousel control
- README modal with lazy-loaded `marked` markdown rendering
- Skeleton loading state with animated pulse placeholders
- Language color indicators on project cards
- Star count and relative time display on project cards
- Topic tags (top 3) on project cards
- "Live from GitHub" / "Cached" status indicator
- `data-filter-text` attribute on showcase cards for enhanced filtering
- `prefers-reduced-motion` support (disables auto-rotation and transitions)
- ARIA labels and keyboard navigation for carousel controls
- Responsive carousel: 4 cards desktop, 2 tablet, 1 mobile
- Interactive career knowledge graph replacing flat skills grid
- WebGL graph rendering via Sigma.js + graphology with ForceAtlas2 layout
- Career data model (`career-data.json`) with 90 nodes: roles, companies, skills, projects, education
- Animated node entrance with staggered type-based appearance (1.5s duration)
- Click-to-drill node highlighting with connected neighbor focus
- Hover tooltips with node details (label, type, description, date range, proficiency)
- Drag-to-reposition nodes with Sigma v3 mouse captor API
- Zoom/pan controls (buttons, mouse wheel, pinch-to-zoom touch support)
- Node type legend overlay (roles, companies, skills, projects, education)
- Screen reader accessible skills list fallback (sr-only)
- Static skills grid fallback before JavaScript loads
- `window.__graphFilter()` API for command bar graph node filtering
- `prefers-reduced-motion` support for graph entrance animation
- Theme-reactive graph colors via MutationObserver on `data-theme` attribute

### Changed
- Migrated all component colors from hardcoded values to semantic CSS variables
- Selection styles now use theme-specific selection colors
- Replaced static Projects section with dynamic ProjectShowcase component
- Updated CommandBar filter to use `data-filter-text` attribute when available
- Added `marked` as project dependency for README markdown rendering
- Added GitHub config (`github.username`) to site.json
- Replaced Skills section with KnowledgeGraph component in index page
- Updated CommandBar filter to highlight/dim graph nodes via `window.__graphFilter()`
- Added `sigma`, `graphology`, `graphology-layout-forceatlas2` as project dependencies
- Added `CareerNode`, `CareerEdge`, `CareerData` interfaces and `getCareerData()` to site data module
