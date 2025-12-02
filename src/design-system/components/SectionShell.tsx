import type { ReactNode } from "react";
import { muColors } from "../tokens/colors";
import { muSpacing } from "../tokens/spacing";

interface SectionShellProps {
  id?: string;
  children: ReactNode;
  dark?: boolean;
}

export function SectionShell({ id, children, dark = false }: SectionShellProps) {
  return (
    <section
      id={id}
      style={{
        background: dark
          ? "linear-gradient(to bottom, #020617, #02040A)"
          : "linear-gradient(to bottom, #02040A, #020617)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: `${muSpacing.xxl} ${muSpacing.l}`,
          color: muColors.textMain,
        }}
      >
        {children}
      </div>
    </section>
  );
}

// Alias corporativo MU
export const MUSectionShell = SectionShell;
