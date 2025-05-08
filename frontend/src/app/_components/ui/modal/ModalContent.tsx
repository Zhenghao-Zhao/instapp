import Alert from "@/app/_contexts/providers/AlertContextProvider";
import { useModalContext } from "@/app/_contexts/providers/ModalContextProivder";
import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import AlertContent from "../alert/AlertContent";
import AlertTrigger from "../alert/AlertTrigger";
import Icon from "../icon/Icon";
import { IconType } from "../icon/Icons";

type Props = PropsWithChildren<{
  animation?: string | undefined;
  initShowAlert?: boolean;
}>;

export default function ModalContent({
  children,
  animation = "fade-in-scale",
}: Props) {
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
