# Requirements: Career Knowledge Graph

**Feature**: career-knowledge-graph
**Issue**: #3
**Status**: APPROVED
**Created**: 2026-03-05

---

## 1. Problem Statement

The skills section is a flat grid of tags that doesn't show relationships, experience depth, or career progression. Visitors can't see how skills connect to jobs, projects, or each other. An interactive knowledge graph tells the career story visually, showing 20+ years of interconnected experience across Linux, cloud, security, DevOps, and full-stack development.

## 2. Proposed Solution

Replace the existing Skills section with an interactive WebGL knowledge graph using **Sigma.js** + **graphology**. Career data is extracted from resumes into a static `career-data.json` file at build time. The graph renders with animated node entrance, supports click-to-drill, hover tooltips, drag-to-reposition, zoom/pan, and integrates with the existing command bar filter system and theme engine.

## 3. Data Model

### 3.1 Data Source

Career data will be parsed from 3 resume PDFs into `content/career-data.json`:
- Paul_Norton_-_Digital_Technology_Guru.pdf
- Paul_Norton_-_Senior_Linux_Engineer.pdf
- Copy of Linux Platform Engineer.pdf

A build-time script (`scripts/parse-resumes.ts` or manual curation) creates `career-data.json`.

### 3.2 Node Types

| Type | Examples | Visual | Count (est.) |
|------|----------|--------|------------|
| `role` | Senior Linux Cloud Engineer, Principal Consultant, Senior Full Stack Developer, SEO Manager | Large circle | 4 |
| `company` | Smith Micro Software, Norton Consulting, Ronin Advertising, Higher Images | Medium square | 4 |
| `skill` | Linux, Docker, Terraform, Ansible, AWS, Kubernetes, Python, etc. | Small circle | ~50-60 |
| `project` | skitz0prints, ZenDeploy, mcp-discord-notify, GMMK2-96, MD-easy, neurOs | Medium diamond | 6 |
| `education` | Robert Morris University (BS), CCAC (Associates) | Medium triangle | 2 |
| `certification` | (if any added later) | Badge shape | 0+ |

**Estimated total**: ~75-80 nodes

### 3.3 Edge Types

| Edge | From → To | Meaning |
|------|-----------|---------|
| `worked-at` | role → company | Employment relationship |
| `used-skill` | role → skill | Skill used in that role |
| `built-with` | project → skill | Technology used in project |
| `earned-at` | education → company (school) | Degree earned |
| `requires` | certification → skill | Cert prerequisite |
| `part-of` | skill → skill-category | Skill grouping |

### 3.4 Node Metadata

```typescript
interface GraphNode {
  id: string;
  type: 'role' | 'company' | 'skill' | 'project' | 'education' | 'certification';
  label: string;
  category?: string;          // Skill category from site.json (e.g., "Cloud & Infrastructure")
  startDate?: string;         // ISO date for roles/education
  endDate?: string;           // ISO date or "present"
  proficiency?: number;       // 1-5 for skills (determines node size)
  description?: string;       // Tooltip text
  url?: string;               // External link (GitHub, LinkedIn)
}
```

### 3.5 Career Data (extracted from resumes)

**Roles:**
1. Senior Linux Cloud Engineer — Smith Micro Software (Jan 2022 – Oct 2025)
2. Principal Consultant — Norton Consulting (Jan 2017 – Present)
3. Senior Full Stack Developer / Senior Technology Specialist — Ronin Advertising (Aug 2012 – Dec 2016)
4. SEO Manager — Higher Images (Dec 2006 – Jan 2012)

**Education:**
1. BS Information Sciences — Robert Morris University (Aug 2002 – Dec 2003)
2. Associates in Networking & Programming — CCAC (Jan 2001 – Jun 2002)

**Skills** (from resumes + site.json, ~60 unique):
Cloud & Infrastructure: AWS, GCP, Azure, IBM Cloud, EKS, EC2, IAM, Route53, CloudFormation, Global Accelerator
DevOps & IaC: Terraform, Ansible, Packer, Jenkins, GitHub Actions, GitOps, Zabbix, Jira, Prometheus, Grafana
Linux & Platforms: Debian, Ubuntu, CentOS, RHEL, Nginx, Apache, MySQL, PostgreSQL, Redis, PHP
Containers & Orchestration: Docker, Kubernetes, OpenShift, K9s, kubectl, Helm, ETCD, LXC, ProxMox
Security & Compliance: PCI Compliance, GHAS, Trivy, Wazuh, Dependabot, Patch Management, Cyber Security
AI/ML & Data: TensorFlow, PyTorch, Jupyter, MLOps, Data Pipelines, LLMs
Coding & Scripting: Python, Bash, Go, JavaScript, TypeScript, PHP, C#, Rust, Java, Node.js
3D Printing & Design: FDM, Resin, Tinkercad, Klipper, Prototyping
Networking: DNS, TCP/IP, VPNs, Tailscale, pfSense, Load Balancing, BGP, VLAN

**Projects** (from site.json):
skitz0prints, ZenDeploy, mcp-discord-notify, GMMK2-96, MD-easy, neurOs

## 4. Functional Requirements

