import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const overlayGlass = "absolute inset-0 bg-sidebar/20 supports-[backdrop-filter]:bg-sidebar/35 backdrop-blur-xl backdrop-saturate-150"
