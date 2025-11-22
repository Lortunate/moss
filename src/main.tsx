import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/lib/i18n";
import {ThemeProvider} from "@/components/ThemeProvider.tsx";

const showWindowWhenReady = async () => {
  if (typeof window !== "undefined" && (window as any).__TAURI__) {
    const {getCurrentWindow} = await import("@tauri-apps/api/window");
    requestAnimationFrame(() => {
      getCurrentWindow().show().catch((e) => {
        console.error(e);
      });
    });
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={"system"}>
      <App/>
    </ThemeProvider>
  </React.StrictMode>,
);

showWindowWhenReady().then(() => {
  console.info("window ready");
})
