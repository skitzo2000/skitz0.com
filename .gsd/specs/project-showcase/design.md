# Technical Design: GitHub-Sourced Project Showcase

## Metadata
- **Feature**: project-showcase
- **Status**: APPROVED
- **Created**: 2026-03-05
- **GitHub Issue**: #4
- **Depends On**: Terminal Theme Engine (#1), Hybrid Command Bar (#2)

---

## 1. Overview

### 1.1 Summary

Replace the static `Projects.astro` section with a `ProjectShowcase.astro` component that fetches public repos from the GitHub API, displays them in a rotating carousel, and supports README expansion via lazy-loaded `marked`. Static fallback cards from `site.json` are rendered at build time by Astro SSG and progressively enhanced client-side.

### 1.2 Goals
- Live project data from GitHub without manual updates
- Carousel with auto-rotation and manual navigation
- README viewing with markdown rendering
- Graceful degradation to static data on API failure
- Theme-aware styling using CSS custom properties

### 1.3 Non-Goals
- Authenticated GitHub API calls
- Build-time GitHub fetching
- GitHub contributions graph / activity heatmap
- Issue/PR counts on cards

---

## 2. Architecture

### 2.1 High-Level Design

```
┌─────────────────────────────────────────────────────────┐
│  index.astro                                             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ ProjectShowcase.astro                               │ │
│  │                                                     │ │
│  │  Build Time (SSG):                                  │ │
│  │    Renders static cards from site.json              │ │
│  │                                                     │ │
│  │  Client JS:                                         │ │
│  │    ┌──────────┐  ┌──────────┐  ┌──────────┐       │ │
│  │    │ GitHub   │  │ Cache    │  │ Carousel  │       │ │
│  │    │ Fetcher  │→ │ Manager  │→ │ Engine    │       │ │
│  │    └──────────┘  └──────────┘  └──────────┘       │ │
│  │                                      │              │ │
│  │                               ┌──────────┐         │ │
│  │                               │ README   │         │ │
│  │                               │ Modal    │         │ │
│  │                               │ (marked) │         │ │
│  │                               └──────────┘         │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

| Component | Responsibility | Location |
|-----------|---------------|----------|
| ProjectShowcase.astro | Static HTML + CSS + client JS | `src/components/` |
| site.json (updated) | GitHub config + static fallback data | `content/` |
| site.ts (updated) | TypeScript types for github config | `src/data/` |

### 2.3 Data Flow

1. **Build time**: Astro reads `site.json` → renders static project cards as HTML
2. **Page load**: Client JS checks `localStorage` for cached repo data
3. **Cache hit (< 1hr)**: Use cached data → render GitHub cards over static cards
4. **Cache miss**: Show skeleton overlay → fetch `api.github.com/users/skitzo2000/repos` → sort by stars → cache in localStorage → render cards
5. **API failure (403/network)**: Keep static fallback cards visible
6. **Card click**: Fetch README via GitHub API → lazy-load `marked` → render in modal
7. **Carousel**: Auto-rotate every 8s, pause on hover, manual prev/next

---

## 3. Detailed Design

### 3.1 Data Models

#### site.json Addition

```json
{
  "github": {
    "username": "skitzo2000",
    "pinned": []
  }
}
```

#### site.ts Type Updates

```typescript
export interface GitHubConfig {
  username: string;
  pinned: string[];
}

export interface SiteData {
  meta: SiteMeta;
  about?: string;
  social: SocialLink[];
  skills?: SkillCategory[];
  projects: Project[];
  github?: GitHubConfig;
}
```

#### Cached Repo Shape (localStorage)

```typescript
interface CachedRepos {
  timestamp: number;
  repos: Array<{
    name: string;
    description: string | null;
    url: string;
    stars: number;
    language: string | null;
    pushed_at: string;
    topics: string[];
  }>;
}
```

### 3.2 Component Structure (ProjectShowcase.astro)

**Props:**
```typescript
interface Props {
  projects: Project[];
  githubUser: string;
  revealIndex?: number;
}
```

**HTML Template:**
- Section wrapper with `id="projects"` (preserves goto target)
- Static fallback cards rendered in a `.showcase__track` container
- Prev/Next arrow buttons
- Carousel dot indicators
- Status indicator ("Live from GitHub" / "Cached" / hidden for static)
- README modal overlay (hidden by default)
- Skeleton card template (hidden, cloned by JS)

**CSS (~150 lines):**
- `.showcase` — section container
- `.showcase__viewport` — overflow hidden wrapper
- `.showcase__track` — flex row with `transform: translateX()` for sliding
- `.showcase__card` — individual card (reuses `.card` patterns from ProjectCard)
- `.showcase__nav` — prev/next arrow buttons
- `.showcase__dots` — pagination indicators
- `.showcase__modal` — README overlay
- `.showcase__skeleton` — pulse animation placeholder
- Mobile breakpoint: 1-2 cards at `< 768px`
- `prefers-reduced-motion`: no auto-rotation, no slide transitions

**Client Script (~400 lines):**
1. **Constants**: GitHub API URL, cache keys, TTL (3600000ms), language color map
2. **Cache Manager**: `getCache()`, `setCache()`, `isCacheValid()`
3. **GitHub Fetcher**: `fetchRepos()`, `fetchReadme(repo)`
4. **Card Renderer**: `renderCards(repos)` — creates/updates card elements
5. **Carousel Engine**: `startRotation()`, `stopRotation()`, `slideTo(index)`, `next()`, `prev()`
6. **README Modal**: `openModal(repo)`, `closeModal()`, lazy `import('marked')`
7. **Relative Time**: `timeAgo(dateString)` — "2 days ago", "3 months ago"
8. **Init**: Check cache → fetch if needed → render → start carousel

### 3.3 Language Color Map

Top 20 languages with their GitHub color codes, stored as a `const` object:

```javascript
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dockerfile: '#384d54',
  Nix: '#7e7eff',
  Lua: '#000080',
  Vim Script: '#199f4b',
  Makefile: '#427819',
  HCL: '#844FBA',
};
```

### 3.4 Carousel Mechanics

- Cards are in a flex row inside `.showcase__track`
- `transform: translateX(-${offset}%)` slides the visible window
- Each "page" shows 4 cards (desktop) or 1 card (mobile)
- `pageCount = Math.ceil(totalCards / cardsPerPage)`
- Auto-rotation: `setInterval(next, 8000)`, cleared on hover, restarted on mouseleave
- Wrap: when at last page, next goes to page 0
- Smooth transition via `transition: transform 400ms var(--ease-out-expo)`
- `prefers-reduced-motion`: `transition: none`, no `setInterval`

### 3.5 README Modal

- Fixed overlay with backdrop (`bg-base` at 0.95 opacity)
- Content area with max-width, scrollable
- Close button (top-right) + Escape key
- Loading spinner while fetching
- `marked` loaded via `const { marked } = await import('marked')`
- Code blocks styled with theme variables (override `marked` output)
- Images use GitHub raw URLs (already absolute in API response)
- On failure: "README unavailable" message with link to repo

### 3.6 Filter Integration

ProjectShowcase cards will use `.card` class (same as current ProjectCard). Each card gets a `data-filter-text` attribute containing: `name description language topics`. The CommandBar filter already selects `.card` and reads child text — this works out of the box. Adding `data-filter-text` provides richer search including language (which may not be visible text on the card).

Update CommandBar's filter function to check `data-filter-text` first, falling back to child element text.

---

## 4. Key Decisions

### 4.1 Single Astro Component

**Context**: Should the showcase be split into multiple sub-components or one file?

**Decision**: Single `ProjectShowcase.astro` component

**Rationale**: Consistent with the CommandBar pattern (617 lines, single file). Astro scoped styles work best in one file. The component is self-contained with no reuse need for sub-parts. Avoids prop-drilling between parent/child Astro components.

### 4.2 CSS Transform Carousel (No Library)

**Context**: How to implement the card rotation?

**Decision**: Vanilla CSS `transform: translateX()` with JS state management

**Rationale**: AC-5 requires no carousel library. CSS transforms are GPU-accelerated. Simple math: `offset = currentPage * (100 / pageCount)`. Responsive card count via JS reading viewport width.

### 4.3 Modal Overlay for README

**Context**: Inline expansion vs modal for README?

**Decision**: Modal overlay (similar to command bar's full-screen pattern)

**Rationale**: README content can be long — inline expansion would push other cards/content. Modal provides focused reading experience. Consistent with the terminal aesthetic (full-screen overlays). Escape key dismiss is already a pattern users know from the command bar.

### 4.4 Progressive Enhancement with Static Fallback

**Context**: How to handle the SSG → client-side enhancement transition?

**Decision**: Astro renders static cards at build time; client JS replaces them with GitHub data

**Rationale**: AC-2/AC-3 require this pattern. Static cards are immediately visible (no JS dependency). Client JS shows skeleton overlay during fetch, then swaps in live data. On API failure, static cards remain — zero degradation.

---

## 5. Implementation Plan

### 5.1 Phase Summary

| Phase | Tasks | Parallel | Est. Time |
|-------|-------|----------|-----------|
| Foundation | 2 | Yes | 10 min |
| Core | 1 | No | 45 min |
| Integration | 2 | Yes | 15 min |
| Verification | 1 | No | 10 min |
| Quality | 1 | No | 5 min |

### 5.2 File Ownership

| File | Task ID | Operation |
|------|---------|-----------|
| `content/site.json` | TASK-001 | modify |
| `src/data/site.ts` | TASK-001 | modify |
| `package.json` | TASK-002 | modify |
| `src/components/ProjectShowcase.astro` | TASK-003 | create |
| `src/pages/index.astro` | TASK-004 | modify |
| `src/components/CommandBar.astro` | TASK-005 | modify |
| `CHANGELOG.md` | TASK-007 | modify |

### 5.3 Dependency Graph

```
TASK-001 (site.json + types) ──┐
                                ├──▶ TASK-003 (ProjectShowcase.astro)
