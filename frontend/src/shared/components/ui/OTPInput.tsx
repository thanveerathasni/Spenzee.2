import React, { useRef } from "react";

const OTP_LENGTH = 6;

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OTPInput({ value, onChange, error, disabled }: OTPInputProps): React.JSX.Element {
  const digits = value.padEnd(OTP_LENGTH, "").split("").slice(0, OTP_LENGTH);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focus = (index: number): void => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, char: string): void => {
    if (!/^\d*$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char.slice(-1);
    const newValue = newDigits.join("").replace(/\s/g, "");
    onChange(newValue.slice(0, OTP_LENGTH));

    if (char && index < OTP_LENGTH - 1) {
      focus(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = " ";
        onChange(newDigits.join("").trimEnd().slice(0, OTP_LENGTH));
      } else if (index > 0) {
        focus(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focus(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focus(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent): void => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted) {
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      focus(nextIndex);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex gap-2 sm:gap-3 justify-center"
        role="group"
        aria-label="One-time password input"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit.trim()}
            disabled={disabled}
            aria-label={`OTP digit ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={[
              "w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-[var(--radius-lg)]",
              "bg-[var(--input-bg)] text-[var(--text-primary)]",
              "border-2 transition-colors duration-[var(--transition-fast)]",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              digit.trim()
                ? "border-[var(--border-accent)] bg-violet-50 dark:bg-violet-950/20"
                : "border-[var(--input-border)]",
              error
                ? "border-red-500 focus:ring-red-500/30"
                : "focus:border-[var(--input-border-focus)] focus:ring-[var(--input-border-focus)]/30",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500 font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
}
