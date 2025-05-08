import { IconType } from "@/app/_components/ui/icon/Icons";
import { useAlertContext } from "@/app/_contexts/providers/AlertContextProvider";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import Icon from "../icon/Icon";

type Props = PropsWithChildren<{
  animation?: string | undefined;
  initShowAlert?: boolean;
}>;

export default function AlertContent({ children, animation }: Props) {
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
    document.getElementById("alertPortal")!,
  );
}
