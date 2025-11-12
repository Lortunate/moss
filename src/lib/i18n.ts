import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/translation.json";
import zh from "@/locales/zh/translation.json";

type Lang = "en" | "zh";

const resources = {
  en: { translation: en },
  zh: { translation: zh }
} as const;

function resolveInitialLanguage(): Lang {
  try {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved === "en" || saved === "zh") return saved;
  } catch {}
  const nav = typeof navigator !== "undefined" ? navigator.language : "en";
  return nav.toLowerCase().startsWith("zh") ? "zh" : "en";
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: resolveInitialLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export function setLanguage(lng: Lang) {
  i18n.changeLanguage(lng);
  try { localStorage.setItem("lang", lng); } catch {}
}
export { i18n };
