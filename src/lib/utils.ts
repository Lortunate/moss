import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {open} from "@tauri-apps/plugin-dialog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function pickDirectory(): Promise<string | null> {
  const selected = (await open({ directory: true })) as string | string[] | null;
  if (Array.isArray(selected)) return selected[0] ?? null;
  if (typeof selected === "string") return selected;
  return null;
}
