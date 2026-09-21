import { motion, type Variants } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

import { Button, Logo, ThemeToggle } from "@/shared/components/ui";
import { ROUTES } from "@/shared/constants";

const FEATURES = [
  {
    num: "01",
    title: "Smart Analytics",
    description: "Visualize spending patterns with clear monochrome metrics. Understand cashflow instantly.",
  },
  {
    num: "02",
    title: "Bank-Grade Security",
    description: "End-to-end AES-256 encryption. Your privacy and financial data stay completely private.",
  },
  {
    num: "03",
    title: "Real-Time Sync",
    description: "Multi-device synchronization. Every transaction logs instantaneously across sessions.",
  },
  {
    num: "04",
    title: "Multi-Account",
    description: "Unify bank accounts, credit cards, and digital wallets into a singular editorial ledger.",
  },
  {
    num: "05",
    title: "AI Budget Intelligence",
    description: "Personalized algorithmic insights to eliminate wasteful recurring expenses.",
  },
  {
    num: "06",
    title: "Budget Alerts",
    description: "Automated threshold notifications before you overspend in any active category.",
  },
];

const STATS = [
  { value: "10K+", label: "ACTIVE USERS" },
  { value: "$2M+", label: "TRACKED MONTHLY" },
  { value: "99.9%", label: "SYSTEM UPTIME" },
  { value: "4.9★", label: "USER RATING" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function LandingPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] font-sans transition-colors duration-700">
      {/* ── HEADER NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between h-20">
          <Logo size="md" showTagline />

          <div className="flex items-center gap-4 sm:gap-6">
            <ThemeToggle />
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-28 sm:pt-36 sm:pb-40 overflow-hidden border-b border-[var(--border-subtle)]">
          {/* Subtle vertical ruled lines background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-[var(--border-default)]"
                style={{ left: `${(i + 1) * 20}%` }}
              />
            ))}
          </div>

          <div className="relative max-w-5xl mx-auto px-6 sm:px-12 text-center">
            {/* Tagline Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 border border-[var(--border-strong)] bg-[var(--bg-surface-2)] text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--text-tertiary)]"
            >
              <span>Finance Reimagined</span>
            </motion.div>

            {/* Editorial Title */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-[-0.04em] leading-[0.9] mb-8"
            >
              Spend Smarter.
              <br />
              <span className="text-[var(--text-tertiary)] font-serif font-light lowercase italic tracking-tight">
                save more.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.2}
              className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-12 font-light leading-relaxed"
            >
              Spenzee turns daily expenses into clear financial intelligence. Track transactions, control budgets, and achieve financial clarity.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.3}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to={ROUTES.REGISTER}>
                <Button showArrowBox arrowText="Start" size="xl">
                  Create account
                </Button>
              </Link>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.4}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-24 pt-12 border-t border-[var(--border-default)] max-w-4xl mx-auto"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1 select-none">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-28 border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-tertiary)] mb-3">
                Capabilities
              </p>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-[-0.03em] leading-none text-[var(--text-primary)]">
                Built For Precision.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group flex flex-col justify-between p-8 border border-[var(--border-default)] bg-[var(--bg-surface-2)] hover:border-[var(--text-primary)] transition-colors duration-300 min-h-[220px]"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[11px] font-mono font-bold text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {feature.num}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[var(--border-strong)] group-hover:bg-[var(--text-primary)] transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--text-primary)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-28 border-b border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
                Get Started
              </span>

              <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-[-0.03em] leading-none text-[var(--text-primary)]">
                Ready to take control?
              </h2>

              <p className="text-base text-[var(--text-secondary)] max-w-lg font-light leading-relaxed">
                Join thousands of individuals managing money with precision and simplicity.
              </p>

              <Link to={ROUTES.REGISTER}>
                <Button showArrowBox arrowText="Join" size="xl">
                  Create your account
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" showTagline />
          <p className="text-[10px] text-[var(--text-tertiary)] tracking-[0.3em] uppercase font-medium">
            © {new Date().getFullYear()} Spenzee Studios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
