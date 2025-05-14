import { GUIDE_BREAKPOINT } from "@/app/_libs/vars/constants";
import Link from "next/link";
import { useEffect } from "react";
import { useGuidebarContext } from "../../_contexts/providers/GuidebarContextProvider";
import IconButton from "../ui/buttons/IconButton";
import Icon from "../ui/icon/Icon";
import { IconType } from "../ui/icon/Icons";
import Backdrop from "../ui/modal/ModalBackdrop";
import GuideBar from "./GuideBar";

export default function OverlayGuide() {
  const { showOverlayGuide, setOverlayGuide } = useGuidebarContext();
  useEffect(() => {
    const media = window.matchMedia(`(min-width:${GUIDE_BREAKPOINT}px)`);
    function handler(e: MediaQueryListEvent) {
      if (e.matches) {
        setOverlayGuide(false);
      }
    }
    media.addEventListener("change", handler);
    return () => {
      media.removeEventListener("change", handler);
    };
  }, []);

  return (
    <>
      <section
        className={`fixed top-0 z-50 h-full ${
          !showOverlayGuide && "-translate-x-full"
        } transition-all bg-background-primary`}
      >
        <div className="flex space-x-6 items-center shrink-0 h-nav-height w-guide-normal-width px-4">
          <IconButton
            icon={IconType.Menu}
            onClick={() => setOverlayGuide(false)}
            className="p-2"
          />
          <Link href="/">
            <Icon className="w-24" icon={IconType.Logo} />
          </Link>
        </div>
        <GuideBar
          className={`${
            showOverlayGuide ? "max-lgGb:flex" : "max-lgGb:hidden"
          }`}
        />
      </section>
      <Backdrop
        show={showOverlayGuide}
        onClose={() => setOverlayGuide(false)}
      />
    </>
  );
}
