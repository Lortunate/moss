import {useState} from "react";
import {useTheme} from "@/components/ThemeProvider.tsx";
import {useTranslation} from "react-i18next";
import {i18n as i18nInstance} from "@/lib/i18n";
import {useTauriStore} from "@/hooks/useTauriStore";
import {AVAILABLE_THEMES} from "@/styles/themes/import-all";
import AppearanceSection from "@/pages/settings/AppearanceSection";
import AboutSection from "@/pages/settings/AboutSection";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@radix-ui/react-scroll-area";

type TabKey = "appearance" | "about";

const NAV_ITEMS: ReadonlyArray<{ key: TabKey; labelKey: string; defaultLabel: string }> = [
  { key: "appearance", labelKey: "settings.nav.appearance", defaultLabel: "Appearance" },
  { key: "about", labelKey: "settings.nav.about", defaultLabel: "About" },
];

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "w-full text-left text-sm px-2.5 py-2 rounded-md transition-colors outline-hidden border-none focus-visible:ring-0 focus-visible:outline-0",
        active ? "bg-primary/15 text-foreground" : "hover:bg-muted"
      )}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

export default function Settings() {
  const { theme: darkMode, setTheme } = useTheme();
  const { t } = useTranslation();
  const [appTheme, setAppTheme] = useTauriStore<string>(
    "theme",
    AVAILABLE_THEMES.includes("default")
      ? "default"
      : AVAILABLE_THEMES[0] ?? "default",
    {
      validate: (v: unknown): v is string =>
        typeof v === "string" && AVAILABLE_THEMES.includes(v as string),
    }
  );
  const [active, setActive] = useState<TabKey>("appearance");
  const [lang, setLang] = useTauriStore<string>(
    "lang",
    i18nInstance.language?.startsWith("zh") ? "zh" : "en",
    {
      validate: (v: unknown): v is string =>
        v === "en" || v === "zh" || v === "system",
    }
  );

  return (
    <div className="h-svh bg-background text-foreground">
      <div className="grid h-full grid-cols-[168px_1fr]">
        <aside className="h-full border-r border-border/60 bg-sidebar">
          <div style={{ marginTop: "40px" }}></div>
          <nav className="p-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.key}
                active={active === item.key}
                onClick={() => setActive(item.key)}
              >
                {t(item.labelKey, { defaultValue: item.defaultLabel })}
              </NavButton>
            ))}
          </nav>
        </aside>
        <ScrollArea>
          <main className="p-5 h-full overflow-y-auto">
            {active === "appearance" && (
              <AppearanceSection
                appTheme={appTheme}
                setAppTheme={setAppTheme}
                darkMode={darkMode}
                setTheme={setTheme}
                lang={lang}
                setLang={setLang}
              />
            )}
            {active === "about" && <AboutSection />}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
