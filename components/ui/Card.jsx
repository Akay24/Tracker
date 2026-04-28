import { C, rgba } from "../../utils/theme";

export const Card = ({ children, style = {}, glow }) => (
  <div
    className="card-hover"
    style={{
      background: C.card,
      border: `1px solid ${glow ? rgba(glow, 0.27) : C.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: glow ? `0 0 20px ${rgba(glow, 0.12)}` : "none",
      ...style,
    }}
  >
    {children}
  </div>
);
