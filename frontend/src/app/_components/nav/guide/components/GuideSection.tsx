import { IconButton } from "@/app/_components/ui/buttons";
import { useMemo, useState } from "react";
import { IconType, icons } from "../../../ui/icons";
import { GuideEntry, GuideEntryProps } from "./GuideEntry";

type GuideSectionProps = {
  title: string;
  collapseSize?: number;
  icon?: string;
  entries: GuideEntryProps[];
  isEntriesLoading?: boolean;
};

export default function GuideSection({
  title,
  entries,
  icon,
  collapseSize = entries.length,
}: GuideSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleClick = () => {
    setIsCollapsed((prev) => !prev);
  };

  const openEntries = useMemo((): JSX.Element[] => {
    return entries.reduce<JSX.Element[]>((rst, curr, i) => {
      if (i < collapseSize) {
        rst.push(
          <GuideEntry
            key={i}
            icon={curr.icon}
            title={curr.title}
            url={curr.url}
            image={curr.image}
          />,
        );
      }
      return rst;
    }, []);
  }, [collapseSize, entries]);

  const collapsedEntries = useMemo(() => {
    const rtn =
      collapseSize >= entries.length
        ? null
        : entries.reduce<JSX.Element[]>((rst, curr, i) => {
            if (i >= collapseSize) {
              rst.push(
                <GuideEntry
                  key={i}
                  icon={curr.icon}
                  title={curr.title}
                  url={curr.url}
                  image={curr.image}
                />,
              );
            }
            return rst;
          }, []);
    return rtn;
  }, [collapseSize, entries]);

  const collapseButton =
    collapseSize >= entries.length ? null : isCollapsed ? (
      <IconButton
        icon={IconType.ArrowDown}
        className="rounded-lg px-4 gap-6"
        title={`Show More`}
        onClick={handleClick}
      />
    ) : (
      <IconButton
        icon={IconType.ArrowUp}
        className="rounded-lg px-4 gap-6"
        title={`Show Fewer`}
        onClick={handleClick}
      />
    );

  return (
    <div className="w-full flex flex-col px-2">
      <div className="flex items-center px-4">
        {title && <p className="font-semibold text-[16px] py-2">{title}</p>}
        {icon !== undefined && <div className="w-5 ml-2">{icons[icon]}</div>}
      </div>
      <div>
        {openEntries}
        {!isCollapsed && collapsedEntries}
        {collapseButton}
      </div>
    </div>
  );
}
