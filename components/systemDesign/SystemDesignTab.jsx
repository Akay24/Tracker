import { useMemo, useState } from "react";

import { SYSTEMS, SYSTEM_DESIGN_SECTIONS } from "../../data/systemDesignCatalog";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const pct = (avg0to5) => Math.max(0, Math.min(100, Math.round((avg0to5 / 5) * 100)));

const InfoBlock = ({ label, value }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.7, background: rgba(C.cyan, 0.04), borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.border}` }}>{value}</div>
  </div>
);

export const SystemDesignTab = () => {
  const systemsById = usePrepStore((s) => s.systemDesign.systemsById);
  const actions = usePrepStore(selectActions);

  const [open, setOpen] = useState({});
  const [activeSection, setActiveSection] = useState({});
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const systems = useMemo(() => SYSTEMS.map((s) => ({
    ...s,
    state: systemsById?.[s.id],
  })).filter((s) => s.state), [systemsById]);

  const overallPct = useMemo(() => {
    const all = systems.flatMap((s) => Object.values(s.state?.sections || {}));
    const avg = all.length ? all.reduce((sum, sec) => sum + Number(sec.confidence || 0), 0) / all.length : 0;
    return pct(avg);
  }, [systems]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.yellow}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>System Design — MAANG Interview Framework</Label>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
              Master each system across all 8 sections. Use key insights + prompts to guide your notes.
            </div>
          </div>
          <Pill color={C.yellow}>{overallPct}% overall</Pill>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar done={overallPct} total={100} color={C.yellow} gradient={`linear-gradient(90deg,${C.yellow},${C.cyan})`} />
        </div>
      </Card>

      {systems.map(({ id, name, icon, difficulty, tags, keyInsights, estimations, apiSketch, dataModelSketch, scalingStory, failureScenarios, state }) => {
        const key = `sys:${id}`;
        const sections = Object.entries(state?.sections || {});
        const avg = sections.length ? sections.reduce((s, [, v]) => s + Number(v.confidence || 0), 0) / sections.length : 0;
        const p = pct(avg);
        const isOpen = !!open[key];
        const activeSec = activeSection[id] || SYSTEM_DESIGN_SECTIONS[0].key;

        return (
          <Card key={id} glow={C.yellow}>
            <div onClick={() => toggle(key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: difficulty === "Hard" ? C.orange : C.yellow, fontFamily: "'JetBrains Mono',monospace" }}>{difficulty}</span>
                    {(tags || []).map((t) => (
                      <span key={t} style={{ fontSize: 10, color: C.textMuted, background: rgba(C.purple, 0.1), borderRadius: 4, padding: "1px 6px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill color={C.yellow}>{p}%</Pill>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {!isOpen && (
              <div style={{ marginTop: 12 }}>
                <ProgressBar done={p} total={100} color={C.yellow} height={4} gradient={`linear-gradient(90deg,${C.yellow},${C.cyan})`} />
              </div>
            )}

            <Collapsible open={isOpen}>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Key Insights */}
                <div style={{ padding: "12px 14px", borderRadius: 10, background: rgba(C.yellow, 0.05), border: `1px solid ${rgba(C.yellow, 0.2)}` }}>
                  <div style={{ fontSize: 10, color: C.yellow, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 8 }}>⚡ KEY INSIGHTS FOR MAANG</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(keyInsights || []).map((ins, i) => (
                      <div key={i} style={{ display: "flex", gap: 8 }}>
                        <span style={{ color: C.yellow, fontWeight: 900, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>{ins}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Reference */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InfoBlock label="SCALE ESTIMATION" value={estimations} />
                  <InfoBlock label="API SKETCH" value={apiSketch} />
                  <InfoBlock label="DATA MODEL" value={dataModelSketch} />
                  <InfoBlock label="SCALING STORY" value={scalingStory} />
                </div>
                <InfoBlock label="FAILURE SCENARIOS" value={failureScenarios} />

                {/* Section tabs */}
                <div>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 10 }}>SECTION-BY-SECTION CONFIDENCE + NOTES</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {SYSTEM_DESIGN_SECTIONS.map((sec) => {
                      const secState = state?.sections?.[sec.key] || {};
                      const isActive = activeSec === sec.key;
                      return (
                        <button key={sec.key} onClick={() => setActiveSection((p) => ({ ...p, [id]: sec.key }))}
                          style={{
                            padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                            border: `1px solid ${isActive ? rgba(C.yellow, 0.5) : C.border}`,
                            background: isActive ? rgba(C.yellow, 0.12) : "transparent",
                            color: isActive ? C.yellow : C.textMuted,
                          }}>
                          {sec.label} {Number(secState.confidence || 0) > 0 ? `(${secState.confidence}/5)` : ""}
                        </button>
                      );
                    })}
                  </div>

                  {SYSTEM_DESIGN_SECTIONS.filter((sec) => sec.key === activeSec).map((sec) => {
                    const st = state?.sections?.[sec.key] || { confidence: 0, notes: "" };
                    return (
                      <div key={sec.key} style={{ padding: "14px", borderRadius: 12, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 900, color: C.text }}>{sec.label}</div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>{sec.prompt}</div>
                          </div>
                          <ConfidencePicker value={st.confidence || 0} onChange={(v) => actions.setSystemSectionConfidence(id, sec.key, v)} compact />
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <textarea value={st.notes || ""} onChange={(e) => actions.setSystemSectionNotes(id, sec.key, e.target.value)}
                            rows={5} placeholder={`Your ${sec.label.toLowerCase()} notes for ${name}...`}
                            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 12, resize: "vertical" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
