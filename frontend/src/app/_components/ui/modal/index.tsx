import { IconType } from "@/app/_components/ui/icons";
import Alert from "@/app/_libs/contexts/providers/AlertContextProvider";
import { useModalContext } from "@/app/_libs/contexts/providers/ModalContextProivder";
import { useScrollContext } from "@/app/_libs/contexts/providers/ScrollContextProvider";
import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { AlertContent, AlertTrigger } from "../alert";
import Icon from "../icon";

type Props = PropsWithChildren<{
  animation?: string | undefined;
  initShowAlert?: boolean;
}>;

export function ModalContent({ children, animation = "fade-in-scale" }: Props) {
  const {
    open: show,
    toggleModal: showModal,
    alert,
    alertOnClose: showAlert,
  } = useModalContext();

  const handleBackdropClick = () => {
    if (alert !== undefined && showAlert) return;
    showModal(false);
  };

  function ModalBackdrop({ handleClick }: { handleClick: () => void }) {
    return (
      <div
        className="w-screen min-h-screen bg-backdrop"
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
      {alert !== undefined && showAlert ? (
        <Alert>
          <AlertTrigger>
            <ModalBackdrop handleClick={handleBackdropClick} />
          </AlertTrigger>
          <AlertContent>
            {React.cloneElement(alert, { onConfirm: () => showModal(false) })}
          </AlertContent>
        </Alert>
      ) : (
        <ModalBackdrop handleClick={handleBackdropClick} />
      )}
      <div
        className="absolute rounded-md bg-modal-primary text-text-primary"
        style={{ animation: animation && `${animation} 200ms ease-out` }}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modalPortal")!,
  );
}

export function ModalTrigger({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  const { toggleModal: showModal } = useModalContext();
  const handleClick = () => {
    showModal(true);
  };
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}

type BackdropProps = {
  show: boolean;
  onClose: () => void;
};

export function Backdrop({ show, onClose }: BackdropProps) {
  const { setShowScroll } = useScrollContext();
  const handleClick = () => {
    onClose();
    setShowScroll(true);
  };
  return (
    <div
      className={`${show ? "fixed" : "hidden"} inset-0 bg-backdrop z-30`}
      onClick={handleClick}
    />
  );
}
