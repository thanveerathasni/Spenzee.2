import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  linkTo?: string | false;
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg", tagline: "text-xs" },
  md: { icon: 32, text: "text-xl", tagline: "text-xs" },
  lg: { icon: 40, text: "text-2xl", tagline: "text-sm" },
};

function SpenzeeIcon({ size }: { size: number }): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
      <path
        d="M12 22C12 22 13.5 26 20 26C26.5 26 28 22 28 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 14V26M16 18L20 14L24 18"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LogoContent({ size = "md", showTagline = false }: LogoProps): React.JSX.Element {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5">
      <SpenzeeIcon size={s.icon} />
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-bold tracking-tight text-[var(--text-primary)]`}>
          Spenzee
        </span>
        {showTagline && (
          <span className={`${s.tagline} text-[var(--text-tertiary)] font-medium`}>
            Smart Expense Tracker
          </span>
        )}
      </div>
    </div>
  );
}

export function Logo({ size = "md", showTagline = false, linkTo }: LogoProps): React.JSX.Element {
  const destination = linkTo === false ? null : (linkTo ?? ROUTES.LANDING);

  if (destination === null) {
    return <LogoContent size={size} showTagline={showTagline} />;
  }

  return (
    <Link to={destination} aria-label="Spenzee — Go to home page" className="focus:outline-none">
      <LogoContent size={size} showTagline={showTagline} />
    </Link>
  );
}
