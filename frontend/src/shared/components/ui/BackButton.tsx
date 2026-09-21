import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

export interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ to, onClick, label = "Back", className = "" }: BackButtonProps): React.JSX.Element {
  const content = (
    <motion.div
      whileHover={{ x: -3 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer select-none ${className}`}
    >
      <span>←</span>
      <span>{label}</span>
    </motion.div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="focus:outline-none">
      {content}
    </button>
  );
}
