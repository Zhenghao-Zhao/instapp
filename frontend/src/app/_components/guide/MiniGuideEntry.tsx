import { usePathname } from "next/navigation";
import IconLink from "../ui/buttons/IconLink";

type MiniProps = {
  icon: string;
  title: string;
  url: string;
};

export function MiniGuideEntry({ icon, title, url }: MiniProps) {
  const pathname = usePathname();
  return (
    <IconLink
      href={url}
      icon={icon}
      title={title}
      className={`flex-col w-16 py-4 rounded-lg gap-[6px] ${pathname === url && "bg-btn-hover-primary"}`}
    />
  );
}
