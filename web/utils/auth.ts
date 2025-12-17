export function handleAuthError() {
    localStorage.removeItem('user_name');
    localStorage.removeItem('access_token');
    localStorage.removeItem('organization_type');

    if (typeof window !== 'undefined') {
        window.location.href = '/signIn';
    }
}

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
