"use client";

import { useDropdownContext } from "@/app/_contexts/providers/DropdownContextProvider";
import { getOverlayPosition } from "@/app/_libs/utils";
import { DropdownPosition } from "@/app/_libs/vars/types";
import { PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";

export default function DropdownContent({ children }: PropsWithChildren) {
  const [position, setPosition] = useState<DropdownPosition>({
    left: 0,
    top: 0,
  });
  const { show, contentRef, triggerRef } = useDropdownContext();

  useEffect(() => {
    function resetDropdownPos() {
      getOverlayPosition(triggerRef, contentRef, setPosition);
    }
    window.addEventListener("resize", resetDropdownPos);
    return () => window.removeEventListener("resize", resetDropdownPos);
  }, []);

  useLayoutEffect(() => {
    if (!show || !triggerRef.current || !contentRef.current) return;
    getOverlayPosition(triggerRef, contentRef, setPosition);
  }, [show, triggerRef, contentRef]);

  let style = {
    left: position.left + "px",
    top: position.top + "px",
  };

  if (!show) return null;

  return (
    <div
      style={style}
      ref={contentRef}
      className="fixed shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-modal-primary rounded-lg overflow-hidden"
    >
      {children}
    </div>
  );
}
