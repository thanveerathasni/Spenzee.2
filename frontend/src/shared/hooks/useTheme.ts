import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { setTheme, type Theme } from "@/store/themeSlice";

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  const handleSetTheme = useCallback(
    (newTheme: Theme): void => {
      dispatch(setTheme(newTheme));
    },
    [dispatch],
  );

  const toggleTheme = useCallback((): void => {
    const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
    dispatch(setTheme(next));
  }, [dispatch, resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (): void => {
      document.documentElement.setAttribute(
        "data-theme",
        mq.matches ? "dark" : "light",
      );
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, resolvedTheme, setTheme: handleSetTheme, toggleTheme };
}
