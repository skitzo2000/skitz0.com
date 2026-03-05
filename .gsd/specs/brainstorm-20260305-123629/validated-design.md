# Validated Design

## Scope (Confirmed)
1. Terminal theme engine — 5 themes (Duotone Dark default, Duotone Light, Homebrew, Dracula, Nord)
2. Hybrid command bar — toggle with `/` or Ctrl+K, shell features for power users
3. Interactive career knowledge graph — Sigma.js/WebGL, drill-down from overview to details
4. GitHub-sourced blog — repo READMEs fetched client-side
5. Career timeline section
6. Certifications & stats section

## Entities (Confirmed)
- **Nodes**: Skills, Job Roles, Projects, Certifications, Tools/Technologies
- **Edges**: used-at, built-with, requires, part-of
- **Data sources**: site.json (expanded), GitHub READMEs (client-side), career-data.json (new)

## User Flows (Confirmed)
1. First visit → Duotone Dark, staggered reveal, command bar hint
2. Press `/` → command bar opens, type commands
3. `theme <name>` → instant theme switch
4. `filter <keyword>` → highlight matching skills/projects/graph nodes
5. Click graph node → drill into sub-graph
6. `goto <section>` → smooth scroll
7. Easter egg CLI commands → comedic responses

## NFRs (Confirmed)
- Performance: < 3s first paint, graph < 1s, theme switch < 100ms
- Accessibility: keyboard nav, screen reader, reduced-motion
- Mobile: tap-to-open command bar, touch-interactive graph
- SEO: static HTML base
- Deployment: Docker/nginx, auto-rebuild on push
