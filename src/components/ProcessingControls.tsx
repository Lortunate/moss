import {Button} from "@/components/ui/button";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "react-i18next";

type Props = {
  canStart: boolean;
  onStart: () => void;
  isProcessing?: boolean;
  onStop?: () => void;
  onClear: () => void;
};

export function ProcessingControls({canStart, onStart, isProcessing, onStop, onClear}: Props) {
  const {t} = useTranslation();
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait" initial={false}>
        {isProcessing ? (
          <motion.div
            key="stop"
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.16}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.985 }}
          >
            <Button
              variant="destructive"
              className="w-full h-11 rounded-[var(--radius)] text-[15px] transition-transform active:scale-[0.98] border border-destructive/40 !bg-destructive/35 supports-[backdrop-filter]:!bg-destructive/45 backdrop-blur-xl shadow-sm !hover:bg-destructive/70 !hover:shadow-md"
              onClick={onStop}
            >
              {t("common.stopProcessing", {defaultValue: "Stop"})}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="start"
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.16}}
            whileHover={canStart ? { scale: 1.03 } : undefined}
            whileTap={canStart ? { scale: 0.985 } : undefined}
            className={canStart ? undefined : "pointer-events-none"}
          >
            <Button
              className={`w-full h-11 rounded-[var(--radius)] text-[15px] transition-transform active:scale-[0.98] border border-sidebar-border/40 bg-card/35 supports-[backdrop-filter]:bg-card/45 backdrop-blur-xl text-foreground shadow-sm ${canStart ? "hover:bg-card/65 supports-[backdrop-filter]:hover:bg-card/75 hover:border-sidebar-border/70 hover:shadow-md" : ""}`}
              onClick={onStart}
              disabled={!canStart}
            >
              {t("common.startProcessing", {defaultValue: "Start Processing"})}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div whileHover={!isProcessing ? { scale: 1.03 } : undefined} whileTap={!isProcessing ? { scale: 0.985 } : undefined} className={isProcessing ? "pointer-events-none" : undefined}>
        <Button
          variant="ghost"
          className="w-full h-11 rounded-[var(--radius)] text-[15px] transition-transform active:scale-[0.98] border border-sidebar-border/40 bg-card/20 supports-[backdrop-filter]:bg-card/30 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-card/50 supports-[backdrop-filter]:hover:bg-card/65 hover:shadow-md"
          onClick={onClear}
          disabled={isProcessing}
        >
          {t("common.clearAll", {defaultValue: "Clear All"})}
        </Button>
      </motion.div>
    </div>
  );
}
