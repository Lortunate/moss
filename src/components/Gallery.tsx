import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ImageItem } from "@/state/app-store";
import { AnimatePresence, motion } from "framer-motion";

export type GalleryProps = {
  items: ImageItem[];
  onRemove: (id: string) => void;
};
export function Gallery({ items, onRemove }: GalleryProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            whileHover={{ scale: 1.015 }}
          >
            <Card className="group bg-card/95 border-border/15 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-[2/1] w-full bg-muted/10 relative">
                  <motion.img
                    src={item.src}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.24 }}
                    whileHover={{ scale: 1.03 }}
                  />
                  <AnimatePresence mode="wait">
                    {item.status === "processing" && (
                      <motion.div
                        key="badge-processing"
                        className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/45 text-white text-xs shadow-sm ring-1 ring-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {t("status.processing")}
                      </motion.div>
                    )}
                    {item.status === "complete" && (
                      <motion.div
                        key="badge-complete"
                        className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/45 text-white text-xs shadow-sm ring-1 ring-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {t("status.complete")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="px-4 py-2 bg-card/85 border-t border-border/25">
                  <div className="text-base font-medium text-foreground truncate">{item.name}</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={
                          `size-2 rounded-full ` +
                          (item.status === "complete"
                            ? "bg-green-400"
                            : item.status === "processing"
                            ? "bg-blue-400 animate-pulse"
                            : item.status === "ready"
                            ? "bg-zinc-400/60"
                            : "bg-red-500")
                        }
                        style={{ transition: "background-color 200ms ease" }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.deleteFile")}
                        className="h-6 w-6 rounded-md bg-card/30 hover:bg-card/40 border border-border/20 text-foreground/80 transition-transform active:scale-[0.98]"
                        onClick={() => onRemove(item.id)}
                        disabled={item.status !== "ready"}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
