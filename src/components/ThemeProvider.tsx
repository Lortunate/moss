import React, { useEffect } from "react";
import {ThemeProvider as NextThemeProvider, useTheme as useNextTheme} from "next-themes";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  useEffect(() => {
    const apply = () => {
      try {
        const t = localStorage.getItem("theme") || "default";
        const el = document.documentElement;
        if (t && t !== "default") {
          el.setAttribute("data-theme", t);
        } else {
          el.removeAttribute("data-theme");
        }
      } catch {}
    };
    apply();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") apply();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

export const useTheme = useNextTheme;
