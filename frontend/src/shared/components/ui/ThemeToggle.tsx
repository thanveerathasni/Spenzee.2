import React from "react";
import { HiMoon, HiSun, HiComputerDesktop } from "react-icons/hi2";

import { useAppDispatch, useAppSelector } from "@/store";
import { setTheme, type Theme } from "@/store/themeSlice";

interface ThemeToggleProps {
  showLabel?: boolean;
}

const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: "light", icon: <HiSun className="h-4 w-4" />, label: "Light" },
  { value: "dark", icon: <HiMoon className="h-4 w-4" />, label: "Dark" },
  { value: "system", icon: <HiComputerDesktop className="h-4 w-4" />, label: "System" },
];

export function ThemeToggle({ showLabel = false }: ThemeToggleProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.mode);

  const current = themeOptions.find((t) => t.value === currentTheme) ?? themeOptions[0];

  const cycleTheme = (): void => {
    const currentIndex = themeOptions.findIndex((t) => t.value === currentTheme);
    const next = themeOptions[(currentIndex + 1) % themeOptions.length];
    dispatch(setTheme(next.value));
  };

  return (
    <button
      onClick={cycleTheme}
      aria-label={`Switch theme, current: ${current.label}`}
      title={`Switch to next theme (current: ${current.label})`}
      className={[
        "inline-flex items-center gap-2 rounded-[var(--radius-lg)]",
        "px-3 h-9 text-sm font-medium",
        "bg-[var(--bg-surface-2)] text-[var(--text-secondary)]",
        "hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]",
        "border border-[var(--border-default)]",
        "transition-all duration-[var(--transition-fast)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--border-accent)]",
      ].join(" ")}
    >
      {current.icon}
      {showLabel && <span>{current.label}</span>}
    </button>
  );
}
