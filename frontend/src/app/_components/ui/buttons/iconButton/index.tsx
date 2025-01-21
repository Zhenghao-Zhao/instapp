import Icon from "@/app/_components/ui/icon";
import { IconType } from "@/app/_components/ui/icons";
import withTooltip from "@/app/_libs/hocs/WithTooltip";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType | string;
  title?: string;
  tip?: string;
  className?: string;
  iconClassName?: string;
  showHighlight?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  {
    icon,
    title,
    className,
    iconClassName,
    showHighlight = true,
    ...props
  }: Props,
  ref,
) {
  return (
    <button
      className={twMerge(
        `flex flex-shrink-0 items-center ${
          showHighlight && "hover:bg-btn-hover-primary"
        } ${!title && "rounded-full"}`,
        className,
      )}
      ref={ref}
      {...props}
    >
      {<Icon icon={icon} className={`${iconClassName}`} />}
      {title && <p className="text-nowrap">{title}</p>}
    </button>
  );
});

IconButton.displayName = "IconButton";

export default withTooltip(IconButton);
