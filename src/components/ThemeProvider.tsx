import React, {createContext, useContext, useEffect, useMemo} from "react";
import {useTauriStore} from "@/hooks/useTauriStore";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = { children: React.ReactNode; defaultTheme?: Theme };

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children, defaultTheme = "system"}: ThemeProviderProps) {
  const [theme, setTheme] = useTauriStore<Theme>(
    "appearanceMode",
    defaultTheme,
    {validate: (v: unknown): v is Theme => v === "light" || v === "dark" || v === "system"}
  );
  const [uiTheme] = useTauriStore<string>("theme", "default");

  useEffect(() => {
    const el = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effective = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
    if (effective === "dark") el.classList.add("dark"); else el.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    const el = document.documentElement;
    if (uiTheme && uiTheme !== "default") el.setAttribute("data-theme", uiTheme);
    else el.removeAttribute("data-theme");
  }, [uiTheme]);

  const value = useMemo(() => ({theme, setTheme}), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "system", setTheme: () => {
      }
    } as ThemeContextValue;
  }
  return ctx;
}
