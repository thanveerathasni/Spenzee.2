import { useCallback, useState } from "react";

interface UsePasswordVisibilityReturn {
  isVisible: boolean;
  type: "password" | "text";
  toggle: () => void;
  show: () => void;
  hide: () => void;
}

export function usePasswordVisibility(
  initialState = false,
): UsePasswordVisibilityReturn {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    type: isVisible ? "text" : "password",
    toggle,
    show,
    hide,
  };
}
