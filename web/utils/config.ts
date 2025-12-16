/**
 * Centralized configuration for API and environment variables
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || '';

/**
 * Check if we're in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logging utility that only logs in development
 */
export const devLog = (...args: any[]) => {
    if (isDevelopment) {
        console.log(...args);
    }
};

export const devError = (...args: any[]) => {
    if (isDevelopment) {
        console.error(...args);
    }
};
