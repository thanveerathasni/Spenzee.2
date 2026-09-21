import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

interface UseCountdownReturn {
  seconds: number;
  isActive: boolean;
  isComplete: boolean;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
}

export function useCountdown({
  initialSeconds,
  autoStart = false,
  onComplete,
}: UseCountdownOptions): UseCountdownReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      setSeconds(newSeconds ?? initialSeconds);
      setIsActive(true);
    },
    [clearTimer, initialSeconds],
  );

  useEffect(() => {
    if (!isActive) return;

    if (seconds <= 0) {
      setIsActive(false);
      clearTimer();
      onComplete?.();
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [isActive, seconds, clearTimer, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

  return {
    seconds,
    isActive,
    isComplete: seconds === 0,
    formattedTime,
    start,
    pause,
    reset,
  };
}
