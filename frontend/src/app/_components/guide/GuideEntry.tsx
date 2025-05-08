import { useDataContext } from "@/app/_contexts/providers/DataContextProvider";
import { usePathname } from "next/navigation";
import IconLink from "../ui/buttons/IconLink";

export type GuideEntryProps = {
  icon: string;
  title: string;
  url: string;
  className?: string;
};

export function GuideEntry({ icon, title, url }: GuideEntryProps) {
  const { authProfile: data } = useDataContext();
  const pathname = usePathname();
  return (
    <IconLink
      href={url ?? data.username}
      icon={icon}
      title={title}
      className={`gap-[20px] flex flex-shrink-0 items-center hover:bg-btn-hover-primary px-4 h-10 rounded-lg ${pathname === url && "bg-btn-hover-primary"}`}
    />
  );
}
