import { twMerge } from "tailwind-merge";
import { IconType, icons } from "../icons";

export default function Icon({
  icon,
  className,
}: {
  icon: IconType | string;
  className?: string;
}) {
  return (
    <div className={twMerge("size-6", className)}>
      <div className="size-full">{icons[icon]}</div>
    </div>
  );
}

