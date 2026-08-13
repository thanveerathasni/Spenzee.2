import React from "react";
import { Link } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { Button } from "@/shared/components/ui";
import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
import { AuthLayout } from "@/shared/layouts";

export function LogoutSuccessPage(): React.JSX.Element {
  return (
    <AuthLayout
      editorialTagline="Secure Sign Out"
      editorialHeadingLine1="You"
      editorialHeadingLine2="Have"
      editorialHeadingAccent="Signed Out."
      editorialDescription="Your session has ended safely. Come back anytime."
    >
      <AuthHeader
        category="Session Terminated"
        title={`Signed\nOut.`}
        subtitle={AUTH_MESSAGES.LOGOUT.SUBTITLE}
      />

      <div className="border-t border-[var(--border-default)] pt-10 mt-4 max-w-sm w-full">
        <Link to={ROUTES.LOGIN}>
          <Button showArrowBox arrowText="Login">
            {AUTH_MESSAGES.LOGOUT.LOGIN_BUTTON}
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
