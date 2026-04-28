export const REVISION_SECTIONS = [
  {
    id: "js",
    title: "JavaScript Core",
    subsections: [
      {
        title: "Variables, Scope & Hoisting",
        items: [
          "var vs let vs const",
          "TDZ",
          "Hoisting rules",
          "Lexical scope",
          "Closures (encapsulation, memoization)",
          "IIFE",
        ],
      },
      {
        title: "Prototypes & OOP",
        items: [
          "Prototype chain",
          "Object.create",
          "class/extends/super/static/#private",
          "new keyword (4 steps)",
          "keys/values/entries + hasOwnProperty",
          "WeakMap/WeakSet",
          "Symbol + Symbol.iterator",
        ],
      },
      {
        title: "Event Loop",
        items: [
          "Call stack",
          "Microtasks vs macrotasks",
          "Tick order",
          "process.nextTick",
          "setImmediate vs setTimeout(0)",
          "Worker threads",
        ],
      },
      {
        title: "Async JS",
        items: [
          "Promise states + chaining",
          "all / allSettled / race / any",
          "async/await try/catch",
          "Parallel vs sequential",
          "for await...of",
        ],
      },
      {
        title: "Functional Patterns",
        items: [
          "map/filter/reduce",
          "flat/flatMap",
          "Destructuring",
          "Spread vs rest",
          "?. and ??",
          "Memoization",
          "Currying",
          "Generators",
          "Proxy + Reflect",
        ],
      },
    ],
  },
  {
    id: "node",
    title: "Node.js Deep Dive",
    subsections: [
      {
        title: "Module System",
        items: [
          "CJS vs ESM + interop",
          "Module caching",
          "__dirname/__filename vs ESM",
          "package.json exports field",
          "Resolution basics",
        ],
      },
      {
        title: "EventEmitter",
        items: [
          "on/once/off/emit",
          "Listener leak warnings",
          "'error' event handling",
          "process events",
        ],
      },
      {
        title: "Streams",
        items: [
          "Readable/Writable/Transform",
          "pipe + backpressure",
          "stream.pipeline",
          "HTTP streaming patterns",
        ],
      },
      {
        title: "Concurrency & Performance",
        items: [
          "cluster vs PM2",
          "worker threads",
          "exec vs spawn vs fork + IPC",
          "libuv thread pool",
          "--inspect profiling",
          "Buffer vs TypedArray",
        ],
      },
      {
        title: "Core Modules",
        items: ["fs/path/os/crypto/http(s)/url/util/net"],
      },
    ],
  },
  {
    id: "express",
    title: "Express.js Deep Dive",
    subsections: [
      {
        title: "Core",
        items: [
          "Express over http",
          "req & res essentials",
          "trust proxy",
          "Routers + mounting",
        ],
      },
      {
        title: "Middleware",
        items: [
          "order + next()",
          "json/urlencoded/static",
          "morgan/cors/helmet",
          "Rate limiting + Redis store",
        ],
      },
      {
        title: "Error Handling",
        items: [
          "Error middleware (4 args) last",
          "Async error forwarding",
          "Central error mapper",
        ],
      },
      {
        title: "Validation & Security",
        items: [
          "Zod/express-validator",
          "SQL injection prevention",
          "CSP/XSS basics",
          "API key middleware",
          "Jest + Supertest strategy",
        ],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Internals",
    subsections: [
      {
        title: "HTTP & Networking",
        items: [
          "H1.1 vs H2 vs H3",
          "TCP + TLS handshakes",
          "DNS resolution",
          "Status codes set",
          "Idempotency & retries",
          "Cache-Control + ETag",
          "Content negotiation",
        ],
      },
      {
        title: "AuthN/AuthZ",
        items: [
          "Sessions + cookie flags",
          "JWT access/refresh rotation",
          "bcrypt hashing",
          "OAuth2 auth-code flow",
          "RBAC middleware",
          "Common auth vulns checklist",
        ],
      },
      {
        title: "REST API Design",
        items: [
          "Resource naming",
          "Cursor vs offset pagination",
          "Filtering/sorting",
          "Versioning",
          "RFC7807 error envelope",
          "Idempotency keys",
          "Rate limit headers",
        ],
      },
    ],
  },
  {
    id: "db",
    title: "Databases & Caching",
    subsections: [
      {
        title: "PostgreSQL",
        items: [
          "ACID",
          "Isolation levels + anomalies",
          "B-tree/hash/GIN; partial; covering; composite order",
          "EXPLAIN ANALYZE",
          "ON CONFLICT upsert",
          "JSONB vs JSON",
          "Window functions + CTEs",
          "PgBouncer",
        ],
      },
      {
        title: "Redis",
        items: [
          "Data types",
          "INCR/SETNX/GETSET",
          "NX EX locks",
          "Rate limiting patterns",
          "Cache-aside + invalidation",
          "pub/sub vs streams",
          "RDB vs AOF",
          "Eviction policies",
        ],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    subsections: [
      {
        title: "Linux & Git",
        items: [
          "Navigation + permissions",
          "Process & port debugging",
          "cron + systemd",
          "ssh + tunneling",
          "Branch strategy + PRs",
          "rebase vs merge + interactive",
          "stash/cherry-pick/bisect/reflog",
          "Conventional commits",
        ],
      },
      {
        title: "Docker",
        items: [
          "Dockerfile layers + caching",
          "Multi-stage builds",
          "compose (services, env, volumes, networks)",
          "Healthchecks",
        ],
      },
      {
        title: "AWS & Monitoring",
        items: [
          "EC2 + security groups + EIP",
          "IAM roles",
          "S3 + presigned URLs",
          "CloudWatch logs/metrics/alarms",
          "RDS vs EC2 Postgres",
          "ALB + SSL termination",
          "Parameter Store",
        ],
      },
    ],
  },
];
