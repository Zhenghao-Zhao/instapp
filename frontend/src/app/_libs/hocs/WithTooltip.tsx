import React, { useRef, useState } from "react";

type TipType = {
  tip?: string | null | undefined;
};

export type Position = {
  left: number;
  top: number;
  arrowLeft: number;
};

export const getPosition = (
  node: HTMLElement,
  overlay: HTMLElement
): Position => {
  const rect = node.getBoundingClientRect();
  const nodePosition = {
    left: rect.left + node.offsetWidth / 2,
    top: rect.top + node.offsetHeight,
  };
  const tooltipLeft = Math.max(
    0,
    Math.min(
      nodePosition.left - overlay.offsetWidth / 2,
      document.documentElement.offsetWidth - overlay.offsetWidth - 8
    )
  );
  return {
    left: tooltipLeft,
    top: nodePosition.top + 5,
    arrowLeft: nodePosition.left - tooltipLeft - 4,
  };
};

export default function withTooltip<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  function WithTooltip(props: P & TipType) {
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState<Position>({
      left: 0,
      top: 0,
      arrowLeft: 0,
    });
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>): void => {
      if (e.target === null || tooltipRef.current === null) return;
      const node = e.currentTarget as HTMLElement;
      const tooltip = tooltipRef.current;

      const newPosition = getPosition(node, tooltip);
      setPosition(newPosition);
      setShow(true);
    };

    const handleMouseLeave = () => {
      setShow(false);
    };

    let style = {
      left: position.left + "px",
      top: position.top + "px",
    };

    let arrowStyle = {
      left: position.arrowLeft + "px",
    };

    if (!props.tip) {
      return <WrappedComponent {...(props as P)} />;
    }

    return (
      <div>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <WrappedComponent {...(props as P)} />
        </div>
        <div
          ref={tooltipRef}
          style={style}
          className={`${
            !show && "invisible"
          } fixed text-xs bg-tooltip-primary text-tooltip-text rounded-sm p-1 z-50 ${
            show && "delay-[800ms]"
          } transition-visibility w-max`}
          role="tooltip"
        >
          <div
            style={arrowStyle}
            className="absolute top-0 -translate-y-1/2 rotate-45 w-2 h-2 bg-tooltip-primary"
          />
          <p>{props.tip}</p>
        </div>
      </div>
    );
  }

  return WithTooltip;
}
