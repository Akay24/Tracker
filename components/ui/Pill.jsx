import { C, rgba } from "../../utils/theme";

export const Pill = ({ children, color = C.orange, style = {} }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 100,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.5px",
      background: rgba(color, 0.10),
      color,
      border: `1px solid ${rgba(color, 0.22)}`,
      ...style,
    }}
  >
    {children}
  </span>
);
