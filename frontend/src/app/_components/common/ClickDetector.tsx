import { PropsWithChildren, useEffect, useRef } from "react";

type Props = PropsWithChildren<{
  className?: string;
  onClickOutside?: () => void;
  onClickInside?: () => void;
}>;

export default function ClickDetector({
  className,
  onClickOutside,
  onClickInside,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside && onClickOutside();
      } else {
        onClickInside && onClickInside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
