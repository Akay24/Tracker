import { useMemo, useState } from "react";

import { DSA_CATALOG } from "../../data/dsaCatalog";
import { computeReadiness, computeDueReviews } from "../../utils/analytics";
import { C } from "../../utils/theme";
import { usePrepStore, selectActions } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

import { ProblemRow } from "./ProblemRow";

const pct = (n) => Math.max(0, Math.min(100, Math.round(n || 0)));

const collectIds = (node) => {
  const ids = [];
  for (const sub of node.subtopics) {
    for (const pat of sub.patterns) {
      for (const p of pat.problems) ids.push(p.id);
    }
  }
  return ids;
};

export const DSATab = () => {
  const problemsById = usePrepStore((s) => s.dsa.problemsById);
  const interviewMode = usePrepStore((s) => s.ui.interviewMode);
  const actions = usePrepStore(selectActions);

  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const readiness = useMemo(() => computeReadiness(problemsById), [problemsById]);
  const dueIds = useMemo(() => computeDueReviews(problemsById), [problemsById]);
  const dueSet = useMemo(() => new Set(dueIds), [dueIds]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.cyan}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>Atomic DSA Engine — Topic → Subtopic → Pattern → Problem</Label>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
              Confidence is the source of truth. Log attempts + mistakes to power spaced repetition.
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <Pill color={C.cyan}>{readiness.readinessPct}% readiness</Pill>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{dueIds.length} reviews due</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <ProgressBar
            done={readiness.readinessPct}
            total={100}
            color={C.cyan}
            gradient={`linear-gradient(90deg,${C.orange},${C.cyan})`}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button
            onClick={actions.toggleInterviewMode}
            style={{
              background: interviewMode ? `linear-gradient(90deg,${C.orange},${C.cyan})` : "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 12px",
              color: interviewMode ? "#000" : C.text,
              fontSize: 12,
              fontWeight: 900,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: "0.4px",
            }}
            title="Interview Mode hides patterns"
          >
            {interviewMode ? "INTERVIEW MODE: ON" : "INTERVIEW MODE: OFF"}
          </button>
          <div style={{ fontSize: 11, color: C.textMuted, paddingTop: 10 }}>
            In interview mode, pattern hints are hidden.
          </div>
        </div>
      </Card>

      {DSA_CATALOG.map((topic) => {
        const topicKey = `topic:${topic.id}`;
        const topicIds = collectIds(topic);
        const doneSum = topicIds.reduce((s, id) => s + Number(problemsById[id]?.confidence || 0), 0);
        const avg = topicIds.length ? doneSum / topicIds.length : 0;
        const topicPct = pct((avg / 5) * 100);
        const dueCount = topicIds.filter((id) => dueSet.has(id)).length;

        return (
          <Card key={topic.id} glow={C.cyan}>
            <div
              onClick={() => toggle(topicKey)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{topic.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                  {topicIds.length} problems · {dueCount} due
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill color={C.cyan}>{topicPct}%</Pill>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{open[topicKey] ? "▲" : "▼"}</span>
              </div>
            </div>

            {!open[topicKey] && (
              <div style={{ marginTop: 12 }}>
                <ProgressBar
                  done={topicPct}
                  total={100}
                  color={C.cyan}
                  height={4}
                  gradient={`linear-gradient(90deg,${C.orange},${C.cyan})`}
                />
              </div>
            )}

            <Collapsible open={!!open[topicKey]}>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {topic.subtopics.map((sub) => (
                  <div key={sub.id}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: C.orange,
                        marginBottom: 10,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {sub.title}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {sub.patterns.map((pat) => {
                        const patKey = `pat:${topic.id}:${sub.id}:${pat.id}`;
                        const ids = pat.problems.map((p) => p.id);
                        const sum = ids.reduce((s, id) => s + Number(problemsById[id]?.confidence || 0), 0);
                        const avgC = ids.length ? sum / ids.length : 0;
                        const pPct = pct((avgC / 5) * 100);
                        const dueP = ids.filter((id) => dueSet.has(id)).length;

                        return (
                          <div key={patKey} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                            <div
                              onClick={() => toggle(patKey)}
                              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                            >
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{pat.title}</div>
                                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
                                  {ids.length} problems · {dueP} due
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Pill color={C.green}>{pPct}%</Pill>
                                <span style={{ color: C.textMuted, fontSize: 12 }}>{open[patKey] ? "▲" : "▼"}</span>
                              </div>
                            </div>

                            {!open[patKey] && (
                              <div style={{ marginTop: 10 }}>
                                <ProgressBar
                                  done={pPct}
                                  total={100}
                                  color={C.green}
                                  height={3}
                                  gradient={`linear-gradient(90deg,${C.green},${C.cyan})`}
                                />
                              </div>
                            )}

                            <Collapsible open={!!open[patKey]}>
                              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                                {pat.problems.map((p) => (
                                  <ProblemRow key={p.id} problemId={p.id} />
                                ))}
                              </div>
                            </Collapsible>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
