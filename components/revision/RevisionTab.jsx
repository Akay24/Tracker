import { useMemo } from "react";

import { REVISION_SECTIONS } from "../../data/revisionCatalog";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const makeItemKey = (sectionId, subIdx, itemIdx) => `${sectionId}|${subIdx}|${itemIdx}`;
const makeSubKey = (sectionId, subIdx) => `sub|${sectionId}|${subIdx}`;

export const RevisionTab = () => {
  const checked = usePrepStore((s) => s.revision.checked);
  const expanded = usePrepStore((s) => s.revision.expanded);
  const actions = usePrepStore(selectActions);

  const totalItems = useMemo(
    () =>
      REVISION_SECTIONS.reduce(
        (s, sec) => s + sec.subsections.reduce((ss, sub) => ss + sub.items.length, 0),
        0,
      ),
    [],
  );

  const done = useMemo(() => Object.values(checked || {}).filter(Boolean).length, [checked]);
  const pct = useMemo(() => (totalItems ? Math.round((done / totalItems) * 100) : 0), [done, totalItems]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.orange}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>Revision — Fundamentals Checklist</Label>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
              Turn weak areas into muscle memory.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color={C.orange}>
              {done}/{totalItems} · {pct}%
            </Pill>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar
            done={pct}
            total={100}
            color={C.orange}
            gradient={`linear-gradient(90deg,${C.orange},${C.cyan})`}
          />
        </div>
      </Card>

      {REVISION_SECTIONS.map((sec) => (
        <Card key={sec.id} glow={C.orange}>
          <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{sec.title}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {sec.subsections.map((sub, subIdx) => {
              const subKey = makeSubKey(sec.id, subIdx);
              const isOpen = !!expanded?.[subKey];
              const subTotal = sub.items.length;
              const subDone = sub.items.reduce((s, _it, itemIdx) => {
                const k = makeItemKey(sec.id, subIdx, itemIdx);
                return s + (checked?.[k] ? 1 : 0);
              }, 0);
              const subPct = subTotal ? Math.round((subDone / subTotal) * 100) : 0;

              return (
                <div key={subKey} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
                  <div
                    onClick={() => actions.toggleRevisionExpanded(subKey)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{sub.title}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                        {subDone}/{subTotal} complete
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Pill color={C.orange}>{subPct}%</Pill>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {!isOpen && (
                    <div style={{ marginTop: 10 }}>
                      <ProgressBar
                        done={subPct}
                        total={100}
                        color={C.orange}
                        height={3}
                        gradient={`linear-gradient(90deg,${C.orange},${C.cyan})`}
                      />
                    </div>
                  )}

                  <Collapsible open={isOpen}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                      {sub.items.map((it, itemIdx) => {
                        const k = makeItemKey(sec.id, subIdx, itemIdx);
                        const on = !!checked?.[k];
                        return (
                          <button
                            key={k}
                            onClick={() => actions.toggleRevisionChecked(k)}
                            style={{
                              textAlign: "left",
                              padding: "9px 10px",
                              borderRadius: 10,
                              border: `1px solid ${on ? rgba(C.orange, 0.45) : C.border}`,
                              background: on ? rgba(C.orange, 0.10) : C.surface,
                              color: on ? C.orange : C.text,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <span style={{ marginRight: 10, fontFamily: "'JetBrains Mono',monospace" }}>
                              {on ? "[x]" : "[ ]"}
                            </span>
                            {it}
                          </button>
                        );
                      })}
                    </div>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};
