import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function def<T>(value: T | null | undefined): value is T  {
  return value !== undefined && value !== null
}
