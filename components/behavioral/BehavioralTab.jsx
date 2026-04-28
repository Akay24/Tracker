import { useState, useMemo } from "react";

import { C, rgba } from "../../utils/theme";
import { newId } from "../../utils/id";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";

const CATEGORIES = [
  { key: "leadership",  label: "Leadership",   emoji: "🎯" },
  { key: "conflict",    label: "Conflict",      emoji: "⚡" },
  { key: "failure",     label: "Failure",       emoji: "📉" },
  { key: "ownership",   label: "Ownership",     emoji: "🏆" },
  { key: "ambiguity",   label: "Ambiguity",     emoji: "🌫️" },
  { key: "influence",   label: "Influence",     emoji: "🤝" },
];

const COMMON_PROMPTS = [
  "Tell me about a time you led a project under pressure.",
  "Describe a conflict with a teammate and how you resolved it.",
  "Tell me about a time you failed. What did you learn?",
  "Give an example of going above and beyond your role.",
  "Tell me about a time you disagreed with your manager.",
  "Describe a situation where you had to work with ambiguous requirements.",
  "Tell me about a project you drove end-to-end.",
  "Give an example of influencing without authority.",
];

const INPUT_STYLE = (C) => ({
  width: "100%",
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: "10px 12px",
  color: C.text,
  fontSize: 12,
  resize: "vertical",
});

const emptyDraft = () => ({
  title: "", category: "leadership", prompt: "",
  situation: "", task: "", action: "", result: "", reflection: "",
  clarity_score: 0, impact_score: 0,
});

