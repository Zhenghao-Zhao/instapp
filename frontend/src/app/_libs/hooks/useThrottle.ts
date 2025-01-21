import { useEffect, useState } from "react";

const MIN_TIMEOUT = 200;

export default function useThrottle(
  func: () => void,
  dependency: any,
  timeout = MIN_TIMEOUT
) {
  const [timer, setTimer] = useState<number | undefined>();

  useEffect(() => {
    throttle();
    return () => clearTimeout(timer);
  }, [dependency]);

  const throttle = () => {
    if (!timer) {
      func();
    }
    clearTimeout(timer);
    setTimer(
      window.setTimeout(() => {
        setTimer(undefined);
      }, timeout)
    );
  };

  return null;
}
