"use client";
import GuideBar from "@/app/_components/guide/GuideBar";
import MiniGuide from "@/app/_components/guide/MiniGuide";
import OverlayGuide from "@/app/_components/guide/OverlayGuide";
import NavBar from "@/app/_components/nav/Navbar";
import { GuideTypes } from "@/app/_libs/vars/types";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGuidebarContext } from "./_contexts/providers/GuidebarContextProvider";
import { useScrollContext } from "./_contexts/providers/ScrollContextProvider";

export default function ContentLayout({ children }: PropsWithChildren) {
  const { showScroll } = useScrollContext();
  const { guideLayout, setShowOverlayGuide, showOverlayGuide } =
    useGuidebarContext();
  const dateRef = useRef(new Date());
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!showScroll) {
      document.documentElement.classList.add("withoutScroll");
    } else {
      document.documentElement.classList.remove("withoutScroll");
    }
  }, [showScroll]);

  // clear overlay guide when move to a new
  useLayoutEffect(() => {
    if (showOverlayGuide) setShowOverlayGuide(false);
  }, [pathname]);

  return (
    <>
      <main className="relative">
        <ProgressBar
          height="2px"
          color="#fffd00"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <NavBar />
        <MiniGuide />
        <GuideBar />
        <OverlayGuide />
        <section
          className={`mt-6 smGb:max-lgGb:ml-guide-small-width ${
            guideLayout === GuideTypes.Regular
              ? "lgGb:ml-guide-normal-width"
              : "lgGb:ml-guide-small-width"
          } px-6`}
        >
          <div className="min-h-main-minHeight flex flex-col">
            <div className="grow flex justify-center">{children}</div>
            <footer className="flex items-center justify-center w-full h-footer-height border-t">
              © {dateRef.current.getFullYear()} BlueApp from ZhenghaoZhao
            </footer>
          </div>
        </section>
      </main>
      <div id="modalPortal"></div>
      <div id="alertPortal" />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
