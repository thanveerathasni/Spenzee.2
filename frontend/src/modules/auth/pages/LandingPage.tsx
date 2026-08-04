import { motion, type Variants } from "framer-motion";
import React from "react";
import {
  HiArrowRight,
  HiChartBarSquare,
  HiShieldCheck,
  HiBoltSlash,
  HiSparkles,
  HiBolt,
  HiCreditCard,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

import { Button, Logo, ThemeToggle } from "@/shared/components";
import { ROUTES } from "@/shared/constants";

/* =========================================================
   CONSTANTS
   ========================================================= */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
];

const FEATURES = [
  {
    icon: <HiChartBarSquare className="h-6 w-6" />,
    title: "Smart Analytics",
    description:
      "Visualize your spending habits with intuitive charts. Understand where every dollar goes at a glance.",
    color: "#8b5cf6",
  },
  {
    icon: <HiShieldCheck className="h-6 w-6" />,
    title: "Bank-Grade Security",
    description:
      "Your financial data is protected with AES-256 encryption. Privacy is our top priority.",
    color: "#3b82f6",
  },
  {
    icon: <HiBolt className="h-6 w-6" />,
    title: "Real-Time Sync",
    description:
      "All your expenses sync instantly across all your devices. Always up to date, everywhere.",
    color: "#22c55e",
  },
  {
    icon: <HiCreditCard className="h-6 w-6" />,
    title: "Multi-Account Support",
    description:
      "Track expenses across multiple accounts, cards, and wallets in one unified dashboard.",
    color: "#f59e0b",
  },
  {
    icon: <HiSparkles className="h-6 w-6" />,
    title: "AI-Powered Insights",
    description:
      "Get personalized recommendations to optimize your spending and reach your savings goals faster.",
    color: "#ec4899",
  },
  {
    icon: <HiBoltSlash className="h-6 w-6" />,
    title: "Budget Alerts",
    description:
      "Set spending limits and receive smart alerts before you overspend on any category.",
    color: "#14b8a6",
  },
];

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "$2M+", label: "Expenses Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" },
];

/* =========================================================
   ANIMATION VARIANTS
   ========================================================= */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

/* =========================================================
   LANDING PAGE
   ========================================================= */

export function LandingPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Logo size="md" linkTo={false} />

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface-2)] transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="accent" size="sm" rightIcon={<HiArrowRight className="h-4 w-4" />}>
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium"
            >
              <HiSparkles className="h-4 w-4" />
              Your finances, beautifully organized
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Spend smarter,
              <span
                className="block gradient-text"
              >
                save more.
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.2}
              className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Spenzee turns your daily expenses into powerful insights. Track spending, set budgets,
              and achieve your financial goals — all in one beautiful dashboard.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={ROUTES.REGISTER}>
                <Button
                  variant="accent"
                  size="lg"
                  rightIcon={<HiArrowRight className="h-5 w-5" />}
                  className="min-w-[180px] shadow-lg shadow-violet-500/25"
                >
                  Start for free
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" size="lg" className="min-w-[180px]">
                  Sign in
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.4}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto"
            >
              {STATS.map((stat) => (
                <div key={stat.value} className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</span>
                  <span className="text-sm text-[var(--text-tertiary)]">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 border-t border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-500 mb-3">
                  Features
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                  Everything you need to manage money
                </h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                  Powerful tools designed to give you complete visibility and control over your finances.
                </p>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col gap-4 p-6 rounded-[var(--radius-xl)] border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--border-strong)] hover:shadow-[var(--card-shadow)] transition-all duration-300"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: `${feature.color}18`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section id="benefits" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-500 mb-3">
                  Why Spenzee
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
                  Built for people who care about their money
                </h2>
                <div className="flex flex-col gap-6">
                  {[
                    {
                      icon: "🎯",
                      title: "Set meaningful goals",
                      desc: "Define financial targets and let Spenzee guide you every step of the way.",
                    },
                    {
                      icon: "📱",
                      title: "Access anywhere",
                      desc: "Works seamlessly on desktop, tablet, and mobile. Your data follows you.",
                    },
                    {
                      icon: "🔔",
                      title: "Stay informed",
                      desc: "Smart notifications keep you on track without overwhelming you.",
                    },
                  ].map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-lg">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-0.5">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Mock dashboard card */}
                <div className="rounded-[var(--radius-2xl)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wide mb-1">Total Spent</p>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">$4,285.60</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                      ↓ 12% this month
                    </div>
                  </div>
                  {/* Fake bar chart */}
                  <div className="flex items-end gap-2 h-24 mb-4">
                    {[60, 85, 45, 90, 70, 55, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          background: i === 4
                            ? "linear-gradient(180deg, #8b5cf6, #6d28d9)"
                            : "var(--bg-surface-2)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-3">
                    {[
                      { label: "Food", amount: "$840", color: "#8b5cf6" },
                      { label: "Transport", amount: "$320", color: "#3b82f6" },
                      { label: "Shopping", amount: "$560", color: "#ec4899" },
                    ].map((cat) => (
                      <div key={cat.label} className="flex flex-col gap-1">
                        <div className="h-1 rounded-full" style={{ backgroundColor: cat.color }} />
                        <p className="text-[10px] text-[var(--text-tertiary)]">{cat.label}</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{cat.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 border-t border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600/10 text-violet-600 text-3xl">
                💸
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                Ready to take control?
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl">
                Join thousands of users who have transformed their relationship with money. Start free today — no credit card required.
              </p>
              <Link to={ROUTES.REGISTER}>
                <Button
                  variant="accent"
                  size="lg"
                  rightIcon={<HiArrowRight className="h-5 w-5" />}
                  className="shadow-lg shadow-violet-500/25"
                >
                  Create your free account
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline linkTo={false} />
          <p className="text-sm text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} Spenzee. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
