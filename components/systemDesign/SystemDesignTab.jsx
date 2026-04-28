import { useMemo, useState } from "react";

import { SYSTEMS, SYSTEM_DESIGN_SECTIONS } from "../../data/systemDesignCatalog";
import { C } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const pct = (avg0to5) => Math.max(0, Math.min(100, Math.round((avg0to5 / 5) * 100)));

export const SystemDesignTab = () => {
  const systemsById = usePrepStore((s) => s.systemDesign.systemsById);
  const actions = usePrepStore(selectActions);

  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const systems = useMemo(() => SYSTEMS.map((s) => systemsById?.[s.id]).filter(Boolean), [systemsById]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.yellow}>
        <Label>System Design — Confidence by Section</Label>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
          Track each system across the full interview framework. Use notes to capture diagrams, trade-offs,
          and failure scenarios.
        </div>
      </Card>

      {systems.map((sys) => {
        const key = `sys:${sys.id}`;
        const sections = Object.entries(sys.sections || {});
        const avg = sections.length
          ? sections.reduce((s, [, v]) => s + Number(v.confidence || 0), 0) / sections.length
          : 0;
        const p = pct(avg);

        return (
          <Card key={sys.id} glow={C.yellow}>
            <div
              onClick={() => toggle(key)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{sys.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                  {SYSTEM_DESIGN_SECTIONS.length} sections
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill color={C.yellow}>{p}%</Pill>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{open[key] ? "▲" : "▼"}</span>
              </div>
            </div>

            {!open[key] && (
              <div style={{ marginTop: 12 }}>
                <ProgressBar
                  done={p}
                  total={100}
                  color={C.yellow}
                  height={4}
                  gradient={`linear-gradient(90deg,${C.yellow},${C.cyan})`}
                />
              </div>
            )}

            <Collapsible open={!!open[key]}>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {SYSTEM_DESIGN_SECTIONS.map((sec) => {
                  const st = sys.sections?.[sec.key] || { confidence: 0, notes: "" };
                  return (
                    <div
                      key={sec.key}
                      style={{ padding: "12px 12px", borderRadius: 12, border: `1px solid ${C.border}` }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{sec.label}</div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
                            Confidence 0–5
                          </div>
                        </div>
                        <ConfidencePicker
                          value={st.confidence || 0}
                          onChange={(v) => actions.setSystemSectionConfidence(sys.id, sec.key, v)}
                          compact
                        />
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <textarea
                          value={st.notes || ""}
                          onChange={(e) => actions.setSystemSectionNotes(sys.id, sec.key, e.target.value)}
                          rows={3}
                          placeholder="Notes: key decisions, trade-offs, failure scenarios..."
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
                })}
              </div>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
