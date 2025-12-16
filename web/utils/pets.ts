import { handleAuthError } from './auth';
import { API_BASE } from './config';

export interface UserPet {
    pet_id: number;
    pet_name: string;
    pet_name_en?: string;
    img_url?: string;
    species?: string;
    breed?: string;
}

export type ExtractType =
    | 'Витяг з реєстру домашніх тварин'
    | 'Медичний витяг про проведені щеплення тварини'
    | 'Офіційний витяг про ідентифікаційні дані тварини';

export interface GenerateExtractRequest {
    pet_id: number;
    name_document: ExtractType;
}

export interface GenerateExtractResponse {
    detail: string;
}

export async function fetchUserPets(): Promise<UserPet[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
        handleAuthError();
        throw new Error('Токен авторизації відсутній. Будь ласка, увійдіть.');
    }

    const apiUrl = `${API_BASE}/users/me/pets`;

    const res = await fetch(apiUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

    const data = await res.json();
    // Handle both array and paginated response
    return Array.isArray(data) ? data : data.items || [];
}

export async function generateExtract(
    request: GenerateExtractRequest,
): Promise<GenerateExtractResponse> {
    const token = localStorage.getItem('access_token');

    if (!token) {
        handleAuthError();
        throw new Error('Токен авторизації відсутній. Будь ласка, увійдіть.');
    }

    const apiUrl = `${API_BASE}/pets/generate-report`;

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (res.status === 401 || res.status === 403) {
        handleAuthError();
        throw new Error(
            'Авторизація не вдалася. Термін дії токена закінчився.',
        );
    }

    if (!res.ok) {
        const errorData = await res
            .json()
            .catch(() => ({ detail: res.statusText }));
        throw new Error(errorData.detail || `Помилка API: ${res.statusText}`);
    }

    return res.json();
}
