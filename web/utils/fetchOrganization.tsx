import { API_BASE } from './config';
import { handleAuthError } from './auth';

export async function fetchOrganizationInfo() {
    const token = localStorage.getItem('access_token');

    if (!token) {
        handleAuthError();
        throw new Error('Токен авторизації відсутній. Будь ласка, увійдіть.');
    }

    const apiUrl = `${API_BASE}/organizations/info`;

    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (res.status === 401 || res.status === 403) {
        handleAuthError();
        throw new Error(
            'Авторизація не вдалася. Термін дії токена закінчився.',
        );
    }

    if (!res.ok) {
        throw new Error(`Помилка API: ${res.statusText}`);
    }

    return res.json();
}
