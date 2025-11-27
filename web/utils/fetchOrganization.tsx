const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || '';

export async function fetchOrganizationInfo() {
    const token = localStorage.getItem('access_token');

    if (!token) {
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
        throw new Error(
            'Авторизація не вдалася. Термін дії токена закінчився.',
        );
    }

    if (!res.ok) {
        throw new Error(`Помилка API: ${res.statusText}`);
    }

    return res.json();
}
