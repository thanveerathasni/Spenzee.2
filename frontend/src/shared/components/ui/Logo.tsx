import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/constants";

export interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  linkTo?: string | false;
  className?: string;
}

const sizeMap = {
  sm: { text: "text-lg", tagline: "text-[9px]" },
  md: { text: "text-2xl", tagline: "text-[10px]" },
  lg: { text: "text-3xl", tagline: "text-[11px]" },
  xl: { text: "text-4xl sm:text-5xl", tagline: "text-xs" },
};

function LogoContent({ size = "md", showTagline = false, className = "" }: LogoProps): React.JSX.Element {
  const s = sizeMap[size];

  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className={`font-serif ${s.text} font-medium tracking-tight text-[var(--text-primary)] transition-colors duration-300`}>
        Spenzee
      </span>
      {showTagline && (
        <span className={`font-sans ${s.tagline} text-[var(--text-tertiary)] uppercase tracking-[0.3em] font-light mt-1`}>
          Finance Reimagined
        </span>
      )}
    </div>
  );
}

export function Logo({ size = "md", showTagline = false, linkTo, className = "" }: LogoProps): React.JSX.Element {
  const destination = linkTo === false ? null : (linkTo ?? ROUTES.LANDING);

  if (destination === null) {
    return <LogoContent size={size} showTagline={showTagline} className={className} />;
  }

  return (
    <Link to={destination} aria-label="Spenzee — Go to home page" className={`focus:outline-none ${className}`}>
      <LogoContent size={size} showTagline={showTagline} />
    </Link>
  );
}
