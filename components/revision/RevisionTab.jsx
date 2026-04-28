import { useMemo, useState } from "react";

import { REVISION_SECTIONS } from "../../data/revisionCatalog";
import { C, rgba } from "../../utils/theme";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

const makeItemKey = (sectionId, subIdx, itemIdx) => `${sectionId}|${subIdx}|${itemIdx}`;
const makeSubKey  = (sectionId, subIdx) => `sub|${sectionId}|${subIdx}`;

const SECTION_COLORS = {
  js:       C.cyan,
  node:     C.green,
  express:  C.orange,
  backend:  C.yellow,
  db:       C.purple,
  devops:   "#f472b6",
};

const SECTION_EMOJIS = {
  js:       "🟡",
  node:     "🟢",
  express:  "🟠",
  backend:  "🔵",
  db:       "🟣",
  devops:   "🔧",
};

const totalItemsInCatalog = REVISION_SECTIONS.reduce(
  (s, sec) => s + sec.subsections.reduce((ss, sub) => ss + sub.items.length, 0), 0,
);

export const RevisionTab = () => {
  const checked = usePrepStore((s) => s.revision.checked);
  const expanded = usePrepStore((s) => s.revision.expanded);
  const actions  = usePrepStore(selectActions);

  const [search, setSearch]     = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const done = useMemo(() => Object.values(checked || {}).filter(Boolean).length, [checked]);
  const pct  = useMemo(() => (totalItemsInCatalog ? Math.round((done / totalItemsInCatalog) * 100) : 0), [done]);

  const q = search.toLowerCase().trim();

  // Per-section stats for the header bar
  const sectionStats = useMemo(() => {
    return REVISION_SECTIONS.map((sec) => {
      let secTotal = 0, secDone = 0;
      sec.subsections.forEach((sub, subIdx) => {
        sub.items.forEach((_, itemIdx) => {
          const k = makeItemKey(sec.id, subIdx, itemIdx);
          secTotal++;
          if (checked?.[k]) secDone++;
        });
      });
      return { id: sec.id, title: sec.title, total: secTotal, done: secDone, pct: secTotal ? Math.round((secDone / secTotal) * 100) : 0 };
    });
  }, [checked]);

  // Mark all items in a subsection
  const markAll = (sec, subIdx, val) => {
    const sub = sec.subsections[subIdx];
    sub.items.forEach((_, itemIdx) => {
      const k = makeItemKey(sec.id, subIdx, itemIdx);
      if (!!checked?.[k] !== val) actions.toggleRevisionChecked(k);
    });
  };

  const filteredSections = useMemo(() => {
    return REVISION_SECTIONS
      .filter((sec) => activeSection === "all" || sec.id === activeSection)
      .map((sec) => ({
        ...sec,
        subsections: sec.subsections
          .map((sub) => ({
            ...sub,
            items: q
              ? sub.items.filter((it) => it.toLowerCase().includes(q))
              : sub.items,
          }))
          .filter((sub) => sub.items.length > 0),
      }))
      .filter((sec) => sec.subsections.length > 0);
  }, [activeSection, q]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <Card glow={C.orange}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <Label>Revision — Atomic Fundamentals ({totalItemsInCatalog} items)</Label>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
              6 domains · 49 subsections · Tick when you can explain it under pressure.
            </div>
          </div>
          <Pill color={C.orange}>{done}/{totalItemsInCatalog} · {pct}%</Pill>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar done={pct} total={100} color={C.orange} gradient={`linear-gradient(90deg,${C.orange},${C.cyan})`} />
        </div>
      </Card>

      {/* Domain tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setActiveSection("all")}
          style={{ padding: "8px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: `1px solid ${activeSection === "all" ? rgba(C.orange, 0.5) : C.border}`, background: activeSection === "all" ? rgba(C.orange, 0.12) : "transparent", color: activeSection === "all" ? C.orange : C.textMuted }}>
          All ({done}/{totalItemsInCatalog})
        </button>
        {sectionStats.map((s) => {
          const color = SECTION_COLORS[s.id] || C.orange;
          const active = activeSection === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ padding: "8px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: `1px solid ${active ? rgba(color, 0.5) : C.border}`, background: active ? rgba(color, 0.12) : "transparent", color: active ? color : C.textMuted }}>
              {SECTION_EMOJIS[s.id]} {s.title.split(" ")[0]} ({s.done}/{s.total})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search items... (e.g. 'closure', 'backpressure', 'ACID')"
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 12 }}
        />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: C.textMuted, fontSize: 16, cursor: "pointer" }}>
            ×
          </button>
        )}
      </div>

      {q && filteredSections.length === 0 && (
        <div style={{ fontSize: 12, color: C.textMuted, padding: "20px 0", textAlign: "center" }}>No items match "{q}"</div>
      )}

      {/* Sections */}
      {filteredSections.map((sec) => {
        const secColor = SECTION_COLORS[sec.id] || C.orange;
        // Recompute stats on filtered vs full
        let fullSecTotal = 0, fullSecDone = 0;
        const origSec = REVISION_SECTIONS.find((s) => s.id === sec.id);
        origSec.subsections.forEach((sub, subIdx) => {
          sub.items.forEach((_, itemIdx) => {
            fullSecTotal++;
            if (checked?.[makeItemKey(sec.id, subIdx, itemIdx)]) fullSecDone++;
          });
        });
        const secPct = fullSecTotal ? Math.round((fullSecDone / fullSecTotal) * 100) : 0;

        return (
          <Card key={sec.id} glow={secColor}>
            {/* Section header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{SECTION_EMOJIS[sec.id]}</span>
                <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>{sec.title}</div>
              </div>
              <Pill color={secColor}>{fullSecDone}/{fullSecTotal} · {secPct}%</Pill>
            </div>
            <ProgressBar done={secPct} total={100} color={secColor} height={4} gradient={`linear-gradient(90deg,${secColor},${C.cyan})`} />

            {/* Subsections */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {sec.subsections.map((sub, subDisplayIdx) => {
                // Find the original subIdx for key generation
                const origSubIdx = origSec.subsections.findIndex((s) => s.title === sub.title);
                const subKey = makeSubKey(sec.id, origSubIdx);
                const isOpen = !!expanded?.[subKey];

                const subTotal = origSec.subsections[origSubIdx].items.length;
                const subDone  = origSec.subsections[origSubIdx].items.reduce((s, _, itemIdx) => {
                  return s + (checked?.[makeItemKey(sec.id, origSubIdx, itemIdx)] ? 1 : 0);
                }, 0);
                const subPct = subTotal ? Math.round((subDone / subTotal) * 100) : 0;
                const allDone = subDone === subTotal;

                return (
                  <div key={subKey} style={{ border: `1px solid ${isOpen ? rgba(secColor, 0.3) : C.border}`, borderRadius: 12, padding: 12, background: isOpen ? rgba(secColor, 0.02) : C.surface }}>

                    {/* Subsection header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                      onClick={() => actions.toggleRevisionExpanded(subKey)}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: allDone ? secColor : C.text }}>{sub.title}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{subDone}/{subTotal} · {q && sub.items.length < subTotal ? `${sub.items.length} match` : ""}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
                        <Pill color={allDone ? secColor : C.textMuted}>{subPct}%</Pill>
                        <span style={{ color: C.textMuted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Progress bar when collapsed */}
                    {!isOpen && (
                      <div style={{ marginTop: 10 }}>
                        <ProgressBar done={subPct} total={100} color={secColor} height={3} gradient={`linear-gradient(90deg,${secColor},${C.cyan})`} />
                      </div>
                    )}

                    <Collapsible open={isOpen}>
                      {/* Quick actions */}
                      <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 10 }}>
                        <button onClick={() => markAll(origSec, origSubIdx, true)}
                          style={{ padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 900, border: `1px solid ${rgba(secColor, 0.4)}`, background: rgba(secColor, 0.08), color: secColor }}>
                          ✓ Mark all done
                        </button>
                        <button onClick={() => markAll(origSec, origSubIdx, false)}
                          style={{ padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 900, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted }}>
                          ✗ Clear all
                        </button>
                      </div>

                      {/* Items */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {sub.items.map((it, displayIdx) => {
                          // Find original item index for stable key
                          const origItemIdx = origSec.subsections[origSubIdx].items.indexOf(it);
                          const k  = makeItemKey(sec.id, origSubIdx, origItemIdx >= 0 ? origItemIdx : displayIdx);
                          const on = !!checked?.[k];

                          // Highlight search match
                          const lowerIt = it.toLowerCase();
                          const matchIdx = q ? lowerIt.indexOf(q) : -1;
                          const highlighted = matchIdx >= 0
                            ? (<>{it.slice(0, matchIdx)}<mark style={{ background: rgba(C.orange, 0.35), color: C.text, borderRadius: 3 }}>{it.slice(matchIdx, matchIdx + q.length)}</mark>{it.slice(matchIdx + q.length)}</>)
                            : it;

                          return (
                            <button key={k} onClick={() => actions.toggleRevisionChecked(k)}
                              style={{ textAlign: "left", padding: "9px 12px", borderRadius: 10, border: `1px solid ${on ? rgba(secColor, 0.4) : C.border}`, background: on ? rgba(secColor, 0.07) : "transparent", color: on ? secColor : C.text, fontSize: 12, fontWeight: on ? 700 : 400, cursor: "pointer", lineHeight: 1.55, transition: "all 0.12s" }}>
                              <span style={{ marginRight: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{on ? "✓" : "○"}</span>
                              {highlighted}
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
        );
      })}

      {/* Bottom summary */}
      {activeSection === "all" && !q && (
        <Card>
          <Label>Domain Progress Breakdown</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {sectionStats.map((s) => {
              const color = SECTION_COLORS[s.id] || C.orange;
              return (
                <div key={s.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ fontSize: 12, color: C.text }}>{SECTION_EMOJIS[s.id]} {s.title}</div>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color }}>{s.done}/{s.total}</div>
                  </div>
                  <ProgressBar done={s.pct} total={100} color={color} height={4} gradient={`linear-gradient(90deg,${color},${C.cyan})`} />
                </div>
              );
            })}
          </div>
        </Card>
      )}

    </div>
  );
};
