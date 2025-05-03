import { useCallback, useRef } from "react";

export type IntersectionObserverType = {
  onIntersect: () => void;
  onHidden?: () => void;
  isReady?: boolean;
};

export default function useIntersectionObserver({
  onIntersect,
  onHidden,
  isReady = true,
}: IntersectionObserverType) {
  const observer = useRef<IntersectionObserver>();
  const observerRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (!isReady) return;
        if (entries[0].isIntersecting) {
          onIntersect();
        } else if (onHidden !== undefined) {
          onHidden();
        }
      });
      observer.current.observe(node);
    },
    [isReady, onIntersect, onHidden],
  );
  return observerRef;
}
