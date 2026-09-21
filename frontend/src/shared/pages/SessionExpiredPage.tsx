import React from "react";
import { Link } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { Button } from "@/shared/components/ui";
import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
import { AuthLayout } from "@/shared/layouts";

export function SessionExpiredPage(): React.JSX.Element {
  return (
    <AuthLayout
      editorialTagline="Security Cooldown"
      editorialHeadingLine1="Session"
      editorialHeadingLine2="Has"
      editorialHeadingAccent="Expired."
      editorialDescription="For your privacy and protection, sessions automatically expire after inactivity."
    >
      <AuthHeader
        category="Timeout Notice"
        title={`Session\nExpired.`}
        subtitle={AUTH_MESSAGES.SESSION_EXPIRED.SUBTITLE}
      />

      <div className="border-t border-[var(--border-default)] pt-10 mt-4 max-w-sm w-full">
        <Link to={ROUTES.LOGIN}>
          <Button showArrowBox arrowText="Sign in">
            {AUTH_MESSAGES.SESSION_EXPIRED.LOGIN_BUTTON}
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
