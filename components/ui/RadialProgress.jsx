import { C } from "../../utils/theme";

export const RadialProgress = ({
  value,
  size = 92,
  strokeWidth = 10,
  color = C.orange,
  label,
  sublabel,
}) => {
  const v = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={C.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${dash} ${c - dash}`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 20,
              fontWeight: 800,
              color,
              letterSpacing: "-0.5px",
            }}
          >
            {v}%
          </div>
        </div>
      </div>
      {label && <div style={{ fontSize: 11, color: C.textSec, fontWeight: 700 }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 10, color: C.textMuted }}>{sublabel}</div>}
    </div>
  );
};
