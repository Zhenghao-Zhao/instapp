import { useDropdownContext } from "@/app/_contexts/providers/DropdownContextProvider";
import { PropsWithChildren } from "react";

export default function DropdownTrigger({ children }: PropsWithChildren) {
  const { show, setShow, triggerRef } = useDropdownContext();
  return (
    <div onClick={() => setShow(!show)} ref={triggerRef}>
      {children}
    </div>
  );
}
