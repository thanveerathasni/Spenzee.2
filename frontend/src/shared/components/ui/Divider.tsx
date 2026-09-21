import React from "react";

export interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps): React.JSX.Element {
  if (!label) {
    return <div className={`w-full h-px bg-[var(--border-default)] transition-colors duration-300 ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-4 w-full my-6 ${className}`}>
      <div className="flex-1 h-px bg-[var(--border-default)]" />
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] select-none">
        {label}
      </span>
      <div className="flex-1 h-px bg-[var(--border-default)]" />
    </div>
  );
}
