import { IconButton } from "@/app/_components/ui/buttons";
import {
  DropdownContent,
  DropdownTrigger,
} from "@/app/_components/ui/dropdown";
import Dropdown from "@/app/_libs/contexts/providers/DropdownContextProvider";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeChanger() {
  const [activeTheme, setActiveTheme] = useState("system");

  function ThemeEntry({ label, id }: { label: string; id: Theme }) {
    return (
      <IconButton
        title={label}
        icon={id}
        className={`hover:bg-btn-hover-primary rounded-lg px-2 py-1 ${
          id === activeTheme && "bg-btn-hover-primary"
        }`}
        iconClassName="mr-2"
        onClick={() => switchTheme(id, setActiveTheme)}
      />
    );
  }

  useEffect(() => {
    const theme = localStorage.getItem("theme") as Theme;
    switchTheme(theme ?? "system", setActiveTheme);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <IconButton icon={activeTheme} tip="Change theme" className="p-2" />
      </DropdownTrigger>
      <DropdownContent>
        <div className="rounded-lg p-2 flex flex-col space-y-1">
          <ThemeEntry label="System default" id="system" />
          <ThemeEntry label="Light" id="light" />
          <ThemeEntry label="Dark" id="dark" />
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

function switchTheme(theme: Theme, set: (t: Theme) => void) {
  document.documentElement.setAttribute("data-theme", theme);
  set(theme);
  localStorage.setItem("theme", theme);
}
