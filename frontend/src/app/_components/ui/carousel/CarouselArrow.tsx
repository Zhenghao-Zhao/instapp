import { twMerge } from "tailwind-merge";
import IconButton from "../buttons/IconButton";
import { IconType } from "../icon/Icons";

export default function CarouselArrow({
  direction,
  onClick,
  className,
}: {
  direction: "l" | "r";
  onClick: () => void;
  className?: string;
}) {
  return (
    <IconButton
      icon={direction === "l" ? IconType.ArrowLeft : IconType.ArrowRight}
      onClick={onClick}
      className={twMerge(
        "backdrop-blur-xl bg-opacity-20 text-text-primary p-1 hover:bg-btn-hover-transparent",
        className,
      )}
    />
  );
}
