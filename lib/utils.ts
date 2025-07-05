import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names
 * @param inputs - The class names to merge
 * @returns {string} The merged class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Check if the current environment is development
 * @returns {boolean} True if the current environment is development, false otherwise
 */
export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Generate a slug from a name
 * @param name - The name to generate a slug from
 * @returns {string} The generated slug
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Format a date to a localized string
 * @param date - The date to format
 * @returns {string} The formatted date
 */
export function formatDate(date: Date | string): string {
    // Use 'en-US' as default locale for server-side rendering
    const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format a date to month and year
 * @param date - The date to format
 * @returns {string} The formatted date
 */
export function formatDateToMonthYear(date: Date | string): string {
    const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
    });
}