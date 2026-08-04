import { motion } from "framer-motion";
import React from "react";
import { HiChartBarSquare, HiCreditCard, HiArrowTrendingUp, HiSparkles } from "react-icons/hi2";

import { useAppSelector } from "@/store";

const STAT_CARDS = [
  {
    icon: <HiChartBarSquare className="h-5 w-5" />,
    label: "Total Spent",
    value: "$0.00",
    change: "Start tracking today",
    color: "#8b5cf6",
  },
  {
    icon: <HiCreditCard className="h-5 w-5" />,
    label: "Transactions",
    value: "0",
    change: "No transactions yet",
    color: "#3b82f6",
  },
  {
    icon: <HiArrowTrendingUp className="h-5 w-5" />,
    label: "Budget Used",
    value: "0%",
    change: "Set your first budget",
    color: "#22c55e",
  },
];

export function DashboardPlaceholder(): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <HiSparkles className="h-5 w-5 text-violet-500" />
          <span className="text-sm font-medium text-violet-500">Welcome back</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
          Hello, {user?.firstName ?? "there"}! 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here&apos;s an overview of your finances. Start adding expenses to see your insights.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex flex-col gap-3 p-5 rounded-[var(--radius-xl)] border border-[var(--card-border)] bg-[var(--card-bg)]"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: `${card.color}18`, color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">{card.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Getting started call-to-action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center justify-center gap-4 py-16 rounded-[var(--radius-2xl)] border-2 border-dashed border-[var(--border-default)] text-center"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 text-3xl">
          💸
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Ready to track your expenses?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs">
            Add your first expense to start seeing your spending pattern and insights.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium">
          <HiSparkles className="h-4 w-4" />
          Dashboard features coming soon
        </div>
      </motion.div>
    </div>
  );
}
