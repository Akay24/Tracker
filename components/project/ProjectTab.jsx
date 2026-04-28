import { useMemo, useState } from "react";

import { PROJECT_READINESS_FIELDS, PROJECT_SECTIONS } from "../../data/projectCatalog";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const totalItems = PROJECT_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);

export const ProjectTab = () => {
  const itemsChecked = usePrepStore((s) => s.project.itemsChecked);
  const readiness = usePrepStore((s) => s.project.readiness);
  const notes = usePrepStore((s) => s.project.notes);
  const actions = usePrepStore(selectActions);

  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const done = useMemo(() => Object.values(itemsChecked || {}).filter(Boolean).length, [itemsChecked]);
  const pct = useMemo(() => (totalItems ? Math.round((done / totalItems) * 100) : 0), [done]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.green}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>Project — Production-Grade TinyURL</Label>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
              The goal: a story you can defend under pressure.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color={C.green}>
              {done}/{totalItems} · {pct}%
            </Pill>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar
            done={pct}
            total={100}
            color={C.green}
            gradient={`linear-gradient(90deg,${C.green},${C.cyan})`}
          />
        </div>
      </Card>

      <Card>
        <Label>Story Readiness (0–5)</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 10 }}>
          {PROJECT_READINESS_FIELDS.map((f) => (
            <div key={f.key} style={{ padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{f.label}</div>
              <div style={{ marginTop: 10 }}>
                <ConfidencePicker
                  value={readiness?.[f.key] || 0}
                  onChange={(v) => actions.setProjectReadiness(f.key, v)}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {PROJECT_SECTIONS.map((sec) => {
        const key = `sec:${sec.id}`;
        const secDone = sec.items.filter((it) => itemsChecked?.[it.id]).length;
        const secPct = sec.items.length ? Math.round((secDone / sec.items.length) * 100) : 0;
        return (
          <Card key={sec.id} glow={C.green}>
            <div
              onClick={() => toggle(key)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{sec.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                  {secDone}/{sec.items.length} complete
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill color={C.green}>{secPct}%</Pill>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{open[key] ? "▲" : "▼"}</span>
              </div>
            </div>

            {!open[key] && (
              <div style={{ marginTop: 12 }}>
                <ProgressBar
                  done={secPct}
                  total={100}
                  color={C.green}
                  height={4}
                  gradient={`linear-gradient(90deg,${C.green},${C.cyan})`}
                />
              </div>
            )}

            <Collapsible open={!!open[key]}>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {sec.items.map((it) => {
                  const checked = !!itemsChecked?.[it.id];
                  return (
                    <button
                      key={it.id}
                      onClick={() => actions.toggleProjectItem(it.id)}
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: `1px solid ${checked ? rgba(C.green, 0.35) : C.border}`,
                        background: checked ? rgba(C.green, 0.06) : C.surface,
                        color: checked ? C.green : C.text,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ marginRight: 10, fontFamily: "'JetBrains Mono',monospace" }}>
                        {checked ? "[x]" : "[ ]"}
                      </span>
                      {it.label}
                    </button>
                  );
                })}
              </div>
            </Collapsible>
          </Card>
        );
      })}

      <Card>
        <Label>Deep-Dive Notes</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 10 }}>
          <textarea
            value={notes?.latency_improvements || ""}
            onChange={(e) => actions.setProjectNote("latency_improvements", e.target.value)}
            rows={6}
            placeholder="Latency improvements: indexes, caching, batching..."
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
          <textarea
            value={notes?.scaling_readiness || ""}
            onChange={(e) => actions.setProjectNote("scaling_readiness", e.target.value)}
            rows={6}
            placeholder="Scaling readiness: sharding, queues, rate limits..."
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
          <textarea
            value={notes?.failure_scenarios || ""}
            onChange={(e) => actions.setProjectNote("failure_scenarios", e.target.value)}
            rows={6}
            placeholder="Failure scenarios: Redis down, DB failover, retry storms..."
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
      </Card>
    </div>
  );
};
