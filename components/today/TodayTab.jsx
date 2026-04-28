import { useMemo } from "react";

import { DAY_SCHEDULE, PROTOCOL, SD_FRAMEWORK } from "../../data/daySchedule";
import { computeDueReviews } from "../../utils/analytics";
import { C } from "../../utils/theme";
import { usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";

import { ProblemRow } from "../dsa/ProblemRow";

const uniq = (arr) => Array.from(new Set(arr));

export const TodayTab = ({ currentDay, currentWeek, dowLabel }) => {
  const problemsById = usePrepStore((s) => s.dsa.problemsById);

  const day = DAY_SCHEDULE[Math.max(0, Math.min(DAY_SCHEDULE.length - 1, currentDay - 1))];

  const dueIds = useMemo(() => computeDueReviews(problemsById), [problemsById]);

  const lowIds = useMemo(() => {
    const ps = Object.values(problemsById || {});
    return ps
      .filter((p) => (p.confidence ?? 0) <= 1)
      .sort(
        (a, b) =>
          (a.confidence ?? 0) - (b.confidence ?? 0) ||
          String(a.lastAttempted || "").localeCompare(String(b.lastAttempted || "")),
      )
      .map((p) => p.id);
  }, [problemsById]);

  const focusIds = useMemo(() => {
    return uniq([...dueIds, ...lowIds]).slice(0, 8);
  }, [dueIds, lowIds]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.orange}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>Today’s Execution Plan</Label>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>
              Day {currentDay} · Week {currentWeek} · {dowLabel}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color={C.orange}>{dueIds.length} reviews due</Pill>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Keep the loop tight.</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 14 }}>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: C.surface }}>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "1.5px", fontWeight: 900 }}>
              DSA
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginTop: 6 }}>{day?.dsa || "—"}</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: C.surface }}>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "1.5px", fontWeight: 900 }}>
              PROJECT
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginTop: 6 }}>{day?.proj || "—"}</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: C.surface }}>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "1.5px", fontWeight: 900 }}>
              SYSTEM DESIGN
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginTop: 6 }}>{day?.design || "—"}</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: C.surface }}>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "1.5px", fontWeight: 900 }}>
              REVISION
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginTop: 6 }}>{day?.rev || "—"}</div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
        <Card>
          <Label>Today’s Focus (Due + Low Confidence)</Label>
          {focusIds.length === 0 ? (
            <div style={{ fontSize: 12, color: C.textMuted }}>
              No focus items yet — log attempts in the DSA tab to generate SR reviews.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {focusIds.map((id) => (
                <ProblemRow key={id} problemId={id} />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <Label>DSA Protocol</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {PROTOCOL.map((p) => (
              <div
                key={p}
                style={{
                  padding: "9px 10px",
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  color: C.text,
                  fontSize: 12,
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <Label>System Design Framework</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginTop: 10 }}>
          {SD_FRAMEWORK.map((s) => (
            <div
              key={s}
              style={{
                padding: "9px 10px",
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.text,
                fontSize: 12,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
