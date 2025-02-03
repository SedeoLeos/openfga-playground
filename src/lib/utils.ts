import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const copyToClipboard = async (text: string) => {
  try {
     
      await navigator.clipboard.writeText(text);
      return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          const result = document.execCommand('copy');
          document.body.removeChild(textarea);
          return result;
      } catch (err) {
          console.error('Impossible de copier le texte:', err);
          return false;
      }
  }
}