import type { ReactNode } from "react";
import { muColors } from "../tokens/colors";
import { muTypography } from "../tokens/typography";
import { muSpacing } from "../tokens/spacing";

interface CardProps {
  title?: string;
  children: ReactNode;
  gold?: boolean;
}

export function Card({ title, children, gold = false }: CardProps) {
  return (
    <div
      style={{
        background: gold
          ? `radial-gradient(circle at top left, ${muColors.goldSoft}, ${muColors.cardBg})`
          : muColors.cardBg,
        border: `1px solid ${gold ? muColors.goldBorder : muColors.cardBorder}`,
        borderRadius: "18px",
        padding: `${muSpacing.m} ${muSpacing.m}`,
        boxShadow: gold
          ? `0 20px 60px rgba(245, 199, 105, 0.08)`
          : "0 14px 40px rgba(0,0,0,0.25)",
      }}
    >
      {title ? (
        <h3
          style={{
            ...muTypography.h3,
            marginBottom: muSpacing.xs,
            color: muColors.textMain,
          }}
        >
          {title}
        </h3>
      ) : null}
      <div
        style={{
          color: muColors.textSoft,
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Alias corporativo MU
export const MUCard = Card;
