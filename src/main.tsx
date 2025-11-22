import React from "react";
import ReactDOM from "react-dom/client";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import "./index.css";
import "@/lib/i18n";
import {ThemeProvider} from "@/components/ThemeProvider.tsx";
import {HashRouter, Routes, Route} from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { setLanguage } from "@/lib/i18n";

const showWindowWhenReady = async () => {
  const {getCurrentWindow} = await import("@tauri-apps/api/window");
  requestAnimationFrame(() => {
    getCurrentWindow().show().catch((e) => {
      console.error(e);
    });
  });
};

function Root() {
  return (
    <ThemeProvider defaultTheme={"system"}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/settings" element={<Settings/>} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root/>
  </React.StrictMode>,
);

showWindowWhenReady().then(() => {
  console.info("window ready");
})

void (async () => {
  const unlistenPromise = listen("app:store:update", (evt) => {
    const p = evt.payload as { key?: string; value?: unknown };
    if (p.key === "lang" && (p.value === "en" || p.value === "zh" || p.value === "system")) {
      setLanguage(p.value as "en" | "zh" | "system");
    }
  });
  window.addEventListener("beforeunload", () => {
    void unlistenPromise.then((un) => un());
  });
})();
