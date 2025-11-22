import React from "react";
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
