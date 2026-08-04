import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

import { Logo, ThemeToggle } from "@/shared/components";
import { ROUTES } from "@/shared/constants";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const FEATURES = [
  {
    icon: "📊",
    title: "Smart Analytics",
    description: "Visualize spending patterns with beautiful charts",
  },
  {
    icon: "🔒",
    title: "Bank-Grade Security",
    description: "Your data is encrypted and protected at all times",
  },
  {
    icon: "⚡",
    title: "Real-Time Sync",
    description: "All your expenses synced instantly across devices",
  },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex bg-[var(--bg-base)]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col relative overflow-hidden bg-[var(--bg-surface-2)]">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />

        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-2xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <Link to={ROUTES.LANDING} className="w-fit">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-xl">💸</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Spenzee</span>
            </div>
          </Link>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-white/80">Trusted by 10,000+ users</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Take control of
                <span className="block" style={{
                  background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  your finances
                </span>
              </h1>

              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                The intelligent expense tracker that turns your spending data into actionable insights.
              </p>
            </motion.div>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-colors">
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{feature.title}</p>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Spenzee. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-6 pt-6 lg:justify-end">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <ThemeToggle />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px]"
          >
            {(title ?? subtitle) && (
              <div className="mb-8 text-center lg:text-left">
                {title && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="mt-2 text-[var(--text-secondary)] text-sm leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
