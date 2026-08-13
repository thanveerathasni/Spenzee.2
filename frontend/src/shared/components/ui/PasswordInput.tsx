import React from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

import { usePasswordVisibility } from "@/shared/hooks/usePasswordVisibility";

import { Input, type InputProps } from "./Input";

export type PasswordInputProps = Omit<InputProps, "type" | "rightElement">;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const { isVisible, type, toggle } = usePasswordVisibility(false);

    return (
      <Input
        ref={ref}
        type={type}
        rightElement={
          <button
            type="button"
            onClick={toggle}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:outline-none"
          >
            {isVisible ? (
              <HiEyeSlash className="h-4 w-4" />
            ) : (
              <HiEye className="h-4 w-4" />
            )}
          </button>
        }
        {...props}
      />
    );
  },
);
