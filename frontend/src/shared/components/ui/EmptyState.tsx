import React from "react";
import { HiExclamationTriangle } from "react-icons/hi2";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-tertiary)]">
        {icon ?? <HiExclamationTriangle className="h-8 w-8" />}
      </div>
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
