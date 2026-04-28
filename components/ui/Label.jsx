import { C } from "../../utils/theme";

export const Label = ({ children, style = {} }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: C.textMuted,
      marginBottom: 10,
      ...style,
    }}
  >
    {children}
  </div>
);
