import { useCallback } from "react";

import { useAppDispatch } from "@/store";
import { addNotification, type NotificationType } from "@/store/notificationSlice";

interface UseToastReturn {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
  };
}

export function useToast(): UseToastReturn {
  const dispatch = useAppDispatch();

  const show = useCallback(
    (message: string, type: NotificationType): void => {
      dispatch(addNotification(message, type));
    },
    [dispatch],
  );

  return {
    toast: {
      success: (message: string) => show(message, "success"),
      error: (message: string) => show(message, "error"),
      warning: (message: string) => show(message, "warning"),
      info: (message: string) => show(message, "info"),
    },
  };
}
