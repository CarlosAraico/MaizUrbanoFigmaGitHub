import { muColors } from "../tokens/colors";
import { muTypography } from "../tokens/typography";
import { muSpacing } from "../tokens/spacing";

interface MetricProps {
  value: string;
  label: string;
}

export function Metric({ value, label }: MetricProps) {
  return (
    <div style={{ marginRight: muSpacing.l }}>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: muColors.gold,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          ...muTypography.body,
          color: muColors.textSoft,
          opacity: 0.8,
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
