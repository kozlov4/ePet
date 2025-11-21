import { PaginatedResponse } from "../types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || '';

export interface FetchOptions {
    page: number;
    size: number;
    query: string;
    queryParamName: string;
}

export async function fetchPaginatedData(
    endpoint: string,
    options: FetchOptions
): Promise<PaginatedResponse<any>> {

    const { page, size, query, queryParamName } = options;
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('Токен авторизації відсутній. Будь ласка, увійдіть.');
    }

    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (query) {
        params.append(queryParamName, query);
    }

    const apiUrl = `${API_BASE}${endpoint}?${params.toString()}`;

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