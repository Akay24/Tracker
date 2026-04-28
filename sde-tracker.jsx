import { useState, useMemo, useEffect, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DSA_TOPICS = [
  { id: "w1-arrays", weekLabel: "W1 — Arrays", target: "20–25 problems", items: ["Prefix sum", "Kadane's max subarray", "Dutch national flag (3-way partition)", "Sliding window intro", "Rotation", "Next permutation", "Trapping rain water"] },
  { id: "w1-strings", weekLabel: "W1 — Strings", target: "10–15 problems", items: ["Anagram detection", "Palindrome check", "Reverse words", "Longest substring without repeat", "String compression", "KMP concept"] },
  { id: "w2-hashing", weekLabel: "W2 — Hashing", target: "20–25 problems", items: ["Frequency map patterns", "Two-sum variants (pairs/triplets)", "Group anagrams", "Longest consecutive sequence", "LRU cache concept", "First non-repeating character"] },
  { id: "w3-sliding", weekLabel: "W3 — Sliding Window", target: "15–20 problems", items: ["Fixed window max/min", "Variable window (longest/shortest)", "Minimum window substring", "Max consecutive ones with k flips", "Fruit into baskets"] },
  { id: "w3-two-pointers", weekLabel: "W3 — Two Pointers", target: "10–15 problems", items: ["Sorted two-sum", "3Sum", "Container with most water", "Remove duplicates", "Fast/slow pointer (cycle)", "Palindrome with pointers"] },
  { id: "w4-binary-search", weekLabel: "W4 — Binary Search", target: "15–20 problems", items: ["Classic binary search", "Search in rotated sorted array", "First/last position", "Binary search on answer space", "Median of two sorted arrays"] },
  { id: "w5-trees", weekLabel: "W5–6 — Trees", target: "20–25 problems", items: ["DFS pre/in/post (recursive)", "DFS iterative", "BFS level-order", "LCA", "Serialize/deserialize", "Flatten tree", "Right-side view", "Path sum patterns"] },
  { id: "w6-graphs", weekLabel: "W6–7 — Graphs", target: "20–25 problems", items: ["BFS shortest path (unweighted)", "Dijkstra (weighted)", "Cycle detection (directed/undirected)", "Union-find", "Topological sort", "Number of islands", "Course schedule"] },
  { id: "w8-heap", weekLabel: "W8 — Heap / Priority Queue", target: "10–15 problems", items: ["Top-K frequent", "Kth largest", "Merge K sorted lists", "Task scheduler", "Sliding window maximum (deque)", "Median from stream"] },
  { id: "w9-dp", weekLabel: "W9–10 — Dynamic Programming", target: "25–30 problems", items: ["1D: climb stairs, house robber, coin change, word break", "2D: unique paths, edit distance, LCS", "Interval: burst balloons, matrix chain", "DP on trees: diameter, max path sum"] },
];

const PROJECT_SECTIONS = [
  {
    id: "api", title: "API Endpoints", items: [
      { id: "post-shorten", label: "POST /api/shorten" },
      { id: "get-code", label: "GET /:code (redirect)" },
      { id: "delete-code", label: "DELETE /:code" },
      { id: "get-urls", label: "GET /api/urls (paginated)" },
    ]
  },
  {
    id: "core", title: "Core Infrastructure", items: [
      { id: "db-schema", label: "PostgreSQL schema + migrations (urls, users, clicks)" },
      { id: "base62", label: "Base62 short code generation + collision handling" },
      { id: "redis-cache", label: "Redis cache-aside for redirects (TTL ~24h)" },
      { id: "rate-limiter", label: "Distributed rate limiting (Redis token bucket per IP/user)" },
      { id: "auth-jwt", label: "Auth: JWT access + refresh rotation (HttpOnly cookies)" },
      { id: "click-queue", label: "Async click analytics: queue → worker → aggregate table" },
      { id: "cron-expiry", label: "Expiry cleanup cron job" },
    ]
  },
  {
    id: "quality", title: "Quality & Observability", items: [
      { id: "tests", label: "Jest + Supertest for core API tests" },
      { id: "logging", label: "Structured logging (JSON + correlation ID)" },
      { id: "monitoring", label: "CloudWatch logs + alarms" },
      { id: "security", label: "Security sweep (helmet / cors / input sanitize)" },
      { id: "db-indexes", label: "DB indexes + EXPLAIN ANALYZE" },
      { id: "load-test", label: "Load test (k6/autocannon) + tune" },
    ]
  },
  {
    id: "deploy", title: "Deployment & CI/CD", items: [
      { id: "docker", label: "Docker multi-stage build" },
      { id: "nginx", label: "Nginx reverse proxy + HTTPS" },
      { id: "ci", label: "GitHub Actions CI (lint → test → build)" },
      { id: "cd", label: "GitHub Actions CD (deploy → health check)" },
      { id: "ec2", label: "EC2 + Nginx + PM2" },
      { id: "rds", label: "RDS Postgres + ElastiCache Redis" },
      { id: "analytics-e2e", label: "Analytics end-to-end (click → aggregate → endpoint)" },
    ]
  },
];

const REVISION_SECTIONS = [
  {
    id: "js", title: "JavaScript Core", subsections: [
      { title: "Variables, Scope & Hoisting", items: ["var vs let vs const", "TDZ", "Hoisting rules", "Lexical scope", "Closures (encapsulation, memoization)", "IIFE"] },
      { title: "Prototypes & OOP", items: ["Prototype chain", "Object.create", "class/extends/super/static/#private", "new keyword (4 steps)", "keys/values/entries + hasOwnProperty", "WeakMap/WeakSet", "Symbol + Symbol.iterator"] },
      { title: "Event Loop", items: ["Call stack", "Microtasks vs macrotasks", "Tick order", "process.nextTick", "setImmediate vs setTimeout(0)", "Worker threads"] },
      { title: "Async JS", items: ["Promise states + chaining", "all / allSettled / race / any", "async/await try/catch", "Parallel vs sequential", "for await...of"] },
      { title: "Functional Patterns", items: ["map/filter/reduce", "flat/flatMap", "Destructuring", "Spread vs rest", "?.  and ??", "Memoization", "Currying", "Generators", "Proxy + Reflect"] },
    ]
  },
  {
    id: "node", title: "Node.js Deep Dive", subsections: [
      { title: "Module System", items: ["CJS vs ESM + interop", "Module caching", "__dirname/__filename vs ESM", "package.json exports field", "Resolution basics"] },
      { title: "EventEmitter", items: ["on/once/off/emit", "Listener leak warnings", "'error' event handling", "process events"] },
      { title: "Streams", items: ["Readable/Writable/Transform", "pipe + backpressure", "stream.pipeline", "HTTP streaming patterns"] },
      { title: "Concurrency & Performance", items: ["cluster vs PM2", "worker threads", "exec vs spawn vs fork + IPC", "libuv thread pool", "--inspect profiling", "Buffer vs TypedArray"] },
      { title: "Core Modules", items: ["fs/path/os/crypto/http(s)/url/util/net"] },
    ]
  },
  {
    id: "express", title: "Express.js Deep Dive", subsections: [
      { title: "Core", items: ["Express over http", "req & res essentials", "trust proxy", "Routers + mounting"] },
      { title: "Middleware", items: ["order + next()", "json/urlencoded/static", "morgan/cors/helmet", "Rate limiting + Redis store"] },
      { title: "Error Handling", items: ["Error middleware (4 args) last", "Async error forwarding", "Central error mapper"] },
      { title: "Validation & Security", items: ["Zod/express-validator", "SQL injection prevention", "CSP/XSS basics", "API key middleware", "Jest + Supertest strategy"] },
    ]
  },
  {
    id: "backend", title: "Backend Internals", subsections: [
      { title: "HTTP & Networking", items: ["H1.1 vs H2 vs H3", "TCP + TLS handshakes", "DNS resolution", "Status codes set", "Idempotency & retries", "Cache-Control + ETag", "Content negotiation"] },
      { title: "AuthN/AuthZ", items: ["Sessions + cookie flags", "JWT access/refresh rotation", "bcrypt hashing", "OAuth2 auth-code flow", "RBAC middleware", "Common auth vulns checklist"] },
      { title: "REST API Design", items: ["Resource naming", "Cursor vs offset pagination", "Filtering/sorting", "Versioning", "RFC7807 error envelope", "Idempotency keys", "Rate limit headers"] },
    ]
  },
  {
    id: "db", title: "Databases & Caching", subsections: [
      { title: "PostgreSQL", items: ["ACID", "Isolation levels + anomalies", "B-tree/hash/GIN; partial; covering; composite order", "EXPLAIN ANALYZE", "ON CONFLICT upsert", "JSONB vs JSON", "Window functions + CTEs", "PgBouncer"] },
      { title: "Redis", items: ["Data types", "INCR/SETNX/GETSET", "NX EX locks", "Rate limiting patterns", "Cache-aside + invalidation", "pub/sub vs streams", "RDB vs AOF", "Eviction policies"] },
    ]
  },
  {
    id: "devops", title: "DevOps", subsections: [
      { title: "Linux & Git", items: ["Navigation + permissions", "Process & port debugging", "cron + systemd", "ssh + tunneling", "Branch strategy + PRs", "rebase vs merge + interactive", "stash/cherry-pick/bisect/reflog", "Conventional commits"] },
      { title: "Docker", items: ["Dockerfile layers + caching", "Multi-stage builds", "compose (services, env, volumes, networks)", "Healthchecks"] },
      { title: "AWS & Monitoring", items: ["EC2 + security groups + EIP", "IAM roles", "S3 + presigned URLs", "CloudWatch logs/metrics/alarms", "RDS vs EC2 Postgres", "ALB + SSL termination", "Parameter Store"] },
    ]
  },
];

// Day schedule: W1-6 detailed, W7+ derived
const buildDaySchedule = () => {
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
    "Graphs → BFS shortest path (unweighted)", "Graphs → Dijkstra (weighted)", "Graphs → Cycle detection", "Graphs → Union-find", "Graphs → Topological sort",
    "Graphs → Number of islands", "Graphs → Course schedule", "Heap → Top-K frequent", "Heap → Kth largest", "Heap → Merge K sorted lists",
    "Heap → Task scheduler", "Heap → Sliding window maximum", "Heap → Median from stream", "DP → Climb stairs / House robber",
    "DP → Coin change / Word break", "DP → Unique paths", "DP → Edit distance", "DP → LCS", "DP → Burst balloons", "DP → DP on trees",
    "Mixed review — Graphs", "Mixed review — Heap", "Mixed review — DP 1D", "Mixed review — DP 2D", "DP → Harder problems", "Graphs → Harder patterns", "DP recap", "Mixed recap"
  ];
  const designs_7_10 = ["Rate Limiter system design", "WhatsApp system design", "News Feed system design", "TinyURL deep recap"];

  for (let i = 0; i < 28; i++) {
    const day = 43 + i;
    const week = 7 + Math.floor(i / 7);
    const dow = (i % 7) + 1;
    detailed.push({
      d: day, w: week,
      dsa: dow <= 5 ? w7_10_dsa[i % w7_10_dsa.length] : dow === 6 ? "TIMED ×2 + 1 mock system design (45–60m)" : "Weekly reset + identify top 3 weak areas",
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
      d: day, w: week,
      dsa: dow <= 5 ? "TIMED: 1 problem (45m) + review + 20m revision notes" : dow === 6 ? "Full mock interview (DSA + system design + project storytelling)" : "Applications + resume iteration + weekly reset",
      proj: "Project storytelling: 2-min + 10-min walkthrough drills",
      design: designs_11_16[i % 4],
      rev: "Interview prep notes",
    });
  }

  return detailed;
};

