import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { Button } from "@/shared/components/ui";
import { ROUTES } from "@/shared/constants";
import { AuthLayout } from "@/shared/layouts";

export function NotFoundPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <AuthLayout
      editorialTagline="404 Error"
      editorialHeadingLine1="Page"
      editorialHeadingLine2="Not"
      editorialHeadingAccent="Found."
      editorialDescription="The path you requested could not be located in our ledger."
    >
      <AuthHeader
        category="404 Missing"
        title={`Page\nLost.`}
        subtitle="Looks like this page has vanished into thin air. Let's get you back on track."
      />

      <div className="border-t border-[var(--border-default)] pt-10 mt-4 max-w-sm w-full flex flex-col gap-4">
        <Link to={ROUTES.LANDING}>
          <Button showArrowBox arrowText="Home">
            Return home
          </Button>
        </Link>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase font-bold text-left pt-2"
        >
          ← Go back
        </button>
      </div>
    </AuthLayout>
  );
}
