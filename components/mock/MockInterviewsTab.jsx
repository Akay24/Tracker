import { useEffect, useMemo, useState } from "react";

import { C, rgba } from "../../utils/theme";
import { newId } from "../../utils/id";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";

const TYPES = [
  { key: "dsa", label: "DSA" },
  { key: "system_design", label: "System Design" },
  { key: "full", label: "Full Loop" },
];

const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const MockInterviewsTab = () => {
  const sessions = usePrepStore((s) => s.mocks.sessions);
  const actions = usePrepStore(selectActions);

  const [type, setType] = useState("dsa");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const [durationMin, setDurationMin] = useState(45);
  const [notes, setNotes] = useState("");

  const [rubric, setRubric] = useState({
    problemSolving: 0,
    communication: 0,
    correctness: 0,
    speed: 0,
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

  const add = () => {
    const session = {
      id: newId("mock"),
      type,
      durationMin: Number(durationMin) || 0,
      elapsedSec: elapsed,
      rubric,
      overall,
      notes,
      createdAt: new Date().toISOString(),
    };
    actions.addMockSession(session);
    setNotes("");
    setRubric({ problemSolving: 0, communication: 0, correctness: 0, speed: 0 });
    setElapsed(0);
    setRunning(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.purple}>
        <Label>Mock Interviews — Timer + Rubric</Label>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
          Log mock sessions to build repeatable confidence under pressure.
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>
              TIMER
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>{fmtTime(elapsed)}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setRunning((r) => !r)}
              style={{
                background: running ? "transparent" : `linear-gradient(90deg,${C.orange},${C.cyan})`,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                color: running ? C.text : "#000",
                fontSize: 12,
                fontWeight: 900,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {running ? "PAUSE" : "START"}
            </button>
            <button
              onClick={() => {
                setElapsed(0);
                setRunning(false);
              }}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                color: C.text,
                fontSize: 12,
                fontWeight: 900,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              RESET
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 14 }}>
          <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>
              TYPE
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {TYPES.map((t) => {
                const on = type === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setType(t.key)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 999,
                      border: `1px solid ${on ? rgba(C.purple, 0.35) : C.border}`,
                      background: on ? rgba(C.purple, 0.10) : "transparent",
                      color: on ? C.purple : C.textSec,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>
              DURATION (MIN)
            </div>
            <input
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              type="number"
              min={0}
              style={{
                marginTop: 10,
                width: "100%",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                color: C.text,
                fontSize: 12,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>
            RUBRIC (0–5)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 10 }}>
            {[
              { key: "problemSolving", label: "Problem Solving" },
              { key: "communication", label: "Communication" },
              { key: "correctness", label: "Correctness" },
              { key: "speed", label: "Speed" },
            ].map((f) => (
              <div key={f.key} style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{f.label}</div>
                <div style={{ marginTop: 10 }}>
                  <ConfidencePicker
                    value={rubric[f.key] || 0}
                    onChange={(v) => setRubric((r) => ({ ...r, [f.key]: v }))}
                    compact
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: C.textSec }}>
              Overall: <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{overall}</span>/5
            </div>
            <button
              onClick={add}
              style={{
                background: `linear-gradient(90deg,${C.purple},${C.cyan})`,
                border: "none",
                borderRadius: 10,
                padding: "10px 12px",
                color: "#000",
                fontSize: 12,
                fontWeight: 900,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              SAVE SESSION
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes: what broke, what improved, what to drill next..."
              style={{
                width: "100%",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                color: C.text,
                fontSize: 12,
                resize: "vertical",
              }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <Label>Recent Sessions</Label>
        {sessions.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textMuted }}>No mocks yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {sessions.slice(0, 10).map((s) => (
              <div
                key={s.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{s.type}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                    {new Date(s.createdAt).toLocaleString()} · elapsed {fmtTime(s.elapsedSec || 0)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => actions.deleteMockSession(s.id)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "7px 10px",
                      color: C.textMuted,
                      fontSize: 11,
                      fontWeight: 900,
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                    title="Delete session"
                  >
                    DELETE
                  </button>
                  <Pill color={C.purple}>{s.overall}/5</Pill>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
