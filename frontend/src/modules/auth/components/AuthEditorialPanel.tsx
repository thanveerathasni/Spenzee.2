import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/constants";

export interface AuthEditorialPanelProps {
  tagline?: string;
  headingLine1?: string;
  headingLine2?: string;
  headingAccent?: string;
  description?: string;
  stats?: Array<[string, string]>;
}

export function AuthEditorialPanel({
  tagline = "Finance Reimagined",
  headingLine1 = "Own",
  headingLine2 = "Your",
  headingAccent = "Money.",
  description = "Smart expense tracking built for people who take their finances seriously.",
  stats = [
    ["10K+", "Users"],
    ["99.9%", "Uptime"],
    ["4.9★", "Rating"],
  ],
}: AuthEditorialPanelProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex flex-col justify-between w-[42%] xl:w-[45%] relative overflow-hidden p-14 bg-[var(--bg-panel)] select-none border-r border-[var(--border-subtle)]"
      style={{ background: "var(--bg-panel-gradient)" }}
    >
      {/* Vertical ruled lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.1 * i, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 bottom-0 w-px bg-[var(--ruled-line-color)] origin-top"
          style={{ left: `${(i + 1) * 16}%` }}
        />
      ))}

      {/* Background serif watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-20 -right-10 text-[22rem] font-serif font-black leading-none pointer-events-none text-[var(--watermark-color)]"
      >
        S
      </motion.div>

      {/* Top Brand Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Link to={ROUTES.LANDING} className="w-fit block">
          <p className="text-[var(--text-primary)] text-base font-serif font-medium tracking-[0.25em] uppercase">
            Spenzee
          </p>
        </Link>
      </motion.div>

      {/* Center Copy */}
      <div className="space-y-8 relative z-10 my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Accent tag */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[var(--border-strong)]" />
            <span className="text-[10px] text-[var(--text-tertiary)] tracking-[0.35em] uppercase font-bold">
              {tagline}
            </span>
          </div>

          <h2 className="text-[3.8rem] xl:text-[4.4rem] font-black text-[var(--text-primary)] leading-[0.93] tracking-[-0.03em] uppercase">
            {headingLine1}
            <br />
            {headingLine2}
            <br />
            <span className="text-[var(--text-tertiary)]">{headingAccent}</span>
          </h2>
        </motion.div>

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-[280px] font-light"
          >
            {description}
          </motion.p>
        )}

        {/* Stats Row */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex gap-8 pt-4"
          >
            {stats.map(([num, label]) => (
              <div key={label}>
                <p className="text-[var(--text-primary)] text-lg font-black tracking-tight">{num}</p>
                <p className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest font-bold">{label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer copyright */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-[var(--text-tertiary)] text-[10px] tracking-[0.3em] uppercase relative z-10 font-medium"
      >
        © {new Date().getFullYear()} Spenzee Studios
      </motion.p>
    </motion.div>
  );
}
