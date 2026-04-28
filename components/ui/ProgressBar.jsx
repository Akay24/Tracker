import { C } from "../../utils/theme";

const pct = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

export const ProgressBar = ({ done, total, color = C.orange, height = 6, gradient }) => {
  const p = pct(done, total);
  const bg = gradient || color;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>
          {done}/{total}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {p}%
        </span>
      </div>
      <div style={{ height, background: C.border, borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${p}%`,
            background: bg,
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
};
