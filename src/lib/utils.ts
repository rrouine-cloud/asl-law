import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    if (!text) return fallback;
    
    // Remove markdown code blocks if present
    const cleanJson = text.replace(/```json\n?|```/g, '').trim();
    
    try {
      return JSON.parse(cleanJson) as T;
    } catch (initialError) {
      // Robust extraction: find the outermost { } or [ ]
      const firstCurly = cleanJson.indexOf('{');
      const firstBracket = cleanJson.indexOf('[');
      
      let startIdx = -1;
      let closingChar = '';
      
      if (firstCurly !== -1 && (firstBracket === -1 || firstCurly < firstBracket)) {
        startIdx = firstCurly;
        closingChar = '}';
      } else if (firstBracket !== -1) {
        startIdx = firstBracket;
        closingChar = ']';
      }
      
      if (startIdx !== -1) {
        let lastIdx = cleanJson.lastIndexOf(closingChar);
        while (lastIdx > startIdx) {
          try {
            return JSON.parse(cleanJson.substring(startIdx, lastIdx + 1)) as T;
          } catch {
            lastIdx = cleanJson.lastIndexOf(closingChar, lastIdx - 1);
          }
        }
      }
      throw initialError;
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e, "Original text:", text);
    return fallback;
  }
}
