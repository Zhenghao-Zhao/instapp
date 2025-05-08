import Dropdown from "@/app/_contexts/providers/DropdownContextProvider";
import { useThemeContext } from "@/app/_contexts/providers/ThemeContextProvider";
import IconButton from "../ui/buttons/IconButton";
import DropdownContent from "../ui/dropdown/DropdownContent";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import { IconType } from "../ui/icon/Icons";

type ThemeIcon = IconType.Light | IconType.Dark | IconType.System;

export default function ThemeChanger() {
  const { theme, changeTheme } = useThemeContext();

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
          themeIcon === theme && "bg-btn-hover-primary"
        }`}
        iconClassName="mr-2"
        onClick={() => changeTheme(themeIcon)}
      />
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <IconButton
          icon={theme as IconType}
          tip="Change theme"
          className="p-2"
        />
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
