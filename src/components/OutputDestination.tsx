import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Input} from "@/components/ui/input";
import {FolderOpen} from "lucide-react";
import {useTranslation} from "react-i18next";
import {AnimatePresence, motion} from "framer-motion";
import {pickDirectory} from "@/lib/utils";

type Mode = "original" | "custom";

export type OutputDestinationProps = {
  mode: Mode;
  setMode: (m: Mode) => void;
  dir: string;
  setDir: (d: string) => void;
  overwrite: boolean;
  setOverwrite: (v: boolean) => void;
};

export function OutputDestination({
  mode,
  setMode,
  dir,
  setDir,
  overwrite,
  setOverwrite,
}: OutputDestinationProps) {
  const { t } = useTranslation();

  async function chooseDir() {
    const d = await pickDirectory();
    if (d) setDir(d);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("output.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {t("output.location")}
          </div>
          <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("output.select.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">
                {t("output.locationOptions.original")}
              </SelectItem>
              <SelectItem value="custom">
                {t("output.locationOptions.custom")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "custom" ? (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-2"
            >
              <div className="text-sm text-muted-foreground">
                {t("output.directory")}
              </div>
              <div className="flex items-center">
                <Input
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                  className="flex-1 rounded-r-none border-r-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none border-l-0 bg-transparent hover:bg-transparent text-muted-foreground"
                  aria-label={t("output.openDirAria")}
                  onClick={chooseDir}
                >
                  <FolderOpen className="size-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="original"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {t("output.overwriteOriginals")}
              </span>
              <Switch checked={overwrite} onCheckedChange={setOverwrite} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
