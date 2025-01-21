import { IconType } from "@/app/_components/ui/icons";
import Create from "./Create";
import ProfileMenu from "./ProfileMenu";
import ThemeChanger from "./ThemeChanger";
import { IconButton } from "@/app/_components/ui/buttons";
type Props = {
  setIsOpen: (b: boolean) => void;
};

export default function HeaderMenu({ setIsOpen }: Props) {
  return (
    <div className="flex items-center">
      <IconButton
        icon={IconType.Search}
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2"
        tip="Search"
      />
      <div className="flex items-center justify-center">
        <ThemeChanger />
        <Create />
        <ProfileMenu />
      </div>
    </div>
  );
}
