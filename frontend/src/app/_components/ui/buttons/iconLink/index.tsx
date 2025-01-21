import Icon from "@/app/_components/ui/icon";
import { IconType } from "@/app/_components/ui/icons";
import withTooltip from "@/app/_libs/hocs/WithTooltip";
import Link from "next/link";
import { AnchorHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon: IconType | string;
  title?: string;
  tip?: string;
  className?: string;
  iconClassName?: string;
  showHighlight?: boolean;
}

const IconLink = forwardRef<HTMLAnchorElement, Props>(function IconLink(
  {
    href,
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
    <Link
      href={href}
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
    </Link>
  );
});

IconLink.displayName = "IconLink";

export default withTooltip(IconLink);
