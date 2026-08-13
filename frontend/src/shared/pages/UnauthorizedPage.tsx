import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { Button } from "@/shared/components/ui";
import { ROUTES } from "@/shared/constants";
import { AuthLayout } from "@/shared/layouts";

export function UnauthorizedPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <AuthLayout
      editorialTagline="Security Restrictions"
      editorialHeadingLine1="Access"
      editorialHeadingLine2="Is"
      editorialHeadingAccent="Denied."
      editorialDescription="You do not have authorization to view this resource."
    >
      <AuthHeader
        category="403 Forbidden"
        title={`Access\nDenied.`}
        subtitle="You don't have permission to view this page. Contact your administrator if you believe this is a mistake."
      />

      <div className="border-t border-[var(--border-default)] pt-10 mt-4 max-w-sm w-full flex flex-col gap-4">
        <Link to={ROUTES.DASHBOARD}>
          <Button showArrowBox arrowText="Home">
            Go to dashboard
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
