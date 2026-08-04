import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leftIcon, rightElement, className = "", id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-primary)] select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex items-center text-[var(--input-placeholder)] pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
          className={[
            "w-full h-10 rounded-[var(--radius-lg)] px-3 text-sm",
            "bg-[var(--input-bg)] text-[var(--text-primary)]",
            "border transition-colors duration-[var(--transition-fast)]",
            "placeholder:text-[var(--input-placeholder)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--input-border-focus)] focus:ring-offset-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            hasError
              ? "border-red-500 focus:ring-red-500/30"
              : "border-[var(--input-border)] focus:border-[var(--input-border-focus)]",
            leftIcon ? "pl-10" : "",
            rightElement ? "pr-10" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {rightElement && (
          <span className="absolute right-3 flex items-center">{rightElement}</span>
        )}
      </div>

      {hasError && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--text-tertiary)]">
          {helperText}
        </p>
      )}
    </div>
  );
});
