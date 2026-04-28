import { useState } from "react";

import { C } from "../../utils/theme";
import { newId } from "../../utils/id";
import { selectActions, usePrepStore } from "../../store/usePrepStore";

import { Card } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { ConfidencePicker } from "../ui/ConfidencePicker";
import { Label } from "../ui/Label";
import { Pill } from "../ui/Pill";

export const BehavioralTab = () => {
  const stories = usePrepStore((s) => s.behavioral.stories);
  const actions = usePrepStore(selectActions);

  const [draft, setDraft] = useState({
    title: "",
    prompt: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    reflection: "",
    score: 0,
  });

  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const add = () => {
    if (!draft.title.trim()) return;
    actions.addBehavioralStory({
      id: newId("story"),
      ...draft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setDraft({
      title: "",
      prompt: "",
      situation: "",
      task: "",
      action: "",
      result: "",
      reflection: "",
      score: 0,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card glow={C.cyan}>
        <Label>Behavioral — STAR Stories</Label>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
          Capture your best stories and refine them into repeatable narratives.
        </div>
      </Card>

      <Card>
        <Label>Add Story</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Title (e.g., 'Built rate limiter under outage')"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "10px 12px",
              color: C.text,
              fontSize: 12,
            }}
          />
          <input
            value={draft.prompt}
            onChange={(e) => setDraft((d) => ({ ...d, prompt: e.target.value }))}
            placeholder="Prompt (e.g., 'Tell me about a conflict')"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "10px 12px",
              color: C.text,
              fontSize: 12,
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 12 }}>
          {[
            { key: "situation", label: "Situation" },
            { key: "task", label: "Task" },
            { key: "action", label: "Action" },
            { key: "result", label: "Result" },
          ].map((f) => (
            <textarea
              key={f.key}
              value={draft[f.key]}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              rows={3}
              placeholder={f.label}
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
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <textarea
            value={draft.reflection}
            onChange={(e) => setDraft((d) => ({ ...d, reflection: e.target.value }))}
            rows={2}
            placeholder="Reflection: what you learned, what you'd do differently"
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>
              SCORE (0–5)
            </div>
            <div style={{ marginTop: 8 }}>
              <ConfidencePicker
                value={draft.score}
                onChange={(v) => setDraft((d) => ({ ...d, score: v }))}
                compact
              />
            </div>
          </div>
          <button
            onClick={add}
            style={{
              background: `linear-gradient(90deg,${C.orange},${C.cyan})`,
              border: "none",
              borderRadius: 10,
              padding: "10px 12px",
              color: "#000",
              fontSize: 12,
              fontWeight: 900,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            ADD STORY
          </button>
        </div>
      </Card>

      <Card>
        <Label>Stories</Label>
        {stories.length === 0 ? (
          <div style={{ fontSize: 12, color: C.textMuted }}>No stories yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {stories.map((s) => {
              const key = `story:${s.id}`;
              const isOpen = !!open[key];
              return (
                <div key={s.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
                  <div
                    onClick={() => toggle(key)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.prompt || "—"}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.deleteBehavioralStory(s.id);
                        }}
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "7px 10px",
                          color: C.textMuted,
                          fontSize: 11,
                          fontWeight: 900,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                        title="Delete story"
                      >
                        DELETE
                      </button>
                      <Pill color={C.cyan}>{s.score || 0}/5</Pill>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  <Collapsible open={isOpen}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 12 }}>
                      {[
                        { key: "situation", label: "Situation" },
                        { key: "task", label: "Task" },
                        { key: "action", label: "Action" },
                        { key: "result", label: "Result" },
                      ].map((f) => (
                        <textarea
                          key={f.key}
                          value={s[f.key] || ""}
                          onChange={(e) => actions.updateBehavioralStory(s.id, { [f.key]: e.target.value })}
                          rows={3}
                          placeholder={f.label}
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
                      ))}
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <textarea
                        value={s.reflection || ""}
                        onChange={(e) => actions.updateBehavioralStory(s.id, { reflection: e.target.value })}
                        rows={2}
                        placeholder="Reflection"
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

                    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 900, letterSpacing: "1.5px" }}>
                          SCORE (0–5)
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <ConfidencePicker
                            value={s.score || 0}
                            onChange={(v) => actions.updateBehavioralStory(s.id, { score: v })}
                            compact
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        Updated: {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "—"}
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