### FR-1: Graph Rendering
- FR-1.1: Render an interactive knowledge graph using Sigma.js (WebGL) + graphology
- FR-1.2: All node types (role, company, skill, project, education) visible in overview mode
- FR-1.3: Nodes clustered by category (skill categories match site.json groupings)
- FR-1.4: Node size determined by type (roles/companies large, skills scaled by proficiency)
- FR-1.5: Node shape/color differentiates types (see Visual Design section)
- FR-1.6: Edges rendered as lines connecting related nodes
- FR-1.7: Edge opacity reduced for visual clarity (0.3 default, 1.0 on highlight)

### FR-2: Interaction — Click & Drill-Down
- FR-2.1: Click a node to highlight it and all directly connected nodes
- FR-2.2: Non-connected nodes dim to 0.15 opacity
- FR-2.3: Connected edges highlight to full opacity
- FR-2.4: Click background (empty space) to reset to overview
- FR-2.5: Hover a node shows tooltip with: label, type, description, date range (if applicable)

### FR-3: Interaction — Drag, Zoom, Pan
- FR-3.1: Drag any node to reposition it (node stays where dropped)
- FR-3.2: Mouse wheel / pinch to zoom in/out
- FR-3.3: Click-drag on background to pan
- FR-3.4: Touch support: pinch-to-zoom, drag-to-pan on mobile
- FR-3.5: Double-click to zoom into a node's neighborhood

### FR-4: Animated Entrance
- FR-4.1: On first render, nodes fly in from random positions to their layout positions
- FR-4.2: Staggered animation — nodes appear in waves by type (companies first, then roles, then skills)
- FR-4.3: Animation duration: ~1.5 seconds total
- FR-4.4: prefers-reduced-motion: nodes appear instantly at final positions, no animation

### FR-5: Command Bar Integration
- FR-5.1: `filter <keyword>` highlights matching graph nodes (same as card filtering)
- FR-5.2: Graph nodes should have a searchable text representation for filter matching
- FR-5.3: Non-matching nodes dim (consistent with card dimming behavior)
- FR-5.4: `filter clear` resets graph to full visibility
- FR-5.5: `goto graph` or `goto skills` scrolls to the knowledge graph section

### FR-6: Theme Integration
- FR-6.1: All graph colors derived from active theme CSS custom properties
- FR-6.2: Node colors use theme palette variables (--palette-N)
- FR-6.3: Edge color uses --border or --fg-muted
- FR-6.4: Background uses --bg-base
- FR-6.5: Tooltip styled with --bg-elevated, --fg-primary, --border
- FR-6.6: On theme change, graph re-renders with new colors (listen for theme change event)

### FR-7: README/Detail Panel (optional stretch)
- FR-7.1: Click a project node opens a detail panel showing project description and link
- FR-7.2: Click a role node shows job description, dates, key accomplishments
- FR-7.3: Detail panel styled consistently with the README modal from ProjectShowcase

### FR-8: Layout Algorithm
- FR-8.1: Use ForceAtlas2 layout from graphology-layout-forceatlas2
- FR-8.2: Initial layout computed, then frozen (no continuous physics)
- FR-8.3: Category clusters: skills grouped near their category, roles near their companies
- FR-8.4: Layout deterministic (same data = same visual layout via seed)

## 5. Non-Functional Requirements

- NFR-1: Dependencies — sigma.js, graphology, graphology-layout-forceatlas2 (3 new deps)
- NFR-2: Bundle size — sigma (~50KB gzip), graphology (~15KB gzip), forceatlas2 (~5KB gzip)
- NFR-3: Performance — graph renders within 1 second for 100 nodes
- NFR-4: Performance — 60fps interaction (zoom, pan, drag) via WebGL
- NFR-5: Accessibility — keyboard navigation: Tab to graph, arrow keys between nodes, Enter to drill
- NFR-6: Accessibility — ARIA: role="img" with aria-label, sr-only node list fallback
- NFR-7: Accessibility — screen reader: hidden text list of all skills and their connections
- NFR-8: Mobile — usable on 320px+ viewport width
- NFR-9: Mobile — graph auto-fits container on resize
- NFR-10: No SSR — graph renders entirely client-side (canvas/WebGL)
- NFR-11: Static fallback — before JS loads, show the existing skills grid as fallback content
- NFR-12: The word "blog" must NEVER appear anywhere
- NFR-13: Never add Co-Authored-By to git commits

## 6. Architecture Constraints

- AC-1: Single-file Astro component pattern (consistent with ProjectShowcase.astro, CommandBar.astro)
- AC-2: Career data lives in `content/career-data.json` (loaded at build time by Astro frontmatter)
- AC-3: sigma.js + graphology imported client-side via `<script>` tag (Astro processes these)
- AC-4: Component replaces Skills section — same section ID `id="skills"` for goto compatibility
- AC-5: CSS uses only theme custom properties (no hardcoded colors)
- AC-6: Canvas element for WebGL rendering, with CSS-styled overlays for tooltips/panels
- AC-7: Graph state managed in plain JS (no framework reactivity needed)
- AC-8: prefers-reduced-motion respected for all animations

