import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

import { AuthEditorialPanel } from "@/modules/auth/components/AuthEditorialPanel";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { ROUTES } from "@/shared/constants";

export interface AuthLayoutProps {
  children: React.ReactNode;
  editorialTagline?: string;
  editorialHeadingLine1?: string;
  editorialHeadingLine2?: string;
  editorialHeadingAccent?: string;
  editorialDescription?: string;
  stats?: Array<[string, string]>;
}

export function AuthLayout({
  children,
  editorialTagline = "Finance Reimagined",
  editorialHeadingLine1 = "Own",
  editorialHeadingLine2 = "Your",
  editorialHeadingAccent = "Money.",
  editorialDescription = "Smart expense tracking built for people who take their finances seriously.",
  stats,
}: AuthLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex overflow-hidden font-sans transition-colors duration-700">
      {/* ── LEFT PANEL (Desktop Editorial Panel) ── */}
      <AuthEditorialPanel
        tagline={editorialTagline}
        headingLine1={editorialHeadingLine1}
        headingLine2={editorialHeadingLine2}
        headingAccent={editorialHeadingAccent}
        description={editorialDescription}
        stats={stats}
      />

      {/* ── RIGHT PANEL (Form Area) ── */}
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-20 xl:px-28 py-10 sm:py-16 overflow-y-auto">
        {/* Top Header bar with ThemeToggle & Mobile Logo */}
        <div className="flex items-center justify-between mb-10 w-full max-w-sm mx-auto lg:max-w-none">
          <Link to={ROUTES.LANDING} className="lg:hidden">
            <span className="font-serif text-lg font-medium tracking-[0.2em] uppercase text-[var(--text-primary)]">
              Spenzee
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto my-auto">
          {children}
        </div>

        {/* Mobile Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden text-[var(--text-tertiary)] text-[10px] tracking-[0.3em] uppercase text-center mt-12 font-medium"
        >
          © {new Date().getFullYear()} Spenzee Studios
        </motion.p>
      </div>
    </div>
  );
}
