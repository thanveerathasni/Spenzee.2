import { motion } from "framer-motion";
import React from "react";
import { HiUser, HiChevronDown } from "react-icons/hi2";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Logo, ThemeToggle } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { useAppDispatch, useAppSelector } from "@/store";
import { logoutThunk } from "@/store/authThunks";

export function AppLayout(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = (): void => {
    void dispatch(logoutThunk()).then(() => navigate(ROUTES.LOGIN));
  };

  const initials =
    user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md">
        <Logo size="sm" />

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to={ROUTES.DASHBOARD}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-[var(--radius-lg)] transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface-2)] transition-colors group"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
                {user?.firstName ?? "User"}
              </span>
              <HiChevronDown
                className={`h-4 w-4 text-[var(--text-tertiary)] transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-[var(--radius-xl)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <HiUser className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
