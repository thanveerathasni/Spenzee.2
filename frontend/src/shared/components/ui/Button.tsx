import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  showArrowBox?: boolean;
  arrowText?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] border border-transparent shadow-sm",
  secondary:
    "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-hover)] border border-[var(--btn-secondary-border)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] border border-transparent",
  outline:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--text-primary)]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-sm",
  accent:
    "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 border border-transparent shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs font-semibold tracking-wider uppercase gap-2",
  md: "h-11 px-5 text-xs font-bold tracking-[0.15em] uppercase gap-2.5",
  lg: "h-13 px-7 text-xs font-black tracking-[0.2em] uppercase gap-3",
  xl: "h-16 px-8 text-sm font-black tracking-[0.25em] uppercase gap-4",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  showArrowBox = false,
  arrowText,
  disabled,
  children,
  className = "",
  type = "button",
  onAnimationStart,
  onDrag,
  onDragStart,
  onDragEnd,
  ...props
}: ButtonProps & HTMLMotionProps<"button">): React.JSX.Element {
  const isDisabled = disabled ?? isLoading;

  if (showArrowBox) {
    return (
      <motion.button
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        whileHover={isDisabled ? undefined : "hover"}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        className={[
          "group inline-flex items-center gap-4 text-left transition-all duration-300",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <motion.span
          variants={{ hover: { x: 3 } }}
          transition={{ duration: 0.2 }}
          className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-[-0.03em] leading-none"
        >
          {isLoading ? "..." : (arrowText ?? children)}
        </motion.span>

        <motion.div
          variants={{
            hover: {
              x: 6,
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-base)",
            },
          }}
          transition={{ duration: 0.25 }}
          className="w-12 h-12 flex-shrink-0 border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)] transition-colors duration-250"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <motion.svg
              variants={{ hover: { x: 2 } }}
              transition={{ duration: 0.2 }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </motion.div>

        {children && arrowText && (
          <motion.span
            variants={{ hover: { opacity: 1, x: 0 } }}
            initial={{ opacity: 0.5, x: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.25em] hidden sm:block font-bold"
          >
            {children}
          </motion.span>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={[
        "inline-flex items-center justify-center font-sans tracking-[0.15em] uppercase select-none transition-all duration-300",
        "focus-visible:outline-2 focus-visible:outline-[var(--border-active)] focus-visible:outline-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
}
