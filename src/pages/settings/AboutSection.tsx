import {useTranslation} from "react-i18next";
import {useAppVersion} from "@/hooks/useAppVersion";
import {SiGithub} from "@icons-pack/react-simple-icons";

export default function AboutSection() {
  const { t } = useTranslation();
  const appVersion = useAppVersion();
  return (
    <div className="space-y-6">
      <div className="text-base font-semibold">
        {t("settings.about.title", { defaultValue: "About" })}
      </div>
      <div className="rounded-md border border-border bg-secondary/30 overflow-hidden">
        <div className="divide-y divide-border">
          <div className="p-4 grid grid-cols-[1fr_auto] items-center gap-3">
            <div>
              <div className="text-sm font-medium">
                {t("settings.about.version.label", { defaultValue: "Version" })}
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {appVersion ? `v${appVersion}` : ""}
            </div>
          </div>
          <div className="p-4 grid grid-cols-[1fr_auto] items-center gap-3">
            <div>
              <div className="text-sm font-medium">
                {t("common.source", { defaultValue: "Source" })}
              </div>
            </div>
            <div className="ml-auto">
              <a
                href="https://github.com/Lortunate/moss"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("common.source", { defaultValue: "Source" })}
                title={t("common.source", { defaultValue: "Source" })}
                className="inline-flex items-center gap-2 text-sm"
              >
                <SiGithub className="size-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
