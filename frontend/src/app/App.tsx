import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import type { Theme } from "@/store/themeSlice";

import { AppRoutes } from "@/routes/AppRoutes";
import { authStorage } from "@/shared/api";
import { ToastContainer } from "@/shared/components";
import { setSession } from "@/store/authSlice";
import { useAppSelector } from "@/store/hooks";
import { store } from "@/store/store";


const session = authStorage.getSession();

if (session) {
  store.dispatch(setSession(session));
}

/* ---------------------------------------------------------
   Theme synchronisation — runs inside the Redux Provider
--------------------------------------------------------- */
function ThemeManager(): null {
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", mode);
    }

    // Persist preference
    try {
      localStorage.setItem("spenzee_theme", mode);
    } catch {
      /* storage may be unavailable */
    }
  }, [mode]);

  // Watch system preference changes
  useEffect(() => {
    if (mode !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent): void => {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  return null;
}

/* ---------------------------------------------------------
   Restore theme from localStorage on startup
--------------------------------------------------------- */
function restoreTheme(): void {
  try {
    const saved = localStorage.getItem("spenzee_theme") as Theme | null;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      store.dispatch({ type: "theme/setTheme", payload: saved });
    }
  } catch {
    /* storage may be unavailable */
  }
}

restoreTheme();

export function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeManager />
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}