TASK-002 (install marked) ─────┘          │
                                          ├──▶ TASK-004 (index.astro integration)
                                          │
                                          ├──▶ TASK-005 (CommandBar filter update)
                                          │
                                          └──▶ TASK-006 (Build verification)
                                                       │
                                                       └──▶ TASK-007 (CHANGELOG)
```

### 5.4 Consumer Matrix

| Task | Creates/Modifies | Consumed By | Integration Test |
|------|-----------------|-------------|-----------------|
| TASK-001 | site.json, site.ts | TASK-003 | — |
| TASK-002 | package.json | TASK-003 | — |
| TASK-003 | ProjectShowcase.astro | TASK-004, TASK-005, TASK-006 | build verification |
| TASK-004 | index.astro | TASK-006 | build verification |
| TASK-005 | CommandBar.astro | TASK-006 | build verification |
| TASK-006 | — (verification only) | TASK-007 | — |
| TASK-007 | CHANGELOG.md | leaf | — |

---

## 6. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| GitHub API rate limit (60/hr) | Low | Low | localStorage cache with 1hr TTL |
| Large component file (700+ lines) | Medium | Low | Well-organized sections with clear comments |
| `marked` bundle size | Low | Low | Dynamic import, only loaded on README expand |
| Carousel responsiveness | Medium | Medium | Test at multiple breakpoints, simple math |

---

## 7. Testing Strategy

### 7.1 Build Verification
- `npx astro build` succeeds
- No TypeScript errors
- Zero instances of "blog" in any file

### 7.2 Acceptance Checks
- Static fallback cards render without JS
- GitHub API fetch works with caching
- Carousel auto-rotates and responds to controls
- README modal opens with rendered markdown
- Filter command works with showcase cards
- Mobile responsive (1-2 cards)
- All colors use CSS variables (no hardcoded colors)
- `prefers-reduced-motion` respected
- `marked` only loaded on README expand (not initial load)

### 7.3 Verification Commands
```bash
npx astro build
grep -ri "blog" src/ content/ --include="*.astro" --include="*.ts" --include="*.json" --include="*.css" | wc -l  # expect 0
grep -r "#[0-9a-fA-F]\{3,8\}" src/components/ProjectShowcase.astro | grep -v "LANG_COLORS" | wc -l  # expect 0 (no hardcoded colors outside language map)
```

---

## 8. Parallel Execution Notes

### 8.1 Safe Parallelization
- Level 1: TASK-001 and TASK-002 are independent (different files)
- Level 3: TASK-004 and TASK-005 modify different files
- No file conflicts at any level

### 8.2 Recommended Workers
- Minimum: 1 worker (sequential)
- Optimal: 2 workers (covers widest parallel levels)
- Maximum: 2 workers (only 2 tasks parallel at most)

### 8.3 Estimated Duration
- Single worker: ~85 minutes
- With 2 workers: ~70 minutes
- Speedup: ~1.2x

---

## 9. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Architecture | | | PENDING |
| Engineering | | | PENDING |
