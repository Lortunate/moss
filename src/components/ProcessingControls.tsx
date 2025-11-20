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
              variant="glassDestructive"
              size="xl"
              className="w-full"
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
              variant="glass"
              size="xl"
              className="w-full"
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
          size="xl"
          className="w-full border border-sidebar-border/40 bg-card/20 supports-[backdrop-filter]:bg-card/30 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-card/50 supports-[backdrop-filter]:hover:bg-card/65 hover:shadow-md"
          onClick={onClear}
          disabled={isProcessing}
        >
          {t("common.clearAll", {defaultValue: "Clear All"})}
        </Button>
      </motion.div>
    </div>
  );
}
