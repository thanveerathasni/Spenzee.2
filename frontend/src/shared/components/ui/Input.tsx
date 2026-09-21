import { AnimatePresence, motion } from "framer-motion";
import React, { useId, useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leftIcon, rightElement, className = "", id, onFocus, onBlur, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div
      className={`border-t transition-colors duration-300 w-full ${
        hasError
          ? "border-red-500"
          : isFocused
            ? "border-[var(--input-border-focus)]"
            : "border-[var(--input-border)]"
      }`}
    >
      <div className="pt-4 pb-3">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[9px] font-black uppercase tracking-[0.35em] text-[var(--text-tertiary)] mb-2 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center gap-3">
          {leftIcon && (
            <span className="flex-shrink-0 text-[var(--text-tertiary)] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
            className={[
              "w-full bg-transparent text-[var(--text-primary)] text-base font-light",
              "placeholder:text-[var(--input-placeholder)] focus:outline-none",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {rightElement && (
            <span className="flex-shrink-0 flex items-center">{rightElement}</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.p
            id={`${inputId}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-red-400 pb-2 font-medium"
          >
            {error}
          </motion.p>
        )}
        {!hasError && helperText && (
          <p id={`${inputId}-hint`} className="text-[10px] text-[var(--text-tertiary)] pb-2">
            {helperText}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
});
