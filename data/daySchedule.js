// Day schedule: W1-6 detailed, W7+ derived.
// rev field maps exactly to subsection titles in revisionCatalog.js

export const buildDaySchedule = () => {
  const detailed = [
    // W1 — JS Core + Arrays
    { d: 1,  w: 1, dsa: "Arrays → Prefix sum",                          proj: "Setup repo + README + Docker dev setup",      design: "—",                        rev: "Variables, Scope & Hoisting" },
    { d: 2,  w: 1, dsa: "Arrays → Kadane's max subarray",               proj: "Express skeleton + health route",             design: "—",                        rev: "Execution Context & this Binding" },
    { d: 3,  w: 1, dsa: "Strings → Palindrome / Anagram",               proj: "Postgres schema + migrations",                design: "—",                        rev: "Event Loop & Concurrency Model" },
    { d: 4,  w: 1, dsa: "Hashing → Two-sum variants",                   proj: "POST /api/shorten (basic)",                  design: "—",                        rev: "Async JavaScript" },
    { d: 5,  w: 1, dsa: "Strings → Longest substring without repeat",   proj: "GET /:code redirect (DB lookup)",            design: "—",                        rev: "Functional Patterns" },
    { d: 6,  w: 1, dsa: "TIMED ×2 (45m each) + review mistakes",        proj: "Integrate shorten → redirect end-to-end",    design: "—",                        rev: "Edge Cases & Interview Traps (JS)" },
    { d: 7,  w: 1, dsa: "Weekly reset + flashcards/notes",              proj: "Backlog grooming",                           design: "System design basics",      rev: "Prototypes & OOP" },

    // W2 — Node.js + Express foundations
    { d: 8,  w: 2, dsa: "Arrays → Two pointers intro",                  proj: "Base62 generator + collision handling",      design: "—",                        rev: "Module System" },
    { d: 9,  w: 2, dsa: "Hashing → Group anagrams",                     proj: "Validation + error format (RFC7807)",        design: "—",                        rev: "Core (Framework Internals)" },
    { d: 10, w: 2, dsa: "Sliding window → Fixed window",                proj: "Tests: Jest + Supertest for core APIs",      design: "—",                        rev: "Middleware (Execution Model)" },
    { d: 11, w: 2, dsa: "Binary search → Classic",                      proj: "Auth stub (JWT scaffolding or API key)",     design: "—",                        rev: "Error Handling" },
    { d: 12, w: 2, dsa: "Sliding window → Variable window",             proj: "List URLs endpoint + pagination",            design: "—",                        rev: "Validation & Security" },
    { d: 13, w: 2, dsa: "TIMED ×2 + first deploy (Render/EC2)",         proj: "First deployment live",                     design: "URL Shortener HLD",        rev: "Testing Strategy" },
    { d: 14, w: 2, dsa: "Weekly reset + write 1-page system overview",  proj: "Write system overview doc",                 design: "System overview",           rev: "Architecture & Best Practices" },

    // W3 — Redis + Rate Limiting
    { d: 15, w: 3, dsa: "Sliding window → Advanced patterns",           proj: "Redis integration + cache-aside",           design: "Caching strategies",        rev: "Redis (Caching, Data Structures, Distributed Behavior)" },
    { d: 16, w: 3, dsa: "Two pointers → Advanced",                      proj: "Cache invalidation + TTL strategy",         design: "Cache invalidation",        rev: "DB + Cache Interaction (Critical Layer)" },
    { d: 17, w: 3, dsa: "Two pointers → 3Sum",                          proj: "Rate limiter (token bucket in Redis)",      design: "Rate limiting patterns",    rev: "AuthN / AuthZ" },
    { d: 18, w: 3, dsa: "Binary search → Rotated sorted array",         proj: "Rate limit headers + 429 handling",         design: "API rate limiting",         rev: "REST API Design" },
    { d: 19, w: 3, dsa: "Binary search → First/last position",          proj: "Logging (JSON) + requestId middleware",     design: "Observability basics",      rev: "HTTP & Networking" },
    { d: 20, w: 3, dsa: "TIMED ×2 + load test (k6/autocannon) + tune", proj: "Load test + performance tuning",            design: "Load testing strategies",   rev: "Performance & Scalability (Backend)" },
    { d: 21, w: 3, dsa: "Weekly reset + caching + rate limit notes",    proj: "Document caching + rate limiting",          design: "Caching + rate limit recap",rev: "Failure Modes & Resilience" },

    // W4 — CI/CD + Security
    { d: 22, w: 4, dsa: "Arrays/Strings → Mixed review",                proj: "Nginx reverse proxy + HTTPS plan",          design: "Reverse proxy patterns",    rev: "Linux & Git" },
    { d: 23, w: 4, dsa: "Hashing → Review",                             proj: "CI (lint/test) via GitHub Actions",         design: "CI/CD basics",              rev: "CI/CD & Deployment" },
    { d: 24, w: 4, dsa: "Sliding window → Review",                      proj: "CD (deploy on push) + health check",        design: "Deployment strategies",     rev: "Docker (Containers & Isolation)" },
    { d: 25, w: 4, dsa: "Binary search → Review",                       proj: "Security sweep (helmet/cors/sanitize)",     design: "Security patterns",         rev: "Security & Best Practices" },
    { d: 26, w: 4, dsa: "Recap set — W1–4 topics",                      proj: "DB indexes + EXPLAIN basics",               design: "DB optimization",           rev: "PostgreSQL (Storage, Queries, Concurrency)" },
    { d: 27, w: 4, dsa: "TIMED ×2 + v1 production readiness checklist", proj: "v1 production readiness finalized",         design: "Production checklist",      rev: "AWS & Cloud Infrastructure" },
    { d: 28, w: 4, dsa: "Weekly reset + resume bullet draft",           proj: "Draft project resume bullet",               design: "Resume tailoring",          rev: "Observability & Monitoring" },

    // W5 — Trees + Analytics
    { d: 29, w: 5, dsa: "Trees → DFS pre/in/post (recursive)",          proj: "Click tracking table + write path",         design: "TinyURL deep dive",         rev: "Streams" },
    { d: 30, w: 5, dsa: "Trees → BFS level-order",                      proj: "Async queue (simple worker) for analytics", design: "Message queues",            rev: "EventEmitter" },
    { d: 31, w: 5, dsa: "Trees → LCA",                                  proj: "Aggregation job (daily counts)",            design: "Aggregation strategies",    rev: "Concurrency & Performance" },
    { d: 32, w: 5, dsa: "Trees → Serialize/deserialize",                proj: "Analytics endpoints (top links, clicks)",   design: "Analytics API design",      rev: "Event Loop Deep Dive (Node-Specific)" },
    { d: 33, w: 5, dsa: "Trees → Recap",                                proj: "Monitoring basics (CloudWatch logs/alarms)",design: "Monitoring strategies",     rev: "Error Handling & Reliability" },
    { d: 34, w: 5, dsa: "TIMED ×2 + analytics end-to-end",             proj: "Run analytics end-to-end",                  design: "End-to-end design review",  rev: "Networking & HTTP Internals" },
    { d: 35, w: 5, dsa: "Weekly reset + System design: TinyURL",        proj: "Write TinyURL design doc",                  design: "TinyURL complete design",   rev: "Edge Cases & Interview Traps (Node)" },

    // W6 — Hardening + Security
    { d: 36, w: 6, dsa: "Trees → Harder problems",                      proj: "Harden analytics",                         design: "WhatsApp design intro",     rev: "Iterators & Generators" },
    { d: 37, w: 6, dsa: "Trees → Path sum patterns",                    proj: "API docs (Swagger/OpenAPI)",                design: "API documentation patterns",rev: "Advanced Objects & Meta Programming" },
    { d: 38, w: 6, dsa: "Trees → Right-side view",                      proj: "Project documentation",                    design: "System docs",               rev: "Memory & Performance" },
    { d: 39, w: 6, dsa: "Trees → DFS iterative",                        proj: "Security hardening pass",                  design: "Security design review",    rev: "Request Lifecycle Deep Dive" },
    { d: 40, w: 6, dsa: "Trees → BFS variations",                       proj: "Performance optimizations",                design: "Performance design",        rev: "Performance & Scalability (Express)" },
    { d: 41, w: 6, dsa: "TIMED ×2 + W6 integration review",            proj: "W6 integration review",                    design: "Design session recap",      rev: "Edge Cases & Interview Traps (Express)" },
    { d: 42, w: 6, dsa: "Weekly reset + Trees complete review",         proj: "Document full project state",              design: "W5–6 design recap",         rev: "Query Optimization & Patterns" },
  ];

  // W7–10: Graphs + Heap + DP. Rev rotates through backend internals.
  const w7_10_dsa = [
    "Graphs → BFS shortest path (unweighted)", "Graphs → Dijkstra (weighted)",
    "Graphs → Cycle detection", "Graphs → Union-find", "Graphs → Topological sort",
    "Graphs → Number of islands", "Graphs → Course schedule",
    "Heap → Top-K frequent", "Heap → Kth largest", "Heap → Merge K sorted lists",
    "Heap → Task scheduler", "Heap → Sliding window maximum", "Heap → Median from stream",
    "DP → Climb stairs / House robber", "DP → Coin change / Word break",
    "DP → Unique paths", "DP → Edit distance", "DP → LCS", "DP → Burst balloons", "DP → DP on trees",
    "Mixed review — Graphs", "Mixed review — Heap", "Mixed review — DP 1D", "Mixed review — DP 2D",
    "DP → Harder problems", "Graphs → Harder patterns", "DP recap", "Mixed recap",
  ];
  const designs_7_10 = [
    "Rate Limiter system design", "WhatsApp system design",
    "News Feed system design", "TinyURL deep recap",
  ];
  const rev_7_10 = [
    "Failure Modes & Scaling (DB)",
    "Edge Cases & Interview Traps (DB)",
    "System Interactions (Glue Layer)",
    "Edge Cases & Interview Traps (Backend)",
    "Scaling & Reliability",
    "Edge Cases & Interview Traps (DevOps)",
    "Performance & Scalability (Backend)",
  ];

  for (let i = 0; i < 28; i++) {
    const day = 43 + i;
    const week = 7 + Math.floor(i / 7);
    const dow = (i % 7) + 1;
    detailed.push({
      d: day, w: week,
      dsa: dow <= 5 ? w7_10_dsa[i % w7_10_dsa.length]
         : dow === 6 ? "TIMED ×2 + 1 mock system design (45–60m)"
         : "Weekly reset + identify top 3 weak areas",
      proj: "Analytics hardening / project storytelling practice",
      design: designs_7_10[Math.floor(i / 7) % designs_7_10.length],
      rev: rev_7_10[i % rev_7_10.length],
    });
  }

  // W11–16: Interview mode. Rev = full rotation of all catalog subsections.
  const designs_11_16 = ["TinyURL mock", "Rate Limiter mock", "WhatsApp mock", "News Feed mock"];
  const rev_11_16 = [
    "Variables, Scope & Hoisting", "Execution Context & this Binding", "Prototypes & OOP",
    "Event Loop & Concurrency Model", "Async JavaScript", "Module System", "Streams",
    "Middleware (Execution Model)", "Error Handling", "AuthN / AuthZ", "REST API Design",
    "PostgreSQL (Storage, Queries, Concurrency)", "Redis (Caching, Data Structures, Distributed Behavior)",
    "DB + Cache Interaction (Critical Layer)", "Linux & Git", "Docker (Containers & Isolation)",
    "AWS & Cloud Infrastructure", "CI/CD & Deployment", "Observability & Monitoring",
    "HTTP & Networking", "Failure Modes & Resilience", "Security & Best Practices",
    "Concurrency & Performance", "Functional Patterns", "Memory & Performance",
    "Edge Cases & Interview Traps (JS)", "Edge Cases & Interview Traps (Node)",
    "Edge Cases & Interview Traps (Express)", "Edge Cases & Interview Traps (Backend)",
    "Edge Cases & Interview Traps (DB)", "Edge Cases & Interview Traps (DevOps)",
    "Iterators & Generators", "Advanced Objects & Meta Programming",
    "Query Optimization & Patterns", "Performance & Scalability (Backend)",
    "Request Lifecycle Deep Dive", "Networking & HTTP Internals",
    "Architecture & Best Practices", "Scaling & Reliability",
    "System Interactions (Glue Layer)", "Testing Strategy", "Failure Modes & Scaling (DB)",
  ];

  for (let i = 0; i < 42; i++) {
    const day = 71 + i;
    const week = 11 + Math.floor(i / 7);
    const dow = (i % 7) + 1;
    detailed.push({
      d: day, w: week,
      dsa: dow <= 5 ? "TIMED: 1 problem (45m) + review + 20m revision notes"
         : dow === 6 ? "Full mock interview (DSA + system design + project storytelling)"
         : "Applications + resume iteration + weekly reset",
      proj: "Project storytelling: 2-min + 10-min walkthrough drills",
      design: designs_11_16[i % 4],
      rev: rev_11_16[i % rev_11_16.length],
    });
  }

  return detailed;
};

export const DAY_SCHEDULE = buildDaySchedule();

export const PROTOCOL = [
  "Understand: restate + constraints + edge cases",
  "Brute force: say the naive approach + TC/SC",
  "Optimize: identify bottleneck + pattern",
  "Code: clean structure + names",
  "Dry run: normal + edge case",
  "Complexity: justify TC/SC",
];

export const SD_FRAMEWORK = [
  "Functional requirements",
  "Non-functional requirements",
  "Capacity estimation",
  "API design",
  "Data model (+ indexes)",
  "High-level architecture",
  "Bottlenecks",
  "Caching/queues/sharding (justify)",
  "Trade-offs",
  "Failure scenarios",
];
