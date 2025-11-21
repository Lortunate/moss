import React, {useCallback, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {open} from "@tauri-apps/plugin-dialog";
import {FolderOpen, ImagePlus} from "lucide-react";
import {cn} from "@/lib/utils";
import {isImageFile, isImagePath, collectImagePathsRecursive} from "@/lib/fs";
import {useTranslation} from "react-i18next";
import {Empty, EmptyHeader, EmptyTitle, EmptyContent, EmptyMedia} from "@/components/ui/empty";

type Props = {
  onAdd: (filesOrPaths: File[] | string[]) => void;
};

export function ImageDropZone({onAdd}: Props) {
  const [isDragging, setDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const {t} = useTranslation();


  const onSelectFiles = useCallback(async () => {
    const res = (await open({multiple: true})) as string | string[] | null;
    if (!res) return;
    const paths = Array.isArray(res) ? res : [res];
    const valid = paths.filter(isImagePath);
    if (valid.length === 0) return;
    onAdd(valid);
  }, [onAdd, t]);

  const onSelectFolder = useCallback(async () => {

    const selected = (await open({directory: true})) as string | string[] | null;
    const dir = Array.isArray(selected) ? selected[0] : selected;
    if (!dir) return;
    try {
      const images = await collectImagePathsRecursive(dir);
      const batchSize = 50;
      for (let i = 0; i < images.length; i += batchSize) {
        onAdd(images.slice(i, i + batchSize));
        await new Promise((r) => setTimeout(r));
      }
    } catch (e) {
    }
  }, [onAdd, t]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files ?? []);
      if (files.length > 0) {
        const validFiles = files.filter(isImageFile);
        if (validFiles.length > 0) onAdd(validFiles);
      }
    },
    [onAdd],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (e.target === dropRef.current) setDragging(false);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(isDragging && "bg-card/50 supports-[backdrop-filter]:bg-card/60 backdrop-blur-xl")}
      >
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImagePlus className="size-12 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle className="text-xl">{t("dropzone.prompt")}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex items-center gap-4">
              <Button size="lg" onClick={onSelectFiles}>
                <ImagePlus className="size-4 mr-2" />
                {t("dropzone.addImages")}
              </Button>
              <Button variant="ghost" size="lg" onClick={onSelectFolder} className="text-muted-foreground">
                <FolderOpen className="size-4 mr-2" />
                {t("dropzone.importFromFolder")}
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
