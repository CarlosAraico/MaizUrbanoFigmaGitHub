import type { ReactNode } from "react";
import { muColors } from "../tokens/colors";
import { muSpacing } from "../tokens/spacing";
import { muTypography } from "../tokens/typography";

interface ChipProps {
  children: ReactNode;
}

export function Chip({ children }: ChipProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: `${muSpacing.xs} ${muSpacing.m}`,
        borderRadius: "999px",
        border: `1px solid ${muColors.goldBorder}`,
        background: muColors.goldSoft,
        color: muColors.textMain,
        fontSize: muTypography.caption.fontSize,
        letterSpacing: muTypography.caption.letterSpacing,
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}
