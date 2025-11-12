import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Props = {
  canStart: boolean;
  onStart: () => void;
  isProcessing?: boolean;
  onStop?: () => void;
  onClear: () => void;
};
export function ProcessingControls({ canStart, onStart, isProcessing, onStop, onClear }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait" initial={false}>
        {isProcessing ? (
          <motion.div
            key="stop"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            <Button variant="destructive" className="w-full h-11 rounded-[var(--radius)] text-[15px] transition-transform active:scale-[0.98]" onClick={onStop}>
              {t("common.stopProcessing", { defaultValue: "Stop" })}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            <Button className="w-full h-11 rounded-[var(--radius)] text-[15px] transition-transform active:scale-[0.98]" onClick={onStart} disabled={!canStart}>
              {t("common.startProcessing", { defaultValue: "Start Processing" })}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <Button variant="ghost" className="w-full h-11 rounded-[var(--radius)] text-[15px] text-muted-foreground transition-transform active:scale-[0.98]" onClick={onClear}>
        {t("common.clearAll", { defaultValue: "Clear All" })}
      </Button>
    </div>
  );
}
