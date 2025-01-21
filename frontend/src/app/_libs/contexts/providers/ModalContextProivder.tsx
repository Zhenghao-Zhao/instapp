import { useRouter } from "next/navigation";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useScrollContext } from "./ScrollContextProvider";

type ModalContextType = {
  open: boolean;
  setOpen: (b: boolean) => void;
  alertOnClose: boolean;
  setAlertOnClose: (b: boolean) => void;
  alert: React.ReactElement<{ onConfirm?: () => void }> | undefined;
  toggleModal: (b: boolean) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext() {
  const value = useContext(ModalContext);
  if (value == null) throw Error("Cannot use outside of Provider");

  return value;
}

export default function Modal({
  alert,
  alertOnCloseInit = true,
  isRouted = false,
  children,
}: PropsWithChildren<{
  alert?: React.ReactElement<{ onConfirm?: () => void }>;
  alertOnCloseInit?: boolean;
  isRouted?: boolean;
}>) {
  const [open, setOpen] = useState(isRouted);
  const [alertOnClose, setAlertOnClose] = useState(alertOnCloseInit);
  const { setShowScroll } = useScrollContext();
  const router = useRouter();

  // if modal is routed and thus default set to open, remove scrollbar
  useLayoutEffect(() => {
    if (isRouted) {
      setShowScroll(false);
    }
  }, [setShowScroll, isRouted]);

  useEffect(() => {
    return () => setShowScroll(true);
  }, [setShowScroll]);

  const toggleModal = (open: boolean) => {
    setOpen(open);
    setShowScroll(!open);

    if (!open && isRouted) {
      router.back();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        open,
        setOpen,
        alertOnClose,
        setAlertOnClose,
        alert,
        toggleModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
