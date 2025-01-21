"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  const path = usePathname();
  return path.startsWith("/p/") ? children : null;
}
