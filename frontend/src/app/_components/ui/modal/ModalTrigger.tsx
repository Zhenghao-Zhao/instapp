import { useModalContext } from "@/app/_libs/contexts/providers/ModalContextProivder";
import { PropsWithChildren } from "react";

export default function ModalTrigger({
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
