import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps): React.JSX.Element {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizeMap[size],
        className,
      ].join(" ")}
      style={{ animationDuration: "0.7s" }}
    />
  );
}
