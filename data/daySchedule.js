// Day schedule: W1-6 detailed, W7+ derived. Kept close to the original tracker.

export const buildDaySchedule = () => {
  const detailed = [
    { d: 1, w: 1, dsa: "Arrays → Prefix sum", proj: "Setup repo + README + Docker dev setup", design: "—", rev: "Dev environment setup" },
    { d: 2, w: 1, dsa: "Arrays → Kadane's max subarray", proj: "Express skeleton + health route", design: "—", rev: "Git basics" },
    { d: 3, w: 1, dsa: "Strings → Palindrome / Anagram", proj: "Postgres schema + migrations", design: "—", rev: "HTTP fundamentals" },
    { d: 4, w: 1, dsa: "Hashing → Two-sum variants", proj: "POST /api/shorten (basic)", design: "—", rev: "REST API principles" },
    { d: 5, w: 1, dsa: "Strings → Longest substring without repeat", proj: "GET /:code redirect (DB lookup)", design: "—", rev: "Node.js intro" },
    { d: 6, w: 1, dsa: "TIMED ×2 (45m each) + review mistakes", proj: "Integrate shorten → redirect end-to-end", design: "—", rev: "W1 progress review" },
    { d: 7, w: 1, dsa: "Weekly reset + flashcards/notes", proj: "Backlog grooming", design: "System design basics", rev: "Weekly reset" },

    { d: 8, w: 2, dsa: "Arrays → Two pointers intro", proj: "Base62 generator + collision handling", design: "—", rev: "Express middleware" },
    { d: 9, w: 2, dsa: "Hashing → Group anagrams", proj: "Validation + error format (RFC7807)", design: "—", rev: "Error handling patterns" },
    { d: 10, w: 2, dsa: "Sliding window → Fixed window", proj: "Tests: Jest + Supertest for core APIs", design: "—", rev: "Testing basics" },
    { d: 11, w: 2, dsa: "Binary search → Classic", proj: "Auth stub (JWT scaffolding or API key)", design: "—", rev: "JWT basics" },
    { d: 12, w: 2, dsa: "Sliding window → Variable window", proj: "List URLs endpoint + pagination", design: "—", rev: "Pagination patterns" },
    { d: 13, w: 2, dsa: "TIMED ×2 + first deploy (Render/EC2)", proj: "First deployment live", design: "URL Shortener HLD", rev: "Deployment basics" },
    { d: 14, w: 2, dsa: "Weekly reset + write 1-page system overview", proj: "Write system overview doc", design: "System overview", rev: "Weekly reset" },

    { d: 15, w: 3, dsa: "Sliding window → Advanced patterns", proj: "Redis integration + cache-aside for redirects", design: "Caching strategies", rev: "Redis data types" },
    { d: 16, w: 3, dsa: "Two pointers → Advanced", proj: "Cache invalidation + TTL strategy", design: "Cache invalidation", rev: "Redis TTL/eviction" },
    { d: 17, w: 3, dsa: "Two pointers → 3Sum", proj: "Rate limiter (token bucket in Redis)", design: "Rate limiting patterns", rev: "Token bucket algorithm" },
    { d: 18, w: 3, dsa: "Binary search → Rotated sorted array", proj: "Rate limit headers + 429 handling", design: "API rate limiting", rev: "HTTP rate limit headers" },
    { d: 19, w: 3, dsa: "Binary search → First/last position", proj: "Logging (JSON) + requestId middleware", design: "Observability basics", rev: "Structured logging" },
    { d: 20, w: 3, dsa: "TIMED ×2 + load test (k6/autocannon) + tune", proj: "Load test + performance tuning", design: "Load testing strategies", rev: "Performance tuning" },
    { d: 21, w: 3, dsa: "Weekly reset + caching + rate limit notes", proj: "Document caching + rate limiting", design: "Caching + rate limit recap", rev: "Weekly reset" },

    { d: 22, w: 4, dsa: "Arrays/Strings → Mixed review", proj: "Nginx reverse proxy + HTTPS plan", design: "Reverse proxy patterns", rev: "Nginx basics" },
    { d: 23, w: 4, dsa: "Hashing → Review", proj: "CI (lint/test) via GitHub Actions", design: "CI/CD basics", rev: "GitHub Actions" },
    { d: 24, w: 4, dsa: "Sliding window → Review", proj: "CD (deploy on push) + health check", design: "Deployment strategies", rev: "Health checks" },
    { d: 25, w: 4, dsa: "Binary search → Review", proj: "Security sweep (helmet/cors/sanitize)", design: "Security patterns", rev: "Web security basics" },
    { d: 26, w: 4, dsa: "Recap set — W1–4 topics", proj: "DB indexes + EXPLAIN basics", design: "DB optimization", rev: "PostgreSQL indexing" },
    { d: 27, w: 4, dsa: "TIMED ×2 + v1 production readiness checklist", proj: "v1 production readiness finalized", design: "Production checklist", rev: "Production readiness" },
    { d: 28, w: 4, dsa: "Weekly reset + resume bullet draft", proj: "Draft project resume bullet", design: "Resume tailoring", rev: "Weekly reset" },

    { d: 29, w: 5, dsa: "Trees → DFS pre/in/post (recursive)", proj: "Click tracking table + write path", design: "TinyURL deep dive", rev: "Tree traversal" },
    { d: 30, w: 5, dsa: "Trees → BFS level-order", proj: "Async queue (simple worker) for analytics", design: "Message queues", rev: "Async patterns" },
    { d: 31, w: 5, dsa: "Trees → LCA", proj: "Aggregation job (daily counts)", design: "Aggregation strategies", rev: "DB aggregation" },
    { d: 32, w: 5, dsa: "Trees → Serialize/deserialize", proj: "Analytics endpoints (top links, clicks)", design: "Analytics API design", rev: "API optimization" },
    { d: 33, w: 5, dsa: "Trees → Recap", proj: "Monitoring basics (CloudWatch logs/alarms)", design: "Monitoring strategies", rev: "AWS CloudWatch" },
    { d: 34, w: 5, dsa: "TIMED ×2 + analytics end-to-end", proj: "Run analytics end-to-end", design: "End-to-end design review", rev: "Analytics review" },
    { d: 35, w: 5, dsa: "Weekly reset + System design: TinyURL from scratch", proj: "Write TinyURL design doc", design: "TinyURL complete design", rev: "Weekly reset" },

    { d: 36, w: 6, dsa: "Trees → Harder problems", proj: "Harden analytics", design: "WhatsApp design intro", rev: "Advanced tree problems" },
    { d: 37, w: 6, dsa: "Trees → Path sum patterns", proj: "API docs (Swagger/OpenAPI)", design: "API documentation patterns", rev: "Swagger/OpenAPI" },
    { d: 38, w: 6, dsa: "Trees → Right-side view", proj: "Project documentation", design: "System docs", rev: "Documentation practices" },
    { d: 39, w: 6, dsa: "Trees → DFS iterative", proj: "Security hardening pass", design: "Security design review", rev: "OWASP top 10" },
    { d: 40, w: 6, dsa: "Trees → BFS variations", proj: "Performance optimizations", design: "Performance design", rev: "Caching patterns" },
    { d: 41, w: 6, dsa: "TIMED ×2 + W6 integration review", proj: "W6 integration review", design: "Design session recap", rev: "W5–6 review" },
    { d: 42, w: 6, dsa: "Weekly reset + Trees complete review", proj: "Document full project state", design: "W5–6 design recap", rev: "Weekly reset" },
  ];

  const w7_10_dsa = [
    "Graphs → BFS shortest path (unweighted)",
    "Graphs → Dijkstra (weighted)",
    "Graphs → Cycle detection",
    "Graphs → Union-find",
    "Graphs → Topological sort",
    "Graphs → Number of islands",
    "Graphs → Course schedule",
    "Heap → Top-K frequent",
    "Heap → Kth largest",
    "Heap → Merge K sorted lists",
    "Heap → Task scheduler",
    "Heap → Sliding window maximum",
    "Heap → Median from stream",
    "DP → Climb stairs / House robber",
    "DP → Coin change / Word break",
    "DP → Unique paths",
    "DP → Edit distance",
    "DP → LCS",
    "DP → Burst balloons",
    "DP → DP on trees",
    "Mixed review — Graphs",
    "Mixed review — Heap",
    "Mixed review — DP 1D",
    "Mixed review — DP 2D",
    "DP → Harder problems",
    "Graphs → Harder patterns",
    "DP recap",
    "Mixed recap",
  ];
  const designs_7_10 = [
    "Rate Limiter system design",
    "WhatsApp system design",
    "News Feed system design",
    "TinyURL deep recap",
  ];

  for (let i = 0; i < 28; i++) {
    const day = 43 + i;
    const week = 7 + Math.floor(i / 7);
    const dow = (i % 7) + 1;
    detailed.push({
      d: day,
      w: week,
      dsa:
        dow <= 5
          ? w7_10_dsa[i % w7_10_dsa.length]
          : dow === 6
            ? "TIMED ×2 + 1 mock system design (45–60m)"
            : "Weekly reset + identify top 3 weak areas",
      proj: "Analytics hardening / project storytelling practice",
      design: designs_7_10[Math.floor(i / 7) % designs_7_10.length],
      rev: "Graphs / Heap / DP rotation",
    });
  }

  const designs_11_16 = ["TinyURL mock", "Rate Limiter mock", "WhatsApp mock", "News Feed mock"];
  for (let i = 0; i < 42; i++) {
    const day = 71 + i;
    const week = 11 + Math.floor(i / 7);
    const dow = (i % 7) + 1;
    detailed.push({
      d: day,
      w: week,
      dsa:
        dow <= 5
          ? "TIMED: 1 problem (45m) + review + 20m revision notes"
          : dow === 6
            ? "Full mock interview (DSA + system design + project storytelling)"
            : "Applications + resume iteration + weekly reset",
      proj: "Project storytelling: 2-min + 10-min walkthrough drills",
      design: designs_11_16[i % 4],
      rev: "Interview prep notes",
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
