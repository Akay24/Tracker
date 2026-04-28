import { useMemo, useRef } from "react";

import { Card } from "../ui/Card";
import { Heatmap } from "../ui/Heatmap";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";
import { RadialProgress } from "../ui/RadialProgress";

import { PROJECT_SECTIONS } from "../../data/projectCatalog";
import { REVISION_SECTIONS } from "../../data/revisionCatalog";
import {
  buildHeatmapDays,
  computeMistakeDistribution,
  computeReadiness,
  computeStreak,
  computeWeakPatterns,
} from "../../utils/analytics";
import { toDateKey } from "../../utils/date";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

const totalProjectItems = PROJECT_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
const totalRevisionItems = REVISION_SECTIONS.reduce(
  (s, sec) => s + sec.subsections.reduce((ss, sub) => ss + sub.items.length, 0),
  0,
);

const pct = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

const computeSystemDesignPct = (systemsById) => {
  const systems = Object.values(systemsById || {});
  const sections = systems.flatMap((s) => Object.values(s.sections || {}));
  const total = sections.length;
  const avg = total ? sections.reduce((sum, sec) => sum + Number(sec.confidence || 0), 0) / total : 0;
  return Math.round((avg / 5) * 100);
};

export const DashboardTab = ({ currentDay, currentWeek, dowLabel }) => {
  const problemsById = usePrepStore((s) => s.dsa.problemsById);
  const projectChecked = usePrepStore((s) => s.project.itemsChecked);
  const revisionChecked = usePrepStore((s) => s.revision.checked);
  const systemsById = usePrepStore((s) => s.systemDesign.systemsById);
  const activityByDate = usePrepStore((s) => s.activity.byDate);
  const actions = usePrepStore(selectActions);

  const fileInputRef = useRef(null);

  const dsa = useMemo(() => computeReadiness(problemsById), [problemsById]);

  const projectDone = useMemo(
    () => Object.values(projectChecked || {}).filter(Boolean).length,
    [projectChecked],
  );

  const revisionDone = useMemo(
    () => Object.values(revisionChecked || {}).filter(Boolean).length,
    [revisionChecked],
  );

  const systemDesignPct = useMemo(() => computeSystemDesignPct(systemsById), [systemsById]);

  const streak = useMemo(() => computeStreak(activityByDate), [activityByDate]);

  const heat = useMemo(
    () => buildHeatmapDays({ activityByDate, days: 84, metric: "attempts" }),
    [activityByDate],
  );

  const mistakeDist = useMemo(() => computeMistakeDistribution(problemsById), [problemsById]);
  const weakPatterns = useMemo(() => computeWeakPatterns(problemsById), [problemsById]);

  const projectPct = useMemo(() => pct(projectDone, totalProjectItems), [projectDone]);
  const revisionPct = useMemo(() => pct(revisionDone, totalRevisionItems), [revisionDone]);

  const overallPct = useMemo(() => {
    // Lightweight composite: DSA + System Design + Project + Revision
    const v = Math.round((dsa.readinessPct + systemDesignPct + projectPct + revisionPct) / 4);
    return Math.max(0, Math.min(100, v));
  }, [dsa.readinessPct, systemDesignPct, projectPct, revisionPct]);

  const exportJson = () => {
    const state = usePrepStore.getState();
    const { actions: _actions, ...persisted } = state;
    const payload = JSON.stringify(
      {
        version: persisted.schemaVersion || 1,
        exportedAt: new Date().toISOString(),
        state: persisted,
      },
      null,
      2,
    );

    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sde-prep-engine_${toDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPickImport = () => fileInputRef.current?.click();

  const onImportFile = async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const nextState = parsed?.state || parsed;
    if (!nextState || typeof nextState !== "object") return;
    actions.replacePersistedState(nextState);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Hero */}
      <Card
        glow={C.orange}
        style={{ background: `linear-gradient(135deg,${rgba(C.orange, 0.16)},${C.card})` }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>
              OVERALL READINESS
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-2px",
                fontFamily: "'JetBrains Mono',monospace",
                color: C.orange,
              }}
            >
              {overallPct}
              <span style={{ fontSize: 20, color: C.textMuted }}>%</span>
            </div>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>
              Day {currentDay} of 112 · Week {currentWeek} of 16 · {dowLabel}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <Pill color={C.cyan}>{streak} day streak</Pill>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Keep it non-zero daily.</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            height: 8,
            background: rgba(C.orange, 0.12),
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${overallPct}%`,
              background: `linear-gradient(90deg,${C.orange},${C.cyan})`,
              borderRadius: 999,
              transition: "width 0.5s",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button
            onClick={exportJson}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 12px",
              color: C.text,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Export JSON
          </button>
          <button
            onClick={onPickImport}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 12px",
              color: C.text,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              onImportFile(f).catch(() => {});
              e.target.value = "";
            }}
          />
        </div>
      </Card>

      {/* Module readiness */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <Card>
          <RadialProgress value={dsa.readinessPct} color={C.cyan} label="DSA" sublabel={`${dsa.total} problems`} />
        </Card>
        <Card>
          <RadialProgress value={systemDesignPct} color={C.yellow} label="System Design" sublabel="Section confidence" />
        </Card>
        <Card>
          <RadialProgress value={projectPct} color={C.green} label="Project" sublabel={`${projectDone}/${totalProjectItems}`} />
        </Card>
        <Card>
          <RadialProgress value={revisionPct} color={C.orange} label="Revision" sublabel={`${revisionDone}/${totalRevisionItems}`} />
        </Card>
      </div>

      {/* Heatmap + Mistakes */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
        <Card>
          <Label>Activity Heatmap (Attempts)</Label>
          <Heatmap days={heat} color={C.orange} label="Last 12 weeks" />
          <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted }}>
            Tip: log attempts even for partial solves.
          </div>
        </Card>

        <Card>
          <Label>Mistake Distribution</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(mistakeDist).map(([type, count]) => {
              const max = Math.max(1, ...Object.values(mistakeDist));
              const w = Math.round((count / max) * 100);
              return (
                <div key={type}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 11, color: C.textSec }}>{type}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                      {count}
                    </div>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${w}%`,
                        background: `linear-gradient(90deg,${rgba(C.orange, 0.7)},${rgba(C.cyan, 0.7)})`,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Weak patterns */}
      <Card>
        <Label>Weak Pattern Detection</Label>
        {weakPatterns.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textMuted }}>Not enough data yet — log attempts to unlock analytics.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {weakPatterns.map((w) => (
              <div
                key={w.pattern}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{w.pattern}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                    {w.problemCount} problems · {w.mistakes} mistakes logged
                  </div>
                </div>
                <div style={{ minWidth: 180 }}>
                  <ProgressBar
                    done={Math.round(w.avgConfidence * 10)}
                    total={50}
                    color={C.cyan}
                    height={4}
                    gradient={`linear-gradient(90deg,${C.orange},${C.cyan})`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
