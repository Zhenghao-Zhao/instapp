"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type ScrollContextType = {
  showScroll: boolean;
  setShowScroll: (b: boolean) => void;
};

const ScrollContext = createContext<ScrollContextType | null>(null);

export function useScrollContext() {
  const value = useContext(ScrollContext);
  if (value == null) throw Error("Cannot use outside of Provider");

  return value;
}

export default function ScrollContextProvider({
  children,
}: PropsWithChildren) {
  const [showScroll, setShowScroll] = useState(true);

  return (
    <ScrollContext.Provider
      value={{
        showScroll,
        setShowScroll,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}
