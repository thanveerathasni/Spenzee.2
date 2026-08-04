import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  glass = false,
  padding = "md",
}: CardProps): React.JSX.Element {
  return (
    <div
      className={[
        "rounded-[var(--radius-xl)]",
        "border border-[var(--card-border)]",
        "shadow-[var(--card-shadow)]",
        "transition-colors duration-[var(--transition-base)]",
        glass
          ? "bg-[var(--bg-glass)] backdrop-blur-xl"
          : "bg-[var(--card-bg)]",
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
