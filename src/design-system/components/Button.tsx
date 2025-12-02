import type { ButtonHTMLAttributes, ReactNode } from "react";
import { muColors } from "../tokens/colors";
import { muSpacing } from "../tokens/spacing";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({ children, variant = "primary", style, ...props }: ButtonProps) {
  const baseStyles = {
    padding: "12px 26px",
    borderRadius: "999px",
    fontWeight: 700,
    letterSpacing: "0.02em",
    cursor: "pointer",
    transition: "0.2s ease",
  } as const;

  const variantStyles =
    variant === "primary"
      ? {
          background: muColors.gold,
          color: "#111",
          border: "none",
          boxShadow: "0 12px 30px rgba(245, 199, 105, 0.35)",
        }
      : {
          background: "transparent",
          border: `1px solid ${muColors.goldBorder}`,
          color: muColors.gold,
        };

  return (
    <button
      {...props}
      style={{
        ...baseStyles,
        ...variantStyles,
        padding: `${muSpacing.s} ${muSpacing.l}`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
