import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";
import {useTheme} from "@/components/ThemeProvider.tsx";

export default function Settings() {
  const {theme: darkMode, setTheme} = useTheme();
  const [appTheme, setAppTheme] = useState<string>(() => {
    try {
      return localStorage.getItem("theme") || "default";
    } catch {
      return "default";
    }
  });
  const [active, setActive] = useState<string>("appearance");

  useEffect(() => {
    const el = document.documentElement;
    if (appTheme && appTheme !== "default") {
      el.setAttribute("data-theme", appTheme);
    } else {
      el.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("theme", appTheme);
    } catch {
    }
  }, [appTheme]);

  return (
    <div className="h-svh bg-background text-foreground">
      <div className="grid h-full grid-cols-[168px_1fr]">
        <aside className="h-full border-r border-border/60 bg-sidebar">
          <div style={{marginTop: "40px"}}></div>
          <nav className="p-2 space-y-1">
            <button
              type="button"
              className={`w-full text-left px-2.5 py-2 rounded-md transition-colors ${
                active === "appearance" ? "bg-primary/10 text-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setActive("appearance")}
            >
              Appearance
            </button>
          </nav>
        </aside>
        <main className="p-5 h-full overflow-y-auto">
          {active === "appearance" && (
            <div className="space-y-6">
              <div className="text-base font-semibold">Appearance</div>
              <div className="rounded-md border border-border bg-secondary/30 overflow-hidden">
                <div className="divide-y divide-border">
                  <div className="p-4 grid grid-cols-[1fr_auto] items-center gap-3">
                    <div>
                      <div className="text-sm font-medium">Theme</div>
                      <div className="text-xs text-muted-foreground">Select application theme</div>
                    </div>
                    <div className="ml-auto min-w-[160px] w-[200px] md:w-[220px]">
                      <Select value={appTheme} onValueChange={setAppTheme}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select theme"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="amber-minimal">Amber Minimal</SelectItem>
                          <SelectItem value="claude">Claude</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-[1fr_auto] items-center gap-3">
                    <div>
                      <div className="text-sm font-medium">Appearance Mode</div>
                      <div className="text-xs text-muted-foreground">Choose light, dark or follow system</div>
                    </div>
                    <div className="ml-auto min-w-[160px] w-[200px] md:w-[220px]">
                      <Select value={darkMode} onValueChange={setTheme}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mode"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
