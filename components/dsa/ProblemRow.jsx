import { useMemo, useState } from "react";

import { AttemptPanel } from "./AttemptPanel";
import { Collapsible } from "../ui/Collapsible";
import { Pill } from "../ui/Pill";

import { usePrepStore } from "../../store/usePrepStore";
import { isDue, toDateKey } from "../../utils/date";
import { C, CONFIDENCE, confidenceColor } from "../../utils/theme";

export const ProblemRow = ({ problemId }) => {
  const problem = usePrepStore((s) => s.dsa.problemsById[problemId]);
  const interviewMode = usePrepStore((s) => s.ui.interviewMode);
  const [open, setOpen] = useState(false);

  const due = useMemo(() => {
    const next = problem?.revisitSchedule?.nextReviewDate;
    return isDue(next, toDateKey());
  }, [problem?.revisitSchedule?.nextReviewDate]);

  const difficultyColor = useMemo(() => {
    const d = problem?.difficulty;
    if (d === "Easy") return C.green;
    if (d === "Medium") return C.yellow;
    if (d === "Hard") return C.orange;
    return C.textMuted;
  }, [problem?.difficulty]);

  if (!problem) return null;

  const confCol = confidenceColor(problem.confidence || 0);
  const confLabel = CONFIDENCE.label[problem.confidence || 0];

  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        background: open ? C.surface2 : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {problem.name}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: difficultyColor, fontFamily: "'JetBrains Mono',monospace" }}>
              {problem.difficulty}
            </span>
            {!interviewMode && (
              <span style={{ fontSize: 10, color: C.textMuted }}>{problem.pattern}</span>
            )}
            {due && <Pill color={C.orange}>Due</Pill>}
            {problem.lastAttempted && (
              <span style={{ fontSize: 10, color: C.textMuted }}>
                Last: {problem.lastAttempted}
              </span>
            )}
            {problem.revisitSchedule?.nextReviewDate && (
              <span style={{ fontSize: 10, color: C.textMuted }}>
                Next: {problem.revisitSchedule.nextReviewDate}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Pill color={confCol}>
            {problem.confidence}/5 · {confLabel}
          </Pill>
          <button
            onClick={() => setOpen((s) => !s)}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 10px",
              color: C.textMuted,
              fontSize: 12,
              fontWeight: 900,
            }}
            title={open ? "Collapse" : "Expand"}
          >
            {open ? "–" : "+"}
          </button>
        </div>
      </div>

      <Collapsible open={open}>
        <AttemptPanel problemId={problemId} compact={false} onLogged={() => setOpen(false)} />
      </Collapsible>
    </div>
  );
};
