import { C, CONFIDENCE, confidenceColor, rgba } from "../../utils/theme";

const levels = [0, 1, 2, 3, 4, 5];

export const ConfidencePicker = ({ value, onChange, compact = false }) => {
  const v = Math.max(0, Math.min(5, Number(value) || 0));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {levels.map((l) => {
          const on = l === v;
          const col = confidenceColor(l);
          return (
            <button
              key={l}
              onClick={() => onChange?.(l)}
              title={`${l} — ${CONFIDENCE.label[l]}`}
              style={{
                width: compact ? 16 : 18,
                height: compact ? 16 : 18,
                borderRadius: 5,
                border: `1px solid ${on ? rgba(col, 0.8) : C.border}`,
                background: on ? rgba(col, 0.55) : "transparent",
                color: C.text,
                fontSize: 10,
                fontWeight: 800,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
      {!compact && (
        <div style={{ fontSize: 11, color: C.textMuted, minWidth: 120 }}>
          {CONFIDENCE.label[v]}
        </div>
      )}
    </div>
  );
};
