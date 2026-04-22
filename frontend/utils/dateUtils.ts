/**
 * Shared timezone constant and date formatting utilities.
 * All dates displayed to the user should use this timezone.
 */
export const APP_TIMEZONE = 'America/New_York';

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return date.toLocaleDateString('en-US', { timeZone: APP_TIMEZONE, ...options });
}

export function formatTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return date.toLocaleTimeString('en-US', { timeZone: APP_TIMEZONE, ...options });
}

export function formatDateTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return date.toLocaleString('en-US', { timeZone: APP_TIMEZONE, ...options });
}

/**
 * Returns YYYY-MM-DD string in EST timezone (for date comparisons).
 */
export function getDateString(date: Date): string {
    return formatDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' })
        .split('/')
        .map((p, i) => i === 2 ? p : p.padStart(2, '0'))
        .reverse()
        .join('-')
        // Convert MM/DD/YYYY to YYYY-MM-DD
        .replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3');
}

/**
 * Simpler: get YYYY-MM-DD using Intl for EST.
 */
export function toESTDateString(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIMEZONE }).format(date);
    return parts; // en-CA gives YYYY-MM-DD format
}
