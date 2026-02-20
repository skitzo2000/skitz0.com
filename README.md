# skitz0.com

Personal site: about, social links, and personal projects. Terminal/CLI aesthetic aligned with [skitz0prints.com](https://skitz0prints.com). Content is data-driven from a single config file.

## Project structure

- **`content/site.json`** — Single source of truth: meta (name, tagline, avatar), `about` blurb, `social` links, `projects` list. Edit this file to add/remove links or projects; no code changes needed.
- **`src/`** — Astro app: `layouts/`, `pages/`, `components/`, `styles/`, `data/` (loads `content/site.json`).
- **`public/`** — Static assets (favicon, images). Put `avatar.png` here if you use an avatar.

## Commands

| Command           | Action                              |
| ----------------- | ----------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Dev server at `http://localhost:4321` |
| `npm run build`   | Production static build → `dist/`   |
| `npm run preview` | Preview the built site locally      |

## Docker

Build and run the site in a container (multi-stage build: Node for Astro build, nginx-unprivileged to serve static files on port 8080):

```bash
docker compose up --build
```

Then open `http://localhost:8080`. The image runs nginx as non-root and includes a health check.

- **Dockerfile**: Multi-stage; layer order favors cache (deps then source); no secrets in layers.
- **`.dockerignore`**: Excludes `node_modules`, `.git`, `dist`, `.env*`, and other unneeded files.
- **docker-compose.yml**: Single `web` service, port 8080, restart policy, resource limit, healthcheck, dedicated network.

HTTPS and domain routing are left to your reverse proxy or host.
