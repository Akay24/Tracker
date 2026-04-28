export const PROJECT_SECTIONS = [
  {
    id: "api",
    title: "API Endpoints",
    items: [
      { id: "post-shorten",  label: "POST /api/shorten — validate input, return {shortCode, shortUrl, expiresAt}" },
      { id: "get-code",      label: "GET /:code — redirect (301 permanent / 302 temporary) with X-Cache header" },
      { id: "delete-code",   label: "DELETE /:code — auth-gated, idempotent, invalidate Redis cache" },
      { id: "get-urls",      label: "GET /api/urls — cursor pagination, filtering by created_at range" },
      { id: "get-analytics", label: "GET /api/analytics/:code — top countries, clicks/day, referrers" },
    ],
  },
  {
    id: "core",
    title: "Core Infrastructure",
    items: [
      { id: "db-schema",    label: "PostgreSQL schema: urls, users, clicks tables + migrations" },
      { id: "base62",       label: "Base62 short code (7 chars = 62^7 = 3.5T URLs) + collision retry loop" },
      { id: "redis-cache",  label: "Redis cache-aside for redirects (TTL 24h, LRU eviction, HGETALL for metadata)" },
      { id: "rate-limiter", label: "Redis token bucket per IP/user, Lua script for atomic check+decrement" },
      { id: "auth-jwt",     label: "JWT access (15m) + refresh (7d) rotation in HttpOnly cookies" },
      { id: "click-queue",  label: "Async click analytics: Redis LIST queue → background worker → aggregate table" },
      { id: "cron-expiry",  label: "Cron job: soft-delete expired URLs, purge Redis keys, archive clicks" },
    ],
  },
  {
    id: "quality",
    title: "Quality & Observability",
    items: [
      { id: "tests",      label: "Jest + Supertest: shorten, redirect, auth, rate-limit, pagination flows" },
      { id: "logging",    label: "Structured JSON logging: requestId, userId, durationMs, statusCode, path" },
      { id: "monitoring", label: "CloudWatch metrics: p99 latency, 5xx rate, cache hit ratio, queue depth" },
      { id: "security",   label: "helmet, cors (origin allowlist), express-validator, SQL parameterization" },
      { id: "db-indexes", label: "Covering index on (short_code), partial index on active URLs, EXPLAIN ANALYZE" },
      { id: "load-test",  label: "k6 load test: 1000 concurrent redirect RPS, measure p50/p95/p99, tune" },
    ],
  },
  {
    id: "deploy",
    title: "Deployment & CI/CD",
    items: [
      { id: "docker",        label: "Docker multi-stage: builder (npm ci + build) → runner (node:alpine, non-root)" },
      { id: "nginx",         label: "Nginx reverse proxy: TLS termination, gzip, rate-limit zone, upstream keepalive" },
      { id: "ci",            label: "GitHub Actions CI: lint → unit tests → build → Docker image build" },
      { id: "cd",            label: "GitHub Actions CD: push image → SSH deploy → health check → rollback on fail" },
      { id: "ec2",           label: "EC2 (t3.small) + Nginx + PM2 cluster mode, auto-restart" },
      { id: "rds",           label: "RDS Postgres + ElastiCache Redis, VPC private subnets, security groups" },
      { id: "analytics-e2e", label: "Analytics E2E: click → queue → worker → aggregate → API verified" },
    ],
  },
];

export const PROJECT_READINESS_FIELDS = [
  { key: "pitch_2min",      label: "2-min Pitch",         hint: "Problem → solution → scale → what I'd do next" },
  { key: "deep_dive",       label: "10-min Deep Dive",    hint: "Walk through Base62, Redis cache-aside, rate limiter design" },
  { key: "tradeoffs",       label: "Trade-offs Explained", hint: "301 vs 302, Redis vs no cache, async vs sync analytics" },
  { key: "bottlenecks",     label: "Bottlenecks Known",   hint: "DB write lock, Redis eviction, single-worker queue, hot URLs" },
  { key: "scaling_story",   label: "Scaling Story",       hint: "1 server → read replicas → Redis cluster → multi-region CDN" },
];

export const PROJECT_NOTES_FIELDS = [
  { key: "pitch_2min_notes",    label: "2-min Pitch Script",       rows: 4, placeholder: "Problem: developers need short URLs... Solution: Base62 encoded unique IDs... Scale: Redis handles 50K redirects/sec..." },
  { key: "deep_dive_notes",     label: "Deep Dive Notes",          rows: 5, placeholder: "Base62: auto-increment ID → Base62(id) = 7 chars. Collision: impossible since IDs are unique..." },
  { key: "tradeoffs_notes",     label: "Trade-offs Script",        rows: 4, placeholder: "301 (permanent) caches at browser = fewer requests but can't track clicks. 302 (temp) = every click hits server = accurate analytics..." },
  { key: "bottlenecks_notes",   label: "Bottleneck Analysis",      rows: 4, placeholder: "Hot URLs: top 1% of URLs get 80% of traffic. Mitigation: local in-memory LRU cache on app servers, Redis as L2..." },
  { key: "scaling_story_notes", label: "Scaling Story (1→1B)",     rows: 5, placeholder: "v1: single Node.js + Postgres. v2: add Redis cache → 95% cache hit. v3: read replicas. v4: Redis Cluster. v5: CDN for static redirects..." },
  { key: "failure_scenarios",   label: "Failure Scenarios",        rows: 4, placeholder: "Redis down: cache miss → fallback to DB, latency spikes to 50ms but system stays up. DB failover: RDS Multi-AZ automatic ~30s failover..." },
];
