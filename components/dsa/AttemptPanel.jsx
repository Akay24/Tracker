import { useMemo, useState } from "react";

import { selectActions, usePrepStore } from "../../store/usePrepStore";
import { MISTAKE_TYPES } from "../../utils/analytics";
import { C, rgba } from "../../utils/theme";
import { ConfidencePicker } from "../ui/ConfidencePicker";

export const AttemptPanel = ({ problemId, compact = false, onLogged }) => {
  const problem = usePrepStore((s) => s.dsa.problemsById[problemId]);
  const actions = usePrepStore(selectActions);

  const [confidence, setConfidence] = useState(problem?.confidence ?? 0);
  const [mistakes, setMistakes] = useState(() => new Set());
  const [note, setNote] = useState("");

  const difficultyColor = useMemo(() => {
    const d = problem?.difficulty;
    if (d === "Easy") return C.green;
    if (d === "Medium") return C.yellow;
    if (d === "Hard") return C.orange;
    return C.textMuted;
  }, [problem?.difficulty]);

  if (!problem) return null;

  const toggleMistake = (t) => {
    setMistakes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const submit = () => {
    actions.logProblemAttempt(problemId, {
      confidence,
      mistakeTypes: Array.from(mistakes),
      note,
    });
    setMistakes(new Set());
    setNote("");
    onLogged?.();
  };

  return (
    <div
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>{problem.name}</div>
          <div style={{ fontSize: 10, color: difficultyColor, fontFamily: "'JetBrains Mono',monospace", marginTop: 3 }}>
            {problem.difficulty} · {compact ? "" : problem.pattern}
          </div>
        </div>

        <button
          onClick={submit}
          style={{
            background: `linear-gradient(90deg,${C.orange},${C.cyan})`,
            border: "none",
            borderRadius: 10,
            padding: "9px 12px",
            color: "#000",
            fontWeight: 900,
            fontSize: 11,
            letterSpacing: "0.6px",
            fontFamily: "'JetBrains Mono',monospace",
            whiteSpace: "nowrap",
          }}
        >
          LOG ATTEMPT
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6, letterSpacing: "1.4px", fontWeight: 900 }}>
            CONFIDENCE (0–5)
          </div>
          <ConfidencePicker value={confidence} onChange={setConfidence} compact={compact} />
        </div>

        <div style={{ fontSize: 10, color: C.textMuted, textAlign: "right", lineHeight: 1.4 }}>
          Updates spaced repetition schedule
          <br />
          based on confidence + mistakes.
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6, letterSpacing: "1.4px", fontWeight: 900 }}>
          MISTAKES (tap to toggle)
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {MISTAKE_TYPES.map((t) => {
            const on = mistakes.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleMistake(t)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${on ? rgba(C.orange, 0.45) : C.border}`,
                  background: on ? rgba(C.orange, 0.14) : "transparent",
                  color: on ? C.orange : C.textSec,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6, letterSpacing: "1.4px", fontWeight: 900 }}>
          NOTES (optional)
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={compact ? 2 : 3}
          placeholder="What went wrong? What will you do differently next time?"
          style={{
            width: "100%",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            color: C.text,
            fontSize: 12,
            resize: "vertical",
          }}
        />
      </div>
    </div>
  );
};
