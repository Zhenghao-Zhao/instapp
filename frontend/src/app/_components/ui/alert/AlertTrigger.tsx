import { useAlertContext } from "@/app/_libs/contexts/providers/AlertContextProvider";
import { PropsWithChildren } from "react";

export default function AlertTrigger({
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
