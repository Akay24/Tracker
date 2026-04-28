import { C, rgba } from "../../utils/theme";

const intensityFromValue = (v) => {
  if (!v) return 0;
  if (v === 1) return 1;
  if (v <= 3) return 2;
  if (v <= 6) return 3;
  return 4;
};

export const Heatmap = ({ days, color = C.orange, cell = 11, gap = 3, label }) => {
  const items = Array.isArray(days) ? days : [];
  const weeks = Math.ceil(items.length / 7);

  const getCellStyle = (value) => {
    const i = intensityFromValue(value);
    const bg =
      i === 0
        ? C.border
        : i === 1
          ? rgba(color, 0.18)
          : i === 2
            ? rgba(color, 0.32)
            : i === 3
              ? rgba(color, 0.50)
              : rgba(color, 0.75);

    return {
      width: cell,
      height: cell,
      borderRadius: 3,
      background: bg,
      border: `1px solid ${rgba(color, i === 0 ? 0.12 : 0.24)}`,
    };
  };

  return (
    <div>
      {label && <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8 }}>{label}</div>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, ${cell}px)`, gap }}>
        {items.map((d) => (
          <div
            key={d.dateKey}
            className="heat-cell"
            title={`${d.dateKey} · ${d.value || 0}`}
            style={getCellStyle(d.value || 0)}
          />
        ))}
      </div>
    </div>
  );
};
