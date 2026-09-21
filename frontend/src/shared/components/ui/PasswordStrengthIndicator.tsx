import React, { useMemo } from "react";

interface StrengthLevel {
  label: string;
  color: string;
  segments: number;
}

const LEVELS: StrengthLevel[] = [
  { label: "Weak", color: "#ef4444", segments: 1 },
  { label: "Fair", color: "#f59e0b", segments: 2 },
  { label: "Strong", color: "#3b82f6", segments: 3 },
  { label: "Very Strong", color: "#22c55e", segments: 4 },
];

const TOTAL_SEGMENTS = 4;

function getStrengthScore(password: string): number {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps): React.JSX.Element | null {
  const score = useMemo(() => getStrengthScore(password), [password]);

  if (!password) return null;

  const level = LEVELS[score - 1];

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite" aria-label={`Password strength: ${level.label}`}>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i < level.segments ? level.color : "var(--border-default)",
            }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: level.color }}>
        {level.label}
      </p>
    </div>
  );
}
