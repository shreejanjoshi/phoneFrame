import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// this is really usefull functions we are going to reuse a lot of across the entire applications. It basically allows us to merge class names it is very handy
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
