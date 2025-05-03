import Dropdown from "@/app/_libs/contexts/providers/DropdownContextProvider";
import { useEffect, useState } from "react";
import IconButton from "../ui/buttons/IconButton";
import DropdownContent from "../ui/dropdown/DropdownContent";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import { IconType } from "../ui/icon/Icons";

type ThemeIcon = IconType.Light | IconType.Dark | IconType.System;

export default function ThemeChanger() {
  const [activeTheme, setActiveTheme] = useState<IconType>(IconType.System);

  function ThemeEntry({
    label,
    themeIcon,
  }: {
    label: string;
    themeIcon: ThemeIcon;
  }) {
    return (
      <IconButton
        title={label}
        icon={themeIcon}
        className={`hover:bg-btn-hover-primary justify-start rounded-lg px-2 py-1 ${
          themeIcon === activeTheme && "bg-btn-hover-primary"
        }`}
        iconClassName="mr-2"
        onClick={() => switchTheme(themeIcon, setActiveTheme)}
      />
    );
  }

  useEffect(() => {
    const theme = localStorage.getItem("theme") as ThemeIcon;
    switchTheme(theme ?? "system", setActiveTheme);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <IconButton icon={activeTheme} tip="Change theme" className="p-2" />
      </DropdownTrigger>
      <DropdownContent>
        <div className="rounded-lg p-2 flex flex-col space-y-1">
          <ThemeEntry label="System default" themeIcon={IconType.System} />
          <ThemeEntry label="Light" themeIcon={IconType.Light} />
          <ThemeEntry label="Dark" themeIcon={IconType.Dark} />
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

function switchTheme(theme: ThemeIcon, set: (t: ThemeIcon) => void) {
  document.documentElement.setAttribute("data-theme", theme);
  set(theme);
  localStorage.setItem("theme", theme);
}
