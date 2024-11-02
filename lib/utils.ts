import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert escaped string to readable format
export function unescapeString(str: string): string {
  if (!str) return '';
  
  try {
    // First attempt to parse as JSON if it looks like a JSON string
    if ((str.startsWith('"') && str.endsWith('"')) || str.includes('\\n')) {
      try {
        return JSON.parse(`"${str.replace(/^"|"$/g, '')}"`);
      } catch {
        // Fall back to manual replacement if JSON parse fails
      }
    }
    
    // Manual replacement as fallback
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .replace(/\\t/g, '\t')
      .trim();
  } catch (error) {
    console.error('Error unescaping string:', error);
    return str; // Return original string if all else fails
  }
}

// Convert readable format back to escaped string
export function escapeString(str: string): string {
  if (!str) return '';
  
  try {
    // Use JSON stringify as the primary method
    const jsonString = JSON.stringify(str);
    return jsonString.slice(1, -1); // Remove the surrounding quotes
  } catch {
    // Fallback to manual escaping if JSON stringify fails
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t')
      .trim();
  }
}
