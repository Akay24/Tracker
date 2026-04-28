import { useMemo } from "react";

import { DAY_SCHEDULE, PROTOCOL, SD_FRAMEWORK } from "../../data/daySchedule";
import { REVISION_SECTIONS } from "../../data/revisionCatalog";
import { computeDueReviews } from "../../utils/analytics";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProblemRow } from "../dsa/ProblemRow";

const uniq = (arr) => Array.from(new Set(arr));

const WEEKLY_FIELDS = [
  { f: "dsaSolved",          label: "DSA problems solved this week",       ph: "e.g. 6 — be honest. Target: 6/week" },
  { f: "projectMilestone",   label: "Project milestone shipped",            ph: "What did you ship? Be specific." },
  { f: "systemDesign",       label: "System design practiced",              ph: "e.g. WhatsApp — full HLD in 45m" },
  { f: "weakArea",           label: "Biggest weak area this week",          ph: "e.g. Edge cases in tree problems" },
  { f: "improvement",        label: "1 thing to fix next week",             ph: "e.g. Practice explaining trade-offs out loud" },
];

const DAILY_TIME_BLOCKS = [
  { emoji: "🧠", key: "dsa",    label: "DSA",           time: "~2h",  color: C.cyan,   clickTab: null },
  { emoji: "🛠️", key: "proj",   label: "Project",       time: "2–3h", color: C.green,  clickTab: null },
  { emoji: "🏗️", key: "design", label: "System Design",  time: "40m",  color: C.yellow, clickTab: "system" },
  { emoji: "📖", key: "rev",    label: "Revision ↗",    time: "30m",  color: C.orange, clickTab: "revision" },
];

const CODING_PROTOCOL = [
  { step: "01", title: "Understand", detail: "Restate the problem in your own words. Ask about constraints, edge cases, input size." },
  { step: "02", title: "Brute Force", detail: "State the naive approach + TC/SC. Don't code yet. Show you can think before typing." },
  { step: "03", title: "Optimize", detail: "Identify the bottleneck. What pattern applies? Hash map? Sliding window? Heap?" },
  { step: "04", title: "Code", detail: "Write clean, readable code. Name variables properly. No magic numbers." },
  { step: "05", title: "Dry Run", detail: "Trace through a normal case + at least one edge case before claiming done." },
  { step: "06", title: "Complexity", detail: "State TC and SC clearly. Justify both. Mention any trade-offs if alternatives exist." },
];

const SD_STEPS = [
  { step: "01", label: "Functional requirements",         hint: "What must the system do? Get to 3–5 core features." },
  { step: "02", label: "Non-functional requirements",     hint: "Scale, latency SLA, consistency, availability." },
  { step: "03", label: "Capacity estimation",             hint: "DAU, QPS read/write, storage/year. Back-of-envelope." },
  { step: "04", label: "API design",                     hint: "REST endpoints, request/response shapes, pagination." },
  { step: "05", label: "Data model + indexes",           hint: "Schema, primary keys, sharding key, critical indexes." },
  { step: "06", label: "High-level architecture",        hint: "Draw the boxes: client → LB → service → DB/cache." },
  { step: "07", label: "Bottlenecks",                    hint: "Hot partitions, N+1 queries, single points of failure." },
  { step: "08", label: "Caching / queues / sharding",   hint: "Cache-aside vs write-through, async fan-out, shard key." },
  { step: "09", label: "Trade-offs",                     hint: "CAP theorem, consistency vs availability, cost vs perf." },
  { step: "10", label: "Failure scenarios",              hint: "Cache down → fallback. DB failover → replica. Queue lag." },
];

