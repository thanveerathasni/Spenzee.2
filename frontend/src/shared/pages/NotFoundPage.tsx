import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

import { Button, ThemeToggle } from "@/shared/components";
import { ROUTES } from "@/shared/constants";

export function NotFoundPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative mb-8 select-none"
          >
            <div
              className="text-[10rem] sm:text-[14rem] font-black leading-none"
              style={{
                background: "linear-gradient(135deg, var(--border-default), var(--border-subtle))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-5xl sm:text-7xl pointer-events-none"
            >
              🔍
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Page not found
            </h1>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-sm">
              Looks like this page has vanished into thin air. Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link to={ROUTES.LANDING}>
                <Button variant="accent" size="md" className="min-w-[140px]">
                  Go home
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-[var(--radius-lg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors min-w-[140px]"
              >
                Go back
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
