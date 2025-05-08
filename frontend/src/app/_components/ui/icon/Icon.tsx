import { twMerge } from "tailwind-merge";
import { icons, IconType } from "./Icons";

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
