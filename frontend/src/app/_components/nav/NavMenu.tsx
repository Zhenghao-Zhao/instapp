import CreatePostModal from "../post/CreatePostModal";
import IconButton from "../ui/buttons/IconButton";
import { IconType } from "../ui/icon/Icons";
import ProfileMenu from "./ProfileMenu";
import ThemeChanger from "./ThemeChanger";
type Props = {
  setIsOpen: (b: boolean) => void;
};

export default function NavMenu({ setIsOpen }: Props) {
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
        <CreatePostModal />
        <ProfileMenu />
      </div>
    </div>
  );
}
