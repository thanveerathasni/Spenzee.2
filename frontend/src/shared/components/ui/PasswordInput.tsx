import React, { useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

import { Input, type InputProps } from "./Input";

type PasswordInputProps = Omit<InputProps, "type" | "rightElement">;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);

    const toggle = (): void => setVisible((prev) => !prev);

    return (
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        rightElement={
          <button
            type="button"
            onClick={toggle}
            aria-label={visible ? "Hide password" : "Show password"}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] rounded"
          >
            {visible ? <HiEyeSlash className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    );
  },
);
