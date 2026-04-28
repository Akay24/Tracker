export const PROJECT_SECTIONS = [
  {
    id: "api",
    title: "API Endpoints",
    items: [
      { id: "post-shorten", label: "POST /api/shorten" },
      { id: "get-code", label: "GET /:code (redirect)" },
      { id: "delete-code", label: "DELETE /:code" },
      { id: "get-urls", label: "GET /api/urls (paginated)" },
    ],
  },
  {
    id: "core",
    title: "Core Infrastructure",
    items: [
      { id: "db-schema", label: "PostgreSQL schema + migrations (urls, users, clicks)" },
      { id: "base62", label: "Base62 short code generation + collision handling" },
      { id: "redis-cache", label: "Redis cache-aside for redirects (TTL ~24h)" },
      { id: "rate-limiter", label: "Distributed rate limiting (Redis token bucket per IP/user)" },
      { id: "auth-jwt", label: "Auth: JWT access + refresh rotation (HttpOnly cookies)" },
      { id: "click-queue", label: "Async click analytics: queue → worker → aggregate table" },
      { id: "cron-expiry", label: "Expiry cleanup cron job" },
    ],
  },
  {
    id: "quality",
    title: "Quality & Observability",
    items: [
      { id: "tests", label: "Jest + Supertest for core API tests" },
      { id: "logging", label: "Structured logging (JSON + correlation ID)" },
      { id: "monitoring", label: "CloudWatch logs + alarms" },
      { id: "security", label: "Security sweep (helmet / cors / input sanitize)" },
      { id: "db-indexes", label: "DB indexes + EXPLAIN ANALYZE" },
      { id: "load-test", label: "Load test (k6/autocannon) + tune" },
    ],
  },
  {
    id: "deploy",
    title: "Deployment & CI/CD",
    items: [
      { id: "docker", label: "Docker multi-stage build" },
      { id: "nginx", label: "Nginx reverse proxy + HTTPS" },
      { id: "ci", label: "GitHub Actions CI (lint → test → build)" },
      { id: "cd", label: "GitHub Actions CD (deploy → health check)" },
      { id: "ec2", label: "EC2 + Nginx + PM2" },
      { id: "rds", label: "RDS Postgres + ElastiCache Redis" },
      { id: "analytics-e2e", label: "Analytics end-to-end (click → aggregate → endpoint)" },
    ],
  },
];

export const PROJECT_READINESS_FIELDS = [
  { key: "pitch_2min", label: "2-min pitch" },
  { key: "deep_dive", label: "Deep dive" },
  { key: "tradeoffs_explained", label: "Trade-offs explained" },
  { key: "bottlenecks_known", label: "Bottlenecks known" },
];
