import React, { useLayoutEffect, useRef } from "react";

export type DragBarStyle = {
  knobColor: string;
  railColor: string;
};

const defaultStyle: DragBarStyle = {
  knobColor: "black",
  railColor: "gray",
};

export default function Dragbar({
  currentValue,
  changeValue,
  onKnobRelease,
  style = defaultStyle,
  minValue = 0,
  maxValue = 1,
}: {
  currentValue: number;
  changeValue: (s: number) => void;
  onKnobRelease?: () => void;
  style?: DragBarStyle;
  minValue?: number;
  maxValue?: number;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const mouseStartX = useRef(0);
  const translateRef = useRef(0);
  const prevRef = useRef(0);

  useLayoutEffect(() => {
    if (!railRef.current || !knobRef.current) return;
    translateRef.current =
      ((currentValue - minValue) / (maxValue - minValue)) *
      (railRef.current.offsetWidth - knobRef.current.offsetWidth);
    knobRef.current.style.transform = `translate(${translateRef.current}px)`;
  }, [currentValue, minValue, maxValue]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    mouseStartX.current = e.clientX;
    prevRef.current = translateRef.current;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!railRef.current || !knobRef.current) return;
    translateRef.current = Math.min(
      Math.max(e.clientX - mouseStartX.current + prevRef.current, 0),
      railRef.current.offsetWidth - knobRef.current.offsetWidth,
    );
    changeValue(
      minValue +
        ((maxValue - minValue) * translateRef.current) /
          (railRef.current.offsetWidth - knobRef.current.offsetWidth),
    );
  };
  const handleMouseUp = () => {
    if (typeof onKnobRelease === "function") onKnobRelease();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex items-center w-full h-[45px]">
      <div
        ref={railRef}
        className="w-full border-2 border-x-0 border-t-0 border-solid flex items-center relative"
        style={{ borderColor: `${style.railColor}` }}
      >
        <div
          ref={knobRef}
          className="rounded-full w-4 h-4 absolute"
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${translateRef.current}px)`,
            backgroundColor: `${style.knobColor}`,
          }}
        />
      </div>
    </div>
  );
}
