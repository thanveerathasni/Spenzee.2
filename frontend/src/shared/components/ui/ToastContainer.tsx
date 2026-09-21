import { motion, AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect } from "react";
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXMark,
} from "react-icons/hi2";

import { useAppDispatch, useAppSelector } from "@/store";
import { removeNotification, type Notification, type NotificationType } from "@/store/notificationSlice";

const TOAST_DURATION_MS = 5000;

const toastConfig: Record<
  NotificationType,
  { icon: React.ReactNode; bgVar: string; borderVar: string; textVar: string }
> = {
  success: {
    icon: <HiCheckCircle className="h-5 w-5 flex-shrink-0" />,
    bgVar: "var(--toast-success-bg)",
    borderVar: "var(--toast-success-border)",
    textVar: "var(--toast-success-text)",
  },
  error: {
    icon: <HiXCircle className="h-5 w-5 flex-shrink-0" />,
    bgVar: "var(--toast-error-bg)",
    borderVar: "var(--toast-error-border)",
    textVar: "var(--toast-error-text)",
  },
  warning: {
    icon: <HiExclamationTriangle className="h-5 w-5 flex-shrink-0" />,
    bgVar: "var(--toast-warning-bg)",
    borderVar: "var(--toast-warning-border)",
    textVar: "var(--toast-warning-text)",
  },
  info: {
    icon: <HiInformationCircle className="h-5 w-5 flex-shrink-0" />,
    bgVar: "var(--toast-info-bg)",
    borderVar: "var(--toast-info-border)",
    textVar: "var(--toast-info-text)",
  },
};

interface ToastItemProps {
  notification: Notification;
}

function ToastItem({ notification }: ToastItemProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const config = toastConfig[notification.type];

  const dismiss = useCallback((): void => {
    dispatch(removeNotification(notification.id));
  }, [dispatch, notification.id]);

  useEffect(() => {
    const timer = setTimeout(dismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="alert"
      aria-live="polite"
      style={{
        backgroundColor: config.bgVar,
        borderColor: config.borderVar,
        color: config.textVar,
      }}
      className="flex items-start gap-3 p-4 rounded-[var(--radius-xl)] border shadow-lg max-w-sm w-full backdrop-blur-sm"
    >
      <span style={{ color: config.textVar }}>{config.icon}</span>
      <p className="flex-1 text-sm font-medium leading-snug">{notification.message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        style={{ color: config.textVar }}
        className="p-0.5 opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
      >
        <HiXMark className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer(): React.JSX.Element {
  const notifications = useAppSelector((state) => state.notification.items);

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="sync">
        {notifications.map((notification: Notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <ToastItem notification={notification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
