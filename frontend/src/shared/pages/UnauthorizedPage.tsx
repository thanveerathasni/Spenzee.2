import { motion } from "framer-motion";
import React from "react";
import { HiShieldExclamation, HiArrowLeft, HiHome } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

import { Button, ThemeToggle } from "@/shared/components";
import { ROUTES } from "@/shared/constants";

export function UnauthorizedPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.35 }}
            className="flex justify-center mb-8"
          >
            <div
              className="flex items-center justify-center w-28 h-28 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <HiShieldExclamation className="h-14 w-14 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold uppercase tracking-wide">
              403 — Forbidden
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Access denied
            </h1>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-sm">
              You don&apos;t have permission to view this page. Contact your administrator if you
              believe this is a mistake.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link to={ROUTES.DASHBOARD}>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<HiHome className="h-4 w-4" />}
                  className="min-w-[160px]"
                >
                  Dashboard
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium rounded-[var(--radius-lg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors min-w-[160px]"
              >
                <HiArrowLeft className="h-4 w-4" />
                Go back
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
