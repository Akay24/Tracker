import { useEffect, useMemo, useState } from "react";

import { C, rgba } from "../../utils/theme";
import { newId } from "../../utils/id";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const TYPES = [
  { key: "dsa", label: "DSA Only" },
  { key: "system_design", label: "System Design Only" },
  { key: "full", label: "Full Loop (DSA + SD + Behavioral)" },
];

const RUBRIC_FIELDS = [
  { key: "dsa_score",             label: "DSA Score",              hint: "Pattern recognition, code quality, edge cases" },
  { key: "system_design_score",   label: "System Design Score",    hint: "Requirements, HLD, bottlenecks, trade-offs" },
  { key: "communication_score",   label: "Communication Score",    hint: "Thinking aloud, structure, recovery from hints" },
  { key: "speed",                 label: "Speed",                  hint: "Stayed within time, didn't over-engineer" },
];

const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const WEAK_AREAS = [
  "Edge cases", "Complexity analysis", "Optimal pattern selection",
  "Capacity estimation", "Trade-off articulation", "Failure scenarios",
  "Communication under pressure", "Code cleanliness", "Testing approach",
];

export const MockInterviewsTab = () => {
  const sessions = usePrepStore((s) => s.mocks.sessions);
  const actions  = usePrepStore(selectActions);

  const [type, setType]           = useState("dsa");
  const [elapsed, setElapsed]     = useState(0);
  const [running, setRunning]     = useState(false);
  const [durationMin, setDurationMin] = useState(45);
  const [notes, setNotes]         = useState("");
  const [weakAreas, setWeakAreas] = useState(new Set());

  const [rubric, setRubric] = useState({
    dsa_score: 0, system_design_score: 0, communication_score: 0, speed: 0,
  });

  const overall = useMemo(() => {
    const vals = Object.values(rubric);
    const avg = vals.length ? vals.reduce((s, v) => s + Number(v || 0), 0) / vals.length : 0;
    return Math.round(avg * 10) / 10;
  }, [rubric]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const toggleWeak = (area) => setWeakAreas((prev) => {
    const next = new Set(prev);
    if (next.has(area)) next.delete(area); else next.add(area);
    return next;
  });

  const add = () => {
    actions.addMockSession({
      id: newId("mock"),
      type,
      durationMin: Number(durationMin) || 0,
      elapsedSec: elapsed,
      rubric,
      overall,
      weak_areas: Array.from(weakAreas),
      notes,
      createdAt: new Date().toISOString(),
    });
    setNotes(""); setWeakAreas(new Set());
    setRubric({ dsa_score: 0, system_design_score: 0, communication_score: 0, speed: 0 });
    setElapsed(0); setRunning(false);
  };

  const avgByField = useMemo(() => {
    if (!sessions.length) return null;
    const totals = {};
    for (const s of sessions) {
      for (const [k, v] of Object.entries(s.rubric || {})) {
        totals[k] = (totals[k] || 0) + Number(v || 0);
      }
    }
    return Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Math.round((v / sessions.length) * 10) / 10]));
  }, [sessions]);

  const weakAreaFreq = useMemo(() => {
    const freq = {};
    for (const s of sessions) {
      for (const a of s.weak_areas || []) freq[a] = (freq[a] || 0) + 1;
    }
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [sessions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.purple}>
        <Label>Mock Interviews — Timer + Rubric</Label>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
          Log sessions with DSA, System Design, and Communication scores. Track your weak areas over time.
        </div>
      </Card>

      {/* Timer */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>TIMER</div>
            <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: running ? C.orange : C.text }}>{fmtTime(elapsed)}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setRunning((r) => !r)} style={{ background: running ? "transparent" : `linear-gradient(90deg,${C.orange},${C.cyan})`, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", color: running ? C.text : "#000", fontSize: 12, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>
              {running ? "PAUSE" : "START"}
            </button>
            <button onClick={() => { setElapsed(0); setRunning(false); }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", color: C.text, fontSize: 12, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>
              RESET
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 14 }}>
          <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px", marginBottom: 10 }}>TYPE</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TYPES.map((t) => (
                <button key={t.key} onClick={() => setType(t.key)}
                  style={{ padding: "7px 10px", borderRadius: 999, border: `1px solid ${type === t.key ? rgba(C.purple, 0.4) : C.border}`, background: type === t.key ? rgba(C.purple, 0.12) : "transparent", color: type === t.key ? C.purple : C.textSec, fontSize: 11, fontWeight: 800 }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px", marginBottom: 10 }}>DURATION (MIN)</div>
            <input value={durationMin} onChange={(e) => setDurationMin(e.target.value)} type="number" min={0}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }} />
          </div>
        </div>

        {/* Rubric */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px", marginBottom: 10 }}>RUBRIC (0–5 each)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {RUBRIC_FIELDS.map((f) => (
              <div key={f.key} style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{f.label}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3, marginBottom: 10 }}>{f.hint}</div>
                <ConfidencePicker value={rubric[f.key] || 0} onChange={(v) => setRubric((r) => ({ ...r, [f.key]: v }))} compact />
              </div>
            ))}
          </div>
        </div>

        {/* Weak areas */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px", marginBottom: 10 }}>WEAK AREAS (SELECT ALL THAT APPLY)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {WEAK_AREAS.map((area) => (
              <button key={area} onClick={() => toggleWeak(area)}
                style={{ padding: "6px 10px", borderRadius: 999, border: `1px solid ${weakAreas.has(area) ? rgba(C.orange, 0.45) : C.border}`, background: weakAreas.has(area) ? rgba(C.orange, 0.14) : "transparent", color: weakAreas.has(area) ? C.orange : C.textSec, fontSize: 11, fontWeight: 700 }}>
                {area}
              </button>
            ))}
          </div>
        </div>

        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          placeholder="Notes: what broke, what improved, what to drill next..."
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", color: C.text, fontSize: 12, resize: "vertical", marginTop: 12 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div style={{ fontSize: 12, color: C.textSec }}>
            Overall: <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.purple }}>{overall}</span>/5
          </div>
          <button onClick={add} style={{ background: `linear-gradient(90deg,${C.purple},${C.cyan})`, border: "none", borderRadius: 10, padding: "10px 16px", color: "#000", fontSize: 12, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>
            SAVE SESSION
          </button>
        </div>
      </Card>

      {/* Analytics */}
      {sessions.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card>
            <Label>Avg Scores ({sessions.length} sessions)</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {RUBRIC_FIELDS.map((f) => (
                <div key={f.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 11, color: C.textSec }}>{f.label}</div>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: C.purple }}>{avgByField?.[f.key] ?? 0}/5</div>
                  </div>
                  <ProgressBar done={Math.round((avgByField?.[f.key] || 0) * 20)} total={100} color={C.purple} height={4} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Label>Top Weak Areas</Label>
            {weakAreaFreq.length === 0 ? (
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 10 }}>Log sessions to see patterns.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {weakAreaFreq.map(([area, count]) => (
                  <div key={area} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, color: C.text }}>{area}</div>
                    <Pill color={C.orange}>{count}×</Pill>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Session history */}
      <Card>
        <Label>Session History</Label>
        {sessions.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 10 }}>No mocks yet. Start your first session above.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {sessions.slice(0, 15).map((s) => (
              <div key={s.id} style={{ padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{TYPES.find((t) => t.key === s.type)?.label || s.type}</span>
                      <Pill color={C.purple}>{s.overall}/5</Pill>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                      {new Date(s.createdAt).toLocaleDateString()} · {fmtTime(s.elapsedSec || 0)}
                    </div>
                    {(s.weak_areas || []).length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                        {s.weak_areas.map((a) => (
                          <span key={a} style={{ fontSize: 10, color: C.orange, background: rgba(C.orange, 0.1), borderRadius: 4, padding: "2px 6px" }}>{a}</span>
                        ))}
                      </div>
                    )}
                    {s.notes && <div style={{ fontSize: 11, color: C.textSec, marginTop: 6, lineHeight: 1.5 }}>{s.notes}</div>}
                  </div>
                  <button onClick={() => actions.deleteMockSession(s.id)}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.textMuted, fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                    DEL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
