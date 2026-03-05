# Requirements: GitHub-Sourced Project Showcase

**Status: APPROVED**
**Priority: P1**
**GitHub Issue: #4**
**Date: 2026-03-05**
**Depends On: Terminal Theme Engine (#1) — COMPLETED, Hybrid Command Bar (#2) — COMPLETED**

---

## 1. Problem Statement

The site has a static projects section with hardcoded entries in `site.json`. The user has active public repositories on GitHub with rich metadata (stars, languages, recent activity) and README content that could serve as living project documentation. The current static cards don't reflect activity, popularity, or detailed project descriptions. A dynamic showcase pulling from the GitHub API would keep the portfolio current without manual updates.

## 2. Functional Requirements

### 2.1 Data Fetching

- **FR-1**: Fetch public repositories from GitHub user `skitzo2000` via the GitHub REST API (unauthenticated)
- **FR-2**: Fetch endpoint: `https://api.github.com/users/skitzo2000/repos?sort=updated&per_page=100`
- **FR-3**: Sort repos by stars (descending), then by last push date as tiebreaker
- **FR-4**: Display the top repos (filling 4 visible card slots with rotation through remaining)
- **FR-5**: For each repo, extract: name, description, html_url, stargazers_count, language, pushed_at, topics
- **FR-6**: Fetch README content for the expanded view: `https://api.github.com/repos/skitzo2000/{repo}/readme` (Accept: application/vnd.github.v3.raw)
- **FR-7**: README fetch is lazy — only when user clicks to expand a card

### 2.2 Caching

- **FR-8**: Cache fetched repo list in localStorage with key `skitz0-gh-repos`
- **FR-9**: Cache TTL: 1 hour (store timestamp, check on page load)
- **FR-10**: Cache README content per repo in localStorage with key `skitz0-gh-readme-{repo}` and same 1-hour TTL
- **FR-11**: If cache is valid, use cached data without fetching
- **FR-12**: If cache is expired or absent, fetch fresh data

### 2.3 Card Display

- **FR-13**: Replace the existing static Projects section with the GitHub-sourced showcase
- **FR-14**: Display 4 visible project cards at a time in a horizontal row
- **FR-15**: Cards show: repo name (as title), description, primary language (with color dot), star count, time since last update (relative: "2 days ago", "3 months ago")
- **FR-16**: If repo has topics, display top 3 as tags
- **FR-17**: Each card links to the GitHub repo URL
- **FR-18**: Cards are styled consistently with the existing terminal aesthetic (monospace headings, accent colors, card backgrounds)

### 2.4 Carousel/Rotation

- **FR-19**: Auto-rotate cards every 8 seconds
- **FR-20**: Rotation pauses when user hovers over the carousel area
- **FR-21**: Previous/Next arrow buttons for manual navigation
- **FR-22**: Rotation is continuous (wraps around from last to first)
- **FR-23**: Smooth slide transition between card sets
- **FR-24**: On mobile (< 768px), show 1-2 cards at a time instead of 4

### 2.5 Expanded README View

- **FR-25**: Click a card to expand and show the repo's README content
- **FR-26**: README rendered as HTML from Markdown using `marked` library
- **FR-27**: Expanded view appears as a modal overlay or inline expansion below the card
- **FR-28**: Close button / Escape key to dismiss expanded view
- **FR-29**: README images are displayed (using GitHub raw URLs)
- **FR-30**: Code blocks in README are styled with theme colors
- **FR-31**: If README fetch fails, show "README unavailable" with link to repo

### 2.6 Loading States

- **FR-32**: Show skeleton card placeholders while repo data is fetching
- **FR-33**: Skeleton cards match the layout of real cards (same dimensions, animated pulse)
- **FR-34**: Show loading spinner inside expanded view while README is fetching

### 2.7 Fallback Behavior

- **FR-35**: If GitHub API is unavailable or rate-limited (403), fall back to the existing static project entries from `site.json`
- **FR-36**: If API returns partial data, show what's available
- **FR-37**: Display a subtle "Live from GitHub" or "Cached" indicator
- **FR-38**: Rate limit: unauthenticated GitHub API allows 60 requests/hour — caching ensures we stay well under

### 2.8 Command Bar Integration

- **FR-39**: `goto projects` command scrolls to the showcase section (already works via section ID)
- **FR-40**: `filter <keyword>` command should also highlight/dim showcase cards based on repo name, description, language, or topics

### 2.9 Static Fallback Data

- **FR-41**: The existing `projects` array in `site.json` serves as the fallback when API is unavailable
- **FR-42**: Update `site.json` to add a `github` config object with username and optional pinned repos

## 3. Non-Functional Requirements

- **NFR-1**: Only one external JS dependency allowed: `marked` for Markdown rendering
- **NFR-2**: All other logic is vanilla JS (consistent with existing site approach)
- **NFR-3**: Showcase renders skeleton cards within 1 frame (< 16ms) on page load
- **NFR-4**: Full card display within 2 seconds on typical connection (API fetch + render)
- **NFR-5**: Theme-aware: all colors use semantic CSS variables from the theme engine
- **NFR-6**: Accessible: ARIA labels on carousel controls, keyboard navigation between cards, screen reader announcements for rotation
- **NFR-7**: `prefers-reduced-motion`: disable auto-rotation and slide transitions
- **NFR-8**: Progressive enhancement: if JS fails, static fallback cards from `site.json` are shown via Astro SSG
- **NFR-9**: The word "blog" must NEVER appear anywhere — UI, source code, comments, data
- **NFR-10**: Total JS for showcase component (excluding marked): < 15KB gzipped
- **NFR-11**: `marked` loaded lazily only when user expands a README (not on initial page load)

## 4. Architecture Constraints

- **AC-1**: Showcase is an Astro component (`ProjectShowcase.astro`) replacing the current `Projects.astro` usage in `index.astro`
- **AC-2**: Static fallback cards rendered at build time by Astro (SSG) from `site.json`
- **AC-3**: Client-side `<script>` enhances static cards with live GitHub data on load
- **AC-4**: `marked` is imported dynamically (`import('marked')`) only when README expansion is triggered
- **AC-5**: Carousel logic is vanilla JS — no carousel library
- **AC-6**: GitHub API calls are client-side only (no build-time fetching, no API keys)
- **AC-7**: Integration with existing `window.__theme` for theme-aware code block styling
- **AC-8**: Filter command integration: showcase cards get `data-filter-text` attribute containing searchable text for the command bar's filter logic

## 5. Data Schema

### 5.1 site.json Addition

```json
{
  "github": {
    "username": "skitzo2000",
    "pinned": []
  }
}
```

### 5.2 Cached Repo Data Structure

```json
{
  "timestamp": 1709654400000,
  "repos": [
    {
      "name": "repo-name",
      "description": "Repo description",
      "url": "https://github.com/skitzo2000/repo-name",
      "stars": 12,
      "language": "Python",
      "pushed_at": "2026-02-28T10:30:00Z",
      "topics": ["docker", "automation"]
    }
  ]
}
```

### 5.3 GitHub Language Colors

A small mapping of language names to color hex codes for the language dot indicator (top ~20 languages). Stored as a constant in the component.

## 6. Component API

### 6.1 ProjectShowcase.astro Props

```
interface Props {
  projects: Project[];      // Static fallback from site.json
  githubUser: string;       // GitHub username
  revealIndex?: number;     // For staggered reveal animation
}
```

### 6.2 Progressive Enhancement Flow

1. **Build time (Astro SSG)**: Render static project cards from `site.json` as initial HTML
2. **Client JS loads**: Check localStorage cache → if valid, enhance cards with GitHub data
3. **If cache miss**: Show skeleton overlay → fetch from GitHub API → render live cards
4. **If API fails**: Keep showing the static fallback cards (already rendered by Astro)

## 7. Acceptance Criteria

1. Showcase section replaces static Projects section
2. Public repos fetched from GitHub user `skitzo2000`
3. Repos sorted by stars, top repos displayed
4. 4 visible cards with auto-rotation every 8 seconds
5. Rotation pauses on hover, manual prev/next arrows work
6. Mobile shows 1-2 cards
7. Click card expands to show rendered README
8. Markdown rendering via `marked` (lazy loaded)
9. localStorage caching with 1-hour TTL
10. Skeleton loading states while fetching
11. Graceful fallback to static `site.json` entries on API failure
12. All colors use theme CSS variables
13. No hardcoded colors in the component
14. `prefers-reduced-motion` disables auto-rotation and transitions
15. Keyboard accessible carousel controls
16. `goto projects` command still works
17. `filter` command highlights/dims showcase cards
18. Zero instances of "blog" in any file
19. `npx astro build` succeeds
20. `marked` only loaded when README is expanded (not on page load)

## 8. Scope Boundaries

### In Scope
- ProjectShowcase.astro component + styling
- Client-side GitHub API fetching + caching
- Carousel with auto-rotation and manual controls
- README expansion with markdown rendering
- Skeleton loading states
- Fallback to static data
- `site.json` github config addition
- Update index.astro to use ProjectShowcase
- Update CommandBar filter to work with new cards
- `marked` as new dependency

### Out of Scope
- Authenticated GitHub API (no tokens)
- Build-time GitHub fetching (stays client-side only)
- GitHub contributions graph / activity heatmap
- Repository file browser
- Issue/PR counts on cards
- Sound effects
- Server-side caching or API proxy
