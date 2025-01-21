import { useState } from "react";
import useIntersectionObserver from "./useIntersectionObserver";

export default function useEndOfCarousel() {
  const [leftDisabled, setLeftDisabled] = useState(false);
  const [rightDisabled, setRightDisabled] = useState(false);

  const leftRef = useIntersectionObserver({
    onIntersect: () => {
      setLeftDisabled(true);
    },
    onHidden: () => setLeftDisabled(false),
  });

  const rightRef = useIntersectionObserver({
    onIntersect: () => {
      setRightDisabled(true);
    },
    onHidden: () => setRightDisabled(false),
  });

  return { leftRef, rightRef, leftDisabled, rightDisabled };
}
