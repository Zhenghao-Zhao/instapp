import { useScrollContext } from "@/app/_libs/contexts/providers/ScrollContextProvider";

type BackdropProps = {
  show: boolean;
  onClose: () => void;
};

export default function Backdrop({ show, onClose }: BackdropProps) {
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
