import { Media } from "@/app/_libs/vars/constants";
import Link from "next/link";
import { useState } from "react";
import { useGuidebarContext } from "../../_contexts/providers/GuidebarContextProvider";
import IconButton from "../ui/buttons/IconButton";
import Icon from "../ui/icon/Icon";
import { IconType } from "../ui/icon/Icons";
import NavMenu from "./NavMenu";
import UniversalSearch from "./SearchBar";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { guideLayout, setGuideLayout, setOverlayGuide } = useGuidebarContext();

  const toggleGuide = (): void => {
    if (window.innerWidth < Media.GUIDE_BREAKPOINT) {
      setOverlayGuide(true);
    } else {
      setGuideLayout(1 - guideLayout!);
    }
  };

  return (
    <nav className="px-2 sticky flex justify-between items-center w-full top-0 z-20 h-nav-height bg-background-primary space-x-2">
      <div
        className={`${
          isOpen ? "hidden sm:flex" : "flex"
        } items-center shrink-0 h-full px-2 space-x-6`}
      >
        <IconButton
          icon={IconType.Menu}
          onClick={toggleGuide}
          className="p-2"
        />
        <Link href="/">
          <Icon className="w-24" icon={IconType.Logo} />
        </Link>
      </div>
      {isOpen && (
        <IconButton
          icon={IconType.ArrowLeft}
          onClick={() => setIsOpen(false)}
          className="sm:hidden mx-4"
        />
      )}
      <div
        className={`${
          isOpen ? "flex" : "hidden sm:flex"
        } items-center justify-center grow`}
      >
        <UniversalSearch />
      </div>
      <div
        className={`${
          isOpen ? "hidden sm:flex" : "flex"
        } items-center shrink-0 pr-4`}
      >
        <NavMenu setIsOpen={setIsOpen} />
      </div>
    </nav>
  );
}