## 7. Scope Boundaries

### In Scope
- Career knowledge graph component (KnowledgeGraph.astro)
- career-data.json with full career history from resumes
- Animated entrance, full interactivity (drag, zoom, pan, click drill-down)
- Theme integration and command bar filter integration
- Screen reader fallback (hidden skills list)
- Static skills grid fallback before JS loads
- Update index.astro to replace Skills with KnowledgeGraph
- Update CommandBar.astro filter to support graph nodes
- CHANGELOG update

### Out of Scope
- Real-time data updates (all static at build time)
- User-editable graph
- Resume PDF parsing automation (data manually curated into JSON)
- 3D graph rendering
- Graph export/share functionality
- Timeline/chronological view (could be future enhancement)

## 8. Dependencies

- Issue #1 (Theme Engine) — COMPLETED — provides CSS custom properties and window.__theme API
- Issue #2 (Command Bar) — COMPLETED — provides filter command and window.__terminal API
- Issue #4 (Project Showcase) — COMPLETED — established pattern for single-file components

## 9. Component Structure

### Props
```typescript
interface Props {
  skills: SkillCategory[];    // Fallback skills grid data
  careerData: CareerData;     // Graph data from career-data.json
  revealIndex?: number;
}
```

### HTML Template
```
<section id="skills" data-reveal data-reveal-index={revealIndex}>
  <h2>## > career_knowledge_graph</h2>

  <!-- Static fallback: skills grid (hidden when JS loads) -->
  <div class="graph__fallback">
    {skills grid from Skills.astro}
  </div>

  <!-- Graph container (shown when JS loads) -->
  <div class="graph__container" style="display:none">
    <canvas class="graph__canvas"></canvas>
    <div class="graph__tooltip" hidden></div>
    <div class="graph__controls">
      <button>Zoom In</button>
      <button>Zoom Out</button>
      <button>Reset</button>
    </div>
    <div class="graph__legend">
      {node type legend}
    </div>
  </div>

  <!-- SR-only: accessible node list -->
  <div class="sr-only">
    {all skills and connections as text}
  </div>
</section>
```

## 10. Visual Design

### Node Colors by Type (mapped from theme palette)
| Type | Palette Variable | Shape |
|------|-----------------|-------|
| role | --palette-4 (warm) | Circle, large |
| company | --palette-6 (blue) | Square, medium |
| skill | --accent | Circle, small |
| project | --palette-2 (green) | Diamond, medium |
| education | --palette-3 (yellow) | Triangle, medium |
| certification | --palette-5 (orange) | Badge, medium |

### Edge Styles
- Default: 1px, --fg-muted at 0.3 opacity
- Highlighted: 2px, --accent at 1.0 opacity
- Type-specific dashing: solid for `used-skill`, dashed for `built-with`

### Tooltip
- Background: --bg-elevated
- Border: 1px solid --border
- Text: --fg-primary (label), --fg-secondary (details)
- Font: --font-mono for labels, --font-sans for descriptions
- Max width: 280px

## 11. Acceptance Criteria

- [ ] `career-data.json` exists with all career history from resumes
- [ ] career-data.json schema has nodes (role, company, skill, project, education) and edges
- [ ] Sigma.js + graphology installed as dependencies
- [ ] KnowledgeGraph.astro component created
- [ ] Component replaces Skills section in index.astro
- [ ] Section retains `id="skills"` for goto command
- [ ] Overview graph renders with categorized, sized nodes
- [ ] Animated entrance with staggered node appearance
- [ ] Click node to drill into sub-graph (highlight connected, dim others)
- [ ] Click background to reset
- [ ] Hover shows tooltip with node details
- [ ] Drag nodes to reposition
- [ ] Zoom (wheel/pinch) and pan (drag background)
- [ ] Touch-friendly on mobile (zoom, pan, drag)
- [ ] `filter` command highlights matching graph nodes
- [ ] Graph colors respond to theme changes
- [ ] Graph renders within 1 second
- [ ] Static skills grid shown as fallback before JS loads
- [ ] prefers-reduced-motion: no entrance animation, instant transitions
- [ ] Keyboard navigation: Tab to graph, arrow keys between nodes
- [ ] ARIA labels and sr-only skills list
- [ ] No instances of the word "blog" anywhere
- [ ] No Co-Authored-By in any commits
- [ ] Build passes (`npx astro build`)

## 12. Open Questions

1. **Detail panel**: Should clicking a role/project node open a modal (like README modal in ProjectShowcase), or a side panel, or just the tooltip is enough?
2. **Category clusters**: Should the ForceAtlas2 layout naturally cluster, or should we pre-compute fixed positions per category?
3. **Legend**: Always visible, or collapsible/togglable?

## 13. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sigma.js bundle size (~70KB gzip total) | Slower initial load | Lazy-load graph JS, keep fallback grid |
| WebGL not available (old browsers) | Graph won't render | Fallback skills grid stays visible |
| 75+ nodes may be visually dense | Hard to read | Good layout algorithm, zoom, category clustering |
| ForceAtlas2 layout non-deterministic | Different layout on each load | Use seed parameter, or pre-compute and cache positions |
