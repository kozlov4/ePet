/**
 * Utility functions for handling authentication errors
 */

export function handleAuthError() {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('user_name');
    localStorage.removeItem('access_token');
    localStorage.removeItem('organization_type');
    
    // Redirect to sign in page
    if (typeof window !== 'undefined') {
        window.location.href = '/signIn';
    }
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
    if (error instanceof Error) {
        return (
            error.message.includes('Авторизація не вдалася') ||
            error.message.includes('Термін дії токена закінчився') ||
            error.message.includes('Токен авторизації відсутній')
        );
    }
    return false;
}

