import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for combining CSS classes
 * 
 * Features:
 * - Combines multiple class values
 * - Handles conditional classes
 * - Removes duplicates and conflicts
 * - TypeScript support
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}