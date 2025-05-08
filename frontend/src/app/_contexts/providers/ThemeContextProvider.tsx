"use client";
import { createContext, ReactNode, useContext, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  changeTheme: (data: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useThemeContext() {
  const value = useContext(ThemeContext);
  if (value == null) throw Error("Cannot use outside of Provider");
  return value;
}
export default function ThemeContextProvider({
  prevTheme,
  children,
}: {
  prevTheme: Theme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(prevTheme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme: (theme: Theme) => saveTheme(theme, setTheme),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function saveTheme(theme: Theme, set: (t: Theme) => void) {
  document.documentElement.setAttribute("data-theme", theme);
  document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year
  set(theme);
}
