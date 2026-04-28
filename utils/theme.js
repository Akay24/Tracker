export const C = {
  bg: "#060608",
  card: "#0d0d14",
  surface: "#080810",
  surface2: "#090914",
  border: "#1a1a28",
  borderHover: "#2a2a42",
  orange: "#f97316",
  orangeD: "#ea6a0a",
  green: "#34d399",
  cyan: "#22d3ee",
  yellow: "#fbbf24",
  purple: "#a78bfa",
  text: "#f1f5f9",
  textSec: "#94a3b8",
  textMuted: "#475569",
};

const clamp01 = (n) => Math.max(0, Math.min(1, n));

export const hexToRgb = (hex) => {
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length !== 6) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
};

export const rgba = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${clamp01(alpha)})`;
};

export const CONFIDENCE = {
  label: {
    0: "Unseen",
    1: "Weak",
    2: "Partial",
    3: "Solvable",
    4: "Strong",
    5: "Interview Ready",
  },
};

export const confidenceColor = (level) => {
  if (level <= 0) return C.border;
  if (level === 1) return C.orange;
  if (level === 2) return C.yellow;
  if (level === 3) return C.cyan;
  if (level === 4) return C.green;
  return C.purple;
};

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:${C.bg}; color:${C.text}}
  input,textarea{font-family:inherit;outline:none}
  input::placeholder,textarea::placeholder{color:${C.textMuted}}
  input:focus,textarea:focus{border-color:${C.orange}!important}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-thumb{background:${C.orange};border-radius:2px}
  ::-webkit-scrollbar-track{background:transparent}
  button{cursor:pointer;font-family:inherit}
  .ci:hover{background:${rgba(C.orange, 0.06)}!important}
  .tab-btn:hover{color:${C.textSec}!important}
  .card-hover:hover{border-color:${C.borderHover}!important}
  input[type=range]{accent-color:${C.orange}}
  .heat-cell{transition:transform 0.15s ease, background 0.15s ease;}
  .heat-cell:hover{transform:scale(1.08)}
`;
