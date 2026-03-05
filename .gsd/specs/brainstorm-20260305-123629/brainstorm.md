# Brainstorm Summary: Portfolio Site Upgrade

## Session ID
brainstorm-20260305-123629

## What Was Discovered

Transform skitz0.com from a static portfolio into an interactive terminal-themed experience with:

1. **Theme Engine** (P0) — 5 Ghostty-compatible themes (Duotone Dark default, Duotone Light, Homebrew, Dracula, Nord) mapped to CSS custom properties. Theme switching only via typed commands.

2. **Command Bar** (P0) — Hybrid terminal input toggled with `/` or `Ctrl+K`. Core commands (theme, goto, filter, help) plus 60+ easter egg CLI commands with a rotating response pool. Humor from Star Wars, B2TF, MST3K, Monty Python, Spaceballs, HHG, Portal, XKCD, classic computing. Response subsets rotate every ~3 minutes.

3. **Knowledge Graph** (P1) — Sigma.js/WebGL interactive career visualization. Nodes: skills, jobs, projects, certs, tools. Drill-down from overview to detail. Needs career-data.json built out with user.

4. **Project Showcase** (P1) — GitHub-sourced rotating display of repo READMEs fetched client-side. NO BLOG — it's a project showcase. Cached in localStorage.

## Recommended Build Order

1. **Theme Engine** (#1) — foundation everything else depends on
2. **Command Bar** (#2) — core interaction model, enables theme switching
3. **Project Showcase** (#4) — replaces static projects section
4. **Knowledge Graph** (#3) — flagship visual, requires career data session

## Key Decisions
- Sigma.js (WebGL) for graph rendering
- Client-side GitHub API fetching (not build-time)
- 60+ easter egg commands with rotating humor pool
- No blog — project showcase only
- Toggle command bar (not always visible)
- 5 themes sourced from Ghostty theme files

## Issues Created
- #1: Theme engine (P0)
- #2: Command bar + easter eggs (P0)
- #3: Knowledge graph (P1)
- #4: Project showcase (P1)

## Data Needed from User
- Career history (jobs, dates, companies, skills per role) for knowledge graph
- List of GitHub repos to feature in project showcase
- Any certifications to include
