import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/lib/i18n";
const showWindowWhenReady = async () => {
  try {
    if (typeof window !== "undefined" && (window as any).__TAURI__) {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      requestAnimationFrame(() => {
        getCurrentWindow().show().catch(() => {});
      });
    }
  } catch {}
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
showWindowWhenReady();