export const TodayTab = ({ currentDay, currentWeek, dowLabel }) => {
  const problemsById  = usePrepStore((s) => s.dsa.problemsById);
  const weeklyEntries = usePrepStore((s) => s.weeklyEntries);
  const actions       = usePrepStore(selectActions);

  // Jump to revision tab and pre-expand today's subsection
  const jumpToRevision = (revLabel) => {
    actions.setActiveTab("revision");
    // Find matching subsection across all sections and expand it
    for (const sec of REVISION_SECTIONS) {
      sec.subsections.forEach((sub, subIdx) => {
        if (sub.title === revLabel) {
          const key = `sub|${sec.id}|${subIdx}`;
          actions.toggleRevisionExpanded(key);
        }
      });
    }
  };

  const day = DAY_SCHEDULE[Math.max(0, Math.min(DAY_SCHEDULE.length - 1, currentDay - 1))];
  const dueIds = useMemo(() => computeDueReviews(problemsById), [problemsById]);

  const lowIds = useMemo(() => {
    return Object.values(problemsById || {})
      .filter((p) => (p.confidence ?? 0) <= 1)
      .sort((a, b) => (a.confidence ?? 0) - (b.confidence ?? 0) || String(a.lastAttempted || "").localeCompare(String(b.lastAttempted || "")))
      .map((p) => p.id);
  }, [problemsById]);

  const focusIds = useMemo(() => uniq([...dueIds, ...lowIds]).slice(0, 8), [dueIds, lowIds]);

  const entry  = weeklyEntries[currentWeek] || {};
  const update = (field, val) => actions.setWeeklyEntry(currentWeek, field, val);

  const dowIdx   = (currentDay - 1) % 7;
  const dayLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dowIdx];
  const isSat    = dayLabel === "Sat";
  const isSun    = dayLabel === "Sun";
  const dayColor = isSun ? C.cyan : isSat ? C.yellow : C.orange;
  const dayType  = isSun ? "Weekly Reset" : isSat ? "Review Day" : "Deep Work";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Day header */}
      <Card glow={dayColor} style={{ background: `linear-gradient(135deg,${rgba(dayColor, 0.12)},${C.card})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: dayColor, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>TODAY'S EXECUTION PLAN</div>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-1.5px", fontFamily: "'JetBrains Mono',monospace" }}>Day {currentDay}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Week {currentWeek} of 16 · {dayLabel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color={dayColor}>{dayType}</Pill>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{dueIds.length} reviews due today</div>
          </div>
        </div>
        <div style={{ height: 4, background: rgba(dayColor, 0.15), borderRadius: 999, overflow: "hidden", marginTop: 14 }}>
          <div style={{ height: "100%", width: `${Math.round((currentDay / 112) * 100)}%`, background: dayColor, borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 5 }}>{Math.round((currentDay / 112) * 100)}% of 112-day journey</div>
      </Card>

      {/* Time blocks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {DAILY_TIME_BLOCKS.map(({ emoji, key, label, time, color, clickTab }) => {
          const isRev = key === "rev";
          const content = day?.[key] || "—";
          return (
            <div key={key}
              onClick={isRev && content !== "—" ? () => jumpToRevision(content) : undefined}
              style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${rgba(color, 0.25)}`, background: rgba(color, 0.04), cursor: isRev && content !== "—" ? "pointer" : "default", transition: "background 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "1.4px", color }}>{label.toUpperCase()}</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.textMuted }}>{time}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: content === "—" ? C.textMuted : C.text, lineHeight: 1.5 }}>
                {content}
              </div>
              {isRev && content !== "—" && (
                <div style={{ fontSize: 10, color, marginTop: 6, fontWeight: 700 }}>Click → jump to Revision tab ↗</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Due reviews + low confidence */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        <Card>
          <Label>Spaced Repetition Focus ({focusIds.length} items)</Label>
          {focusIds.length === 0 ? (
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>
              No items yet — log attempts in the DSA tab to activate spaced repetition.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {focusIds.map((id) => <ProblemRow key={id} problemId={id} />)}
            </div>
          )}
        </Card>

        {/* Coding Protocol */}
        <Card>
          <Label>Coding Interview Protocol</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {CODING_PROTOCOL.map(({ step, title, detail }) => (
              <div key={step} style={{ padding: "8px 10px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.orange, fontWeight: 900 }}>{step}.</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{title}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, paddingLeft: 22 }}>{detail}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Design Framework */}
      <Card>
        <Label>System Design 10-Step Framework</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 10 }}>
          {SD_STEPS.map(({ step, label, hint }) => (
            <div key={step} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.yellow, fontWeight: 900, minWidth: 20 }}>{step}.</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{label}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, paddingLeft: 28 }}>{hint}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly check-in */}
      <Card>
        <Label>Weekly Dashboard — W{currentWeek} Check-in</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {WEEKLY_FIELDS.map(({ f, label, ph }) => (
            <div key={f}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5 }}>{label}</div>
              <input value={entry[f] || ""} onChange={(e) => update(f, e.target.value)} placeholder={ph}
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 12 }} />
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};