export const BehavioralTab = () => {
  const stories = usePrepStore((s) => s.behavioral.stories);
  const actions  = usePrepStore(selectActions);

  const [draft, setDraft]     = useState(emptyDraft);
  const [open, setOpen]       = useState({});
  const [filterCat, setFilter] = useState("all");
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const add = () => {
    if (!draft.title.trim()) return;
    actions.addBehavioralStory({ id: newId("story"), ...draft, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setDraft(emptyDraft());
  };

  const filtered = useMemo(() =>
    filterCat === "all" ? stories : stories.filter((s) => s.category === filterCat),
    [stories, filterCat]);

  const catStats = useMemo(() => {
    const counts = {};
    for (const s of stories) counts[s.category] = (counts[s.category] || 0) + 1;
    return counts;
  }, [stories]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.cyan}>
        <Label>Behavioral — STAR Stories</Label>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6, marginBottom: 12 }}>
          Craft repeatable, scored stories. Aim for &ge;2 per category. Practice clarity (can interviewer follow?) and impact (does it matter at L4/L5 level?).
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.key} style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: rgba(C.cyan, 0.05) }}>
              <span style={{ fontSize: 14 }}>{cat.emoji}</span>
              <span style={{ fontSize: 11, color: C.textSec, marginLeft: 6 }}>{cat.label}</span>
              <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 6 }}>({catStats[cat.key] || 0})</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Common Prompts */}
      <Card>
        <Label>Common MAANG Prompts — Know These Cold</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {COMMON_PROMPTS.map((p, i) => (
            <div key={i} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
              <span style={{ color: C.cyan, fontFamily: "'JetBrains Mono',monospace", marginRight: 8 }}>{String(i+1).padStart(2,"0")}.</span>{p}
            </div>
          ))}
        </div>
      </Card>

      {/* Add Story Form */}
      <Card>
        <Label>Add Story</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
          <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Story title (e.g. 'Shipped rate limiter during outage')"
            style={{ ...INPUT_STYLE(C), resize: undefined }} />
          <select value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            style={{ ...INPUT_STYLE(C), resize: undefined }}>
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
        <input value={draft.prompt} onChange={(e) => setDraft((d) => ({ ...d, prompt: e.target.value }))}
          placeholder="Interviewer prompt (e.g. 'Tell me about a time you led under pressure')"
          style={{ ...INPUT_STYLE(C), resize: undefined, marginTop: 12 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          {["situation", "task", "action", "result"].map((f) => (
            <textarea key={f} value={draft[f]} onChange={(e) => setDraft((d) => ({ ...d, [f]: e.target.value }))}
              rows={3} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              style={INPUT_STYLE(C)} />
          ))}
        </div>
        <textarea value={draft.reflection} onChange={(e) => setDraft((d) => ({ ...d, reflection: e.target.value }))}
          rows={2} placeholder="Reflection: what you learned, what you'd do differently"
          style={{ ...INPUT_STYLE(C), marginTop: 12 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 6 }}>CLARITY (0–5)</div>
              <ConfidencePicker value={draft.clarity_score} onChange={(v) => setDraft((d) => ({ ...d, clarity_score: v }))} compact />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 6 }}>IMPACT (0–5)</div>
              <ConfidencePicker value={draft.impact_score} onChange={(v) => setDraft((d) => ({ ...d, impact_score: v }))} compact />
            </div>
          </div>
          <button onClick={add} style={{ background: `linear-gradient(90deg,${C.orange},${C.cyan})`, border: "none", borderRadius: 10, padding: "10px 16px", color: "#000", fontSize: 12, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>
            ADD STORY
          </button>
        </div>
      </Card>

      {/* Filter + Story List */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Label>Stories ({stories.length})</Label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[{ key: "all", label: "All" }, ...CATEGORIES].map((c) => (
              <button key={c.key} onClick={() => setFilter(c.key)}
                style={{ padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, border: `1px solid ${filterCat === c.key ? rgba(C.cyan, 0.5) : C.border}`, background: filterCat === c.key ? rgba(C.cyan, 0.12) : "transparent", color: filterCat === c.key ? C.cyan : C.textMuted }}>
                {"emoji" in c ? `${c.emoji} ` : ""}{c.label}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textMuted }}>No stories in this category yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((s) => {
              const key = `story:${s.id}`;
              const cat = CATEGORIES.find((c) => c.key === s.category);
              return (
                <div key={s.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
                  <div onClick={() => toggle(key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{cat?.emoji}</span>
                        <div style={{ fontSize: 13, fontWeight: 900, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.prompt || "—"}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 10 }}>
                      <Pill color={C.cyan}>C:{s.clarity_score || 0}</Pill>
                      <Pill color={C.green}>I:{s.impact_score || 0}</Pill>
                      <button onClick={(e) => { e.stopPropagation(); actions.deleteBehavioralStory(s.id); }}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 8px", color: C.textMuted, fontSize: 11, fontWeight: 900 }}>DEL</button>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>{open[key] ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  <Collapsible open={!!open[key]}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                      {["situation", "task", "action", "result"].map((f) => (
                        <div key={f}>
                          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.2px", marginBottom: 4 }}>{f.toUpperCase()}</div>
                          <textarea value={s[f] || ""} onChange={(e) => actions.updateBehavioralStory(s.id, { [f]: e.target.value })}
                            rows={3} placeholder={f} style={INPUT_STYLE(C)} />
                        </div>
                      ))}
                    </div>
                    <textarea value={s.reflection || ""} onChange={(e) => actions.updateBehavioralStory(s.id, { reflection: e.target.value })}
                      rows={2} placeholder="Reflection" style={{ ...INPUT_STYLE(C), marginTop: 12 }} />
                    <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
                      <div>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 6 }}>CLARITY (0–5)</div>
                        <ConfidencePicker value={s.clarity_score || 0} onChange={(v) => actions.updateBehavioralStory(s.id, { clarity_score: v })} compact />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.4px", marginBottom: 6 }}>IMPACT (0–5)</div>
                        <ConfidencePicker value={s.impact_score || 0} onChange={(v) => actions.updateBehavioralStory(s.id, { impact_score: v })} compact />
                      </div>
                    </div>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
