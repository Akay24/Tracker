import { useMemo, useState } from "react";

import { PROJECT_READINESS_FIELDS, PROJECT_NOTES_FIELDS, PROJECT_SECTIONS } from "../../data/projectCatalog";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const totalItems = PROJECT_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);

const STORY_PROMPTS = [
  { q: "What's the business problem you solved?", hint: "Users needed reliable short URLs with analytics..." },
  { q: "Walk me through the architecture.", hint: "Node.js → Postgres + Redis → async analytics worker → EC2..." },
  { q: "What's the biggest bottleneck at 10x scale?", hint: "DB write lock on URL creation. Fix: Redis atomic INCR + batch DB writes..." },
  { q: "How does your rate limiter work?", hint: "Redis token bucket: EVALSHA Lua script for atomic check+decrement. TTL on key per window..." },
  { q: "What would you do differently?", hint: "Use event-driven architecture for analytics from day 1 vs bolting on later..." },
];

export const ProjectTab = () => {
  const itemsChecked = usePrepStore((s) => s.project.itemsChecked);
  const readiness    = usePrepStore((s) => s.project.readiness);
  const notes        = usePrepStore((s) => s.project.notes);
  const actions      = usePrepStore(selectActions);

  const [open, setOpen] = useState({});
  const [activeNote, setActiveNote] = useState(PROJECT_NOTES_FIELDS[0].key);
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const done = useMemo(() => Object.values(itemsChecked || {}).filter(Boolean).length, [itemsChecked]);
  const pct  = useMemo(() => (totalItems ? Math.round((done / totalItems) * 100) : 0), [done]);

  const readinessAvg = useMemo(() => {
    const vals = PROJECT_READINESS_FIELDS.map((f) => Number(readiness?.[f.key] || 0));
    return vals.length ? Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10 : 0;
  }, [readiness]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.green}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>Project — Production-Grade URL Shortener</Label>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
              Build it live. Deploy it. Own every decision under pressure.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color={C.green}>{done}/{totalItems} · {pct}%</Pill>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Story readiness: {readinessAvg}/5</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar done={pct} total={100} color={C.green} gradient={`linear-gradient(90deg,${C.green},${C.cyan})`} />
        </div>
      </Card>

      {/* Story Readiness */}
      <Card>
        <Label>Story Readiness (0–5 each)</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          {PROJECT_READINESS_FIELDS.map((f) => (
            <div key={f.key} style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{f.label}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3, marginBottom: 10, lineHeight: 1.5 }}>{f.hint}</div>
              <ConfidencePicker value={readiness?.[f.key] || 0} onChange={(v) => actions.setProjectReadiness(f.key, v)} compact />
            </div>
          ))}
        </div>
      </Card>

      {/* Interview Prompts */}
      <Card>
        <Label>Interview Story Prompts — Practice These Out Loud</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {STORY_PROMPTS.map((p, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: rgba(C.green, 0.03) }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Q: {p.q}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>💡 {p.hint}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deep-Dive Notes — tabbed */}
      <Card>
        <Label>Deep-Dive Notes</Label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10, marginBottom: 12 }}>
          {PROJECT_NOTES_FIELDS.map((f) => (
            <button key={f.key} onClick={() => setActiveNote(f.key)}
              style={{
                padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                border: `1px solid ${activeNote === f.key ? rgba(C.green, 0.5) : C.border}`,
                background: activeNote === f.key ? rgba(C.green, 0.12) : "transparent",
                color: activeNote === f.key ? C.green : C.textMuted,
              }}>
              {f.label}
            </button>
          ))}
        </div>
        {PROJECT_NOTES_FIELDS.filter((f) => f.key === activeNote).map((f) => (
          <textarea key={f.key} value={notes?.[f.key] || ""} onChange={(e) => actions.setProjectNote(f.key, e.target.value)}
            rows={f.rows || 5} placeholder={f.placeholder}
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", color: C.text, fontSize: 12, resize: "vertical" }} />
        ))}
      </Card>

      {/* Build Checklist */}
      {PROJECT_SECTIONS.map((sec) => {
        const key = `sec:${sec.id}`;
        const secDone = sec.items.filter((it) => itemsChecked?.[it.id]).length;
        const secPct = sec.items.length ? Math.round((secDone / sec.items.length) * 100) : 0;
        return (
          <Card key={sec.id} glow={C.green}>
            <div onClick={() => toggle(key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{sec.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{secDone}/{sec.items.length} complete</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill color={C.green}>{secPct}%</Pill>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{open[key] ? "▲" : "▼"}</span>
              </div>
            </div>
            {!open[key] && (
              <div style={{ marginTop: 12 }}>
                <ProgressBar done={secPct} total={100} color={C.green} height={4} gradient={`linear-gradient(90deg,${C.green},${C.cyan})`} />
              </div>
            )}
            <Collapsible open={!!open[key]}>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {sec.items.map((it) => {
                  const checked = !!itemsChecked?.[it.id];
                  return (
                    <button key={it.id} onClick={() => actions.toggleProjectItem(it.id)}
                      style={{ textAlign: "left", padding: "10px 12px", borderRadius: 10, border: `1px solid ${checked ? rgba(C.green, 0.35) : C.border}`, background: checked ? rgba(C.green, 0.06) : C.surface, color: checked ? C.green : C.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      <span style={{ marginRight: 10, fontFamily: "'JetBrains Mono',monospace" }}>{checked ? "[✓]" : "[ ]"}</span>
                      {it.label}
                    </button>
                  );
                })}
              </div>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
