"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { GuideTypes } from "../../../_components/nav/guide";
import { useScrollContext } from "./ScrollContextProvider";

type GuidebarContextType = {
  guideLayout: GuideTypes | null;
  showOverlayGuide: boolean;
  setGuideLayout: (g: GuideTypes | null) => void;
  setOverlayGuide: (b: boolean) => void;
  setShowOverlayGuide: (b: boolean) => void;
};
const GuidebarContext = createContext<GuidebarContextType | null>(null);

export function useGuidebarContext() {
  const value = useContext(GuidebarContext);
  if (value == null) throw Error("Cannot use outside of Provider");

  return value;
}

export default function GuidebarContextProvider({
  children,
}: PropsWithChildren) {
  const { setShowScroll } = useScrollContext();
  const [guideLayout, setGuideLayout] = useState<GuideTypes | null>(
    GuideTypes.Regular
  ); // 0: mini guide; 1: regular guide
  const [showOverlayGuide, setShowOverlayGuide] = useState(false);

  const setOverlayGuide = (b: boolean) => {
    setShowOverlayGuide(b);
    setShowScroll(!b);
  };

  return (
    <GuidebarContext.Provider
      value={{
        guideLayout,
        showOverlayGuide,
        setGuideLayout,
        setOverlayGuide,
        setShowOverlayGuide,
      }}
    >
      {children}
    </GuidebarContext.Provider>
  );
}
