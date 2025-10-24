import { PaginatedResponse } from "../types/api";

const API_BASE_URL = 'https://upcity.live'; // TODO: MOVE TO ENV

export async function fetchAnimals(page: number, size: number, query: string): Promise<PaginatedResponse> {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('Токен авторизації відсутній. Будь ласка, увійдіть.');
    }

    const apiUrl = `${API_BASE_URL}/organizations/animals?page=${page}&size=${size}`;

    const res = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (res.status === 401 || res.status === 403) {
        throw new Error('Авторизація не вдалася. Термін дії токена закінчився.');
    }

    if (!res.ok) {
        throw new Error(`Помилка API: ${res.statusText}`);
    }

    return res.json();
}