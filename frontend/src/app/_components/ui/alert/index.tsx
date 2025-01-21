import { IconType } from "@/app/_components/ui/icons";
import { useAlertContext } from "@/app/_libs/contexts/providers/AlertContextProvider";
import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import Icon from "../icon";

type Props = PropsWithChildren<{
  animation?: string | undefined;
  initShowAlert?: boolean;
}>;

export function AlertContent({ children, animation }: Props) {
  const { open: show, setOpen: setShow } = useAlertContext();

  function AlertBackdrop({ handleClick }: { handleClick: () => void }) {
    return (
      <div
        className="w-full h-full bg-backdrop"
        onClick={handleClick}
        role="backdrop"
      >
        <div className="absolute top-view-close-top right-view-close-right bg-modal-primary rounded-full p-2 cursor-pointer group">
          <div className="group-hover:scale-125 transition-all">
            <Icon icon={IconType.Cross} />
          </div>
        </div>
      </div>
    );
  }

  if (!show) return null;

  return createPortal(
    <div className="fixed flex justify-center items-center inset-0 z-50">
      <AlertBackdrop handleClick={() => setShow(false)} />
      <div
        className="absolute rounded-md bg-modal-primary text-text-primary"
        style={{ animation: animation && `${animation} 200ms ease-out` }}
      >
        {children}
      </div>
    </div>,
    document.getElementById("alertPortal")!
  );
}

export function AlertTrigger({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  const { setOpen: setShow } = useAlertContext();
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShow(true);
  };
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}