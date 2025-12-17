import { API_BASE, devLog } from '../utils/config';
import { handleAuthError } from '../utils/auth';
import { PaginatedResponse } from '../types/api';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
    skipAuth?: boolean;
}

export async function request<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('access_token')
            : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    if (token && !skipAuth) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers,
    };

    const url = `${API_BASE}${endpoint}`;

    devLog(`API Request: ${url}`);

    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
        if (!skipAuth) {
            handleAuthError();
        }
        throw new Error('Authentication failed');
    }

    if (response.status === 204) {
        return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(
            data.detail || data.message || `API Error: ${response.status}`,
            response.status,
            data,
        );
    }

    return data;
}

export class ApiError extends Error {
    public status: number;
    public data: any;

    constructor(message: string, status: number, data: any) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

export interface FetchPaginatedOptions {
    page: number;
    size: number;
    query?: string;
    queryParamName?: string;
}

export async function fetchPaginated<T>(
    endpoint: string,
    options: FetchPaginatedOptions,
): Promise<PaginatedResponse<T>> {
    const { page, size, query, queryParamName } = options;
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (query && queryParamName) {
        params.append(queryParamName, query);
    }

    return request<PaginatedResponse<T>>(`${endpoint}?${params.toString()}`);
}
