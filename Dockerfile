# skitz0.com — multi-stage build: Astro static site served by nginx
# Stage 1: build static site
FROM node:20-alpine AS builder

WORKDIR /app

# Layer order: deps first for better cache
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve with nginx (minimal; runs as non-root)
FROM nginxinc/nginx-unprivileged:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