const DAY_SCHEDULE = buildDaySchedule();

const PROTOCOL = [
  "Understand: restate + constraints + edge cases",
  "Brute force: say the naive approach + TC/SC",
  "Optimize: identify bottleneck + pattern",
  "Code: clean structure + names",
  "Dry run: normal + edge case",
  "Complexity: justify TC/SC",
];

const SD_FRAMEWORK = [
  "Functional requirements", "Non-functional requirements", "Capacity estimation", "API design",
  "Data model (+ indexes)", "High-level architecture", "Bottlenecks", "Caching/queues/sharding (justify)", "Trade-offs", "Failure scenarios",
];

// ─── THEME ────────────────────────────────────────────────────────────────────

const C = {
  bg: "#060608", card: "#0d0d14", border: "#1a1a28", borderHover: "#2a2a42",
  orange: "#f97316", orangeD: "#ea6a0a", green: "#34d399", cyan: "#22d3ee",
  yellow: "#fbbf24", purple: "#a78bfa",
  text: "#f1f5f9", textSec: "#94a3b8", textMuted: "#475569",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  input,textarea{font-family:inherit;outline:none}
  input::placeholder,textarea::placeholder{color:#475569}
  input:focus,textarea:focus{border-color:#f97316!important}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-thumb{background:#f97316;border-radius:2px}
  ::-webkit-scrollbar-track{background:transparent}
  button{cursor:pointer;font-family:inherit}
  .ci:hover{background:rgba(249,115,22,0.06)!important}
  .tab-btn:hover{color:#94a3b8!important}
  .card-hover:hover{border-color:#2a2a42!important}
  input[type=range]{accent-color:#f97316}
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const pct = (done, total) => total > 0 ? Math.round((done / total) * 100) : 0;

const ProgressBar = ({ done, total, color = C.orange, height = 6 }) => {
  const p = pct(done, total);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>{done}/{total}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'JetBrains Mono',monospace" }}>{p}%</span>
      </div>
      <div style={{ height, background: C.border, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${p}%`, background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
};

const Card = ({ children, style = {}, glow }) => (
  <div className="card-hover" style={{
    background: C.card, border: `1px solid ${glow ? glow + "44" : C.border}`,
    borderRadius: 12, padding: 20,
    boxShadow: glow ? `0 0 20px ${glow}18` : "none",
    ...style
  }}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C.textMuted, marginBottom: 10 }}>{children}</div>
);

const Pill = ({ children, color = C.orange }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", background: `${color}18`, color, border: `1px solid ${color}38` }}>
    {children}
  </span>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function SDETracker() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentDay, setCurrentDay] = useState(1);
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});
  const [weeklyEntries, setWeeklyEntries] = useState({});
  const [showDaySlider, setShowDaySlider] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ── Persistent storage ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const r1 = await window.storage.get("sde-progress");
        if (r1) { const d = JSON.parse(r1.value); if (d.checked) setChecked(d.checked); if (d.currentDay) setCurrentDay(d.currentDay); }
      } catch { }
      try {
        const r2 = await window.storage.get("sde-weekly");
        if (r2) setWeeklyEntries(JSON.parse(r2.value));
      } catch { }
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const save = async () => { try { await window.storage.set("sde-progress", JSON.stringify({ checked, currentDay })); } catch { } };
    save();
  }, [checked, currentDay, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const save = async () => { try { await window.storage.set("sde-weekly", JSON.stringify(weeklyEntries)); } catch { } };
    save();
  }, [weeklyEntries, loaded]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const toggleCheck = useCallback((key) => setChecked(p => ({ ...p, [key]: !p[key] })), []);
  const toggleExpand = useCallback((key) => setExpanded(p => ({ ...p, [key]: !p[key] })), []);

  const currentWeek = Math.ceil(currentDay / 7);
  const todayPlan = DAY_SCHEDULE.find(x => x.d === currentDay) || DAY_SCHEDULE[DAY_SCHEDULE.length - 1];
  const dowLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][((currentDay - 1) % 7)];
  const dayType = dowLabel === "Sun" ? "Sunday" : dowLabel === "Sat" ? "Saturday" : "Deep Work";
  const dayColor = dowLabel === "Sun" ? C.cyan : dowLabel === "Sat" ? C.yellow : C.orange;

  const dsaProgress = useMemo(() => {
    const total = DSA_TOPICS.reduce((s, t) => s + t.items.length, 0);
    const done = Object.entries(checked).filter(([k, v]) => k.startsWith("dsa:") && v).length;
    return { done, total };
  }, [checked]);

  const projProgress = useMemo(() => {
    const total = PROJECT_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
    const done = Object.entries(checked).filter(([k, v]) => k.startsWith("proj:") && v).length;
    return { done, total };
  }, [checked]);

  const revProgress = useMemo(() => {
    const total = REVISION_SECTIONS.reduce((s, sec) => s + sec.subsections.reduce((ss, sub) => ss + sub.items.length, 0), 0);
    const done = Object.entries(checked).filter(([k, v]) => k.startsWith("rev:") && v).length;
    return { done, total };
  }, [checked]);

  const overall = useMemo(() => {
    const total = dsaProgress.total + projProgress.total + revProgress.total;
    const done = dsaProgress.done + projProgress.done + revProgress.done;
    return pct(done, total);
  }, [dsaProgress, projProgress, revProgress]);

  // ── CheckItem ────────────────────────────────────────────────────────────────
  const CheckItem = ({ itemKey, label }) => {
    const on = !!checked[itemKey];
    return (
      <div className="ci" onClick={() => toggleCheck(itemKey)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s", background: on ? "rgba(249,115,22,0.04)" : "transparent", marginBottom: 2 }}>
        <div style={{ width: 17, height: 17, borderRadius: 5, border: `2px solid ${on ? C.orange : C.border}`, background: on ? C.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
          {on && <span style={{ color: "#000", fontSize: 10, fontWeight: 700 }}>✓</span>}
        </div>
        <span style={{ fontSize: 13, color: on ? C.textMuted : C.textSec, textDecoration: on ? "line-through" : "none", transition: "all 0.15s" }}>{label}</span>
      </div>
    );
  };

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  const DashboardTab = () => {
    const entry = weeklyEntries[currentWeek] || {};
    const update = (field, val) => setWeeklyEntries(p => ({ ...p, [currentWeek]: { ...p[currentWeek], [field]: val } }));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Hero */}
        <Card glow={C.orange} style={{ background: "linear-gradient(135deg,#110800,#0d0d14)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>OVERALL PROGRESS</div>
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-2px", fontFamily: "'JetBrains Mono',monospace", color: C.orange }}>{overall}<span style={{ fontSize: 20, color: C.textMuted }}>%</span></div>
              <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>Day {currentDay} of 112 · Week {currentWeek} of 16</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Pill color={dayColor}>{dayType}</Pill>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{dowLabel}, W{currentWeek}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, height: 8, background: "#1a0800", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overall}%`, background: `linear-gradient(90deg,${C.orange},${C.yellow})`, borderRadius: 999, transition: "width 0.5s" }} />
          </div>
        </Card>

        {/* Stat grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "DSA Topics", ...dsaProgress, color: C.cyan },
            { label: "Project Items", ...projProgress, color: C.green },
            { label: "Revision Items", ...revProgress, color: C.yellow },
          ].map(s => (
            <Card key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: s.color }}>{s.done}<span style={{ fontSize: 13, color: C.textMuted }}>/{s.total}</span></div>
              <div style={{ fontSize: 11, color: C.textSec, marginTop: 3, marginBottom: 10 }}>{s.label}</div>
              <ProgressBar done={s.done} total={s.total} color={s.color} height={4} />
            </Card>
          ))}
        </div>

        {/* Weekly Dashboard */}
        <Card>
          <Label>Weekly Dashboard — Week {currentWeek} (update every Sunday)</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { f: "dsaSolved", label: "DSA problems solved this week (target: 6)", ph: "e.g. 4 — be honest" },
              { f: "projectMilestone", label: "Project milestone shipped", ph: "What did you ship this week?" },
              { f: "systemDesign", label: "System design topic practiced", ph: "e.g. TinyURL end-to-end" },
              { f: "improvement", label: "1 thing to improve next week", ph: "Identify your biggest bottleneck" },
            ].map(({ f, label, ph }) => (
              <div key={f}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5 }}>{label}</div>
                <input value={entry[f] || ""} onChange={e => update(f, e.target.value)} placeholder={ph}
                  style={{ width: "100%", background: "#080810", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }} />
              </div>
            ))}
          </div>
        </Card>

        {/* Phase overview */}
        <Card>
          <Label>5-Phase Master Plan</Label>
          {[
            { weeks: "W1–4", label: "DSA Core + Project Scaffold", detail: "Arrays, strings, hashing, sliding window, two pointers, binary search + URL Shortener foundation", color: C.orange },
            { weeks: "W3–8", label: "Flagship Project (URL Shortener)", detail: "REST API → Base62 → Redis cache → rate limiter → analytics → AWS deploy", color: C.green },
            { weeks: "W5–10", label: "Advanced DSA", detail: "Trees, graphs, heap, DP — DP is the separator", color: C.cyan },
            { weeks: "W8–12", label: "System Design", detail: "Repeatable HLD/LLD: TinyURL, WhatsApp, Rate Limiter, News Feed", color: C.yellow },
            { weeks: "W10–16", label: "Interview Mode", detail: "Timed LC + mocks + resume + applications from W12", color: C.purple },
          ].map(({ weeks, label, detail, color }) => (
            <div key={weeks} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ minWidth: 54, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color, fontWeight: 700, paddingTop: 2 }}>{weeks}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{detail}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* North Star */}
        <Card glow={C.yellow} style={{ background: "linear-gradient(135deg,#0d0a00,#0d0d14)" }}>
          <div style={{ fontSize: 12, color: C.yellow, fontWeight: 700, letterSpacing: "1px", marginBottom: 8 }}>⭐ NORTH STAR</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.8 }}>
            One polished project on AWS with CI/CD + 100 solid LeetCode problems + ability to explain every decision end-to-end.
          </div>
        </Card>

        {/* What not to do */}
        <Card>
          <Label>What NOT to do</Label>
          {["Don't switch between Python, C++, and Go", "Don't build multiple weak projects", "Don't delay projects until later", "Don't overfocus on DevOps early"].map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: "#ef4444", fontSize: 13 }}>✗</span>
              <span style={{ fontSize: 13, color: C.textSec }}>{w}</span>
            </div>
          ))}
        </Card>
      </div>
    );
  };

  // ── TODAY ────────────────────────────────────────────────────────────────────
  const TodayTab = () => {
    const tasks = [
      { emoji: "🧠", label: "DSA ~2h", detail: todayPlan.dsa, color: C.cyan, time: "~2h" },
      { emoji: "🛠️", label: "Project 2–3h", detail: todayPlan.proj, color: C.green, time: "2–3h" },
      { emoji: "🏗️", label: "System Design 40m", detail: todayPlan.design, color: C.yellow, time: "40m" },
      { emoji: "📖", label: "Revision 30m", detail: todayPlan.rev, color: C.orange, time: "30m" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Day header */}
        <Card glow={dayColor} style={{ background: "linear-gradient(135deg,#0c0800,#0d0d14)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1.5px", fontFamily: "'JetBrains Mono',monospace" }}>Day {currentDay}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>Week {currentWeek} of 16 · {dowLabel}</div>
            </div>
            <Pill color={dayColor}>{dayType}</Pill>
          </div>
          <div style={{ marginTop: 14, height: 4, background: C.border, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(currentDay / 112) * 100}%`, background: dayColor, borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 5 }}>{Math.round((currentDay / 112) * 100)}% of 112-day journey complete</div>
        </Card>

        {/* Task cards */}
        {tasks.map(({ emoji, label, detail, color, time }) => (
          <Card key={label}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color, textTransform: "uppercase" }}>{label}</div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.textMuted }}>{time}</span>
                </div>
                <div style={{ fontSize: 14, color: detail === "—" ? C.textMuted : C.text, lineHeight: 1.6 }}>{detail}</div>
              </div>
            </div>
          </Card>
        ))}

        {/* Interview protocol */}
        <Card>
          <Label>Interview Thinking Protocol</Label>
          {PROTOCOL.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.orange, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, minWidth: 18, marginTop: 1 }}>{i + 1}.</span>
              <span style={{ fontSize: 13, color: C.textSec }}>{step}</span>
            </div>
          ))}
        </Card>

        {/* SD Framework */}
        <Card>
          <Label>System Design 10-Step Framework</Label>
          {SD_FRAMEWORK.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < 9 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.yellow, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, minWidth: 22, marginTop: 1 }}>{String(i + 1).padStart(2, "0")}.</span>
              <span style={{ fontSize: 13, color: C.textSec }}>{step}</span>
            </div>
          ))}
        </Card>
      </div>
    );
  };

  // ── DSA ──────────────────────────────────────────────────────────────────────
  const DSATab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.cyan}>
        <Label>DSA Topic Tracker — Mark CONFIDENT, not just "done"</Label>
        <ProgressBar done={dsaProgress.done} total={dsaProgress.total} color={C.cyan} />
      </Card>
      {DSA_TOPICS.map(topic => {
        const done = topic.items.filter((_, i) => checked[`dsa:${topic.id}:${i}`]).length;
        return (
          <Card key={topic.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{topic.weekLabel}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Target: {topic.target}</div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: done === topic.items.length ? C.green : C.textMuted, fontWeight: 700 }}>
                {done}/{topic.items.length}
              </div>
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 999, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct(done, topic.items.length)}%`, background: C.cyan, borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            {topic.items.map((item, i) => (
              <CheckItem key={i} itemKey={`dsa:${topic.id}:${i}`} label={item} />
            ))}
          </Card>
        );
      })}
    </div>
  );

  // ── PROJECT ──────────────────────────────────────────────────────────────────
  const ProjectTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.green}>
        <Label>URL Shortener — Flagship Build Checklist</Label>
        <ProgressBar done={projProgress.done} total={projProgress.total} color={C.green} />
        <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
          Build this live + deployed. Every PR should be a reviewable unit.
        </div>
      </Card>

      {/* Data model reference */}
      <Card>
        <Label>Data Model (PostgreSQL)</Label>
        {[
          { table: "urls", cols: "id (UUID) · short_code (UNIQUE) · long_url · user_id (FK) · created_at · expires_at (nullable)" },
          { table: "users", cols: "id (UUID) · email · password_hash · created_at" },
          { table: "clicks", cols: "id · short_code · clicked_at · ip_hash · user_agent" },
        ].map(({ table, cols }) => (
          <div key={table} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.orange, marginBottom: 4 }}>{table}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{cols}</div>
          </div>
        ))}
      </Card>

      {PROJECT_SECTIONS.map(section => {
        const done = section.items.filter(item => checked[`proj:${section.id}:${item.id}`]).length;
        return (
          <Card key={section.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{section.title}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: done === section.items.length ? C.green : C.textMuted, fontWeight: 700 }}>
                {done}/{section.items.length}
              </div>
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 999, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct(done, section.items.length)}%`, background: C.green, borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            {section.items.map(item => (
              <CheckItem key={item.id} itemKey={`proj:${section.id}:${item.id}`} label={item.label} />
            ))}
          </Card>
        );
      })}
    </div>
  );

  // ── REVISION ─────────────────────────────────────────────────────────────────
  const RevisionTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.yellow}>
        <Label>Atomic Revision Checklists</Label>
        <ProgressBar done={revProgress.done} total={revProgress.total} color={C.yellow} />
        <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted }}>Click a section to expand. Aim for 1 topic rotation per day (~30m).</div>
      </Card>

      {REVISION_SECTIONS.map(section => {
        let secTotal = 0, secDone = 0;
        section.subsections.forEach((sub, si) => {
          secTotal += sub.items.length;
          sub.items.forEach((_, ii) => { if (checked[`rev:${section.id}:${si}:${ii}`]) secDone++; });
        });
        const isOpen = expanded[section.id];
        return (
          <Card key={section.id}>
            <div onClick={() => toggleExpand(section.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{section.title}</div>
                {secDone === secTotal && secTotal > 0 && <Pill color={C.green}>✓ Done</Pill>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: secDone === secTotal ? C.green : C.textMuted, fontWeight: 700 }}>
                  {secDone}/{secTotal}
                </div>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {!isOpen && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 3, background: C.border, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct(secDone, secTotal)}%`, background: C.yellow, borderRadius: 999, transition: "width 0.3s" }} />
                </div>
              </div>
            )}

            {isOpen && (
              <div style={{ marginTop: 16 }}>
                {section.subsections.map((sub, si) => (
                  <div key={si} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C.orange, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                      {sub.title}
                    </div>
                    {sub.items.map((item, ii) => (
                      <CheckItem key={ii} itemKey={`rev:${section.id}:${si}:${ii}`} label={item} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  // ── TABS ─────────────────────────────────────────────────────────────────────
  const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "today", label: "Today" },
    { id: "dsa", label: "DSA" },
    { id: "project", label: "Project" },
    { id: "revision", label: "Revision" },
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "sans-serif", color: C.text }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 20px 0", background: `linear-gradient(180deg,#0a0a12 0%,${C.bg} 100%)`, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#000" }}>SD</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.5px" }}>SDE Master Plan</div>
              <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>16-week Backend → MAANG · URL Shortener flagship</div>
            </div>
          </div>

          {/* Day badge */}
          <div onClick={() => setShowDaySlider(s => !s)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 14px", cursor: "pointer" }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>Day</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.orange, fontFamily: "'JetBrains Mono',monospace" }}>{currentDay}</span>
            <span style={{ fontSize: 10, color: C.textMuted }}>/ 112</span>
          </div>
        </div>

        {/* Day slider */}
        {showDaySlider && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "10px 14px", background: "#0a0a10", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>Set current day:</span>
            <input type="range" min={1} max={112} value={currentDay} onChange={e => setCurrentDay(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.orange, minWidth: 28, textAlign: "right", fontWeight: 700 }}>{currentDay}</span>
            <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>W{currentWeek} · {dowLabel}</span>
          </div>
        )}

        {/* Progress strip */}
        <div style={{ height: 2, background: C.border, overflow: "hidden", marginBottom: 0 }}>
          <div style={{ height: "100%", width: `${overall}%`, background: `linear-gradient(90deg,${C.orange},${C.yellow})`, transition: "width 0.5s" }} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", overflowX: "auto", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
              style={{ padding: "11px 18px", fontSize: 13, fontWeight: 600, background: "transparent", border: "none", color: activeTab === t.id ? C.orange : C.textMuted, borderBottom: `2px solid ${activeTab === t.id ? C.orange : "transparent"}`, transition: "all 0.2s", whiteSpace: "nowrap", letterSpacing: "0.2px" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px", maxWidth: 680, margin: "0 auto" }}>
        {!loaded ? (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted, fontSize: 14 }}>Loading your progress...</div>
        ) : (
          <>
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "today" && <TodayTab />}
            {activeTab === "dsa" && <DSATab />}
            {activeTab === "project" && <ProjectTab />}
            {activeTab === "revision" && <RevisionTab />}
          </>
        )}
      </div>
    </div>
  );
}
