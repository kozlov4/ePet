import { API_BASE, devLog } from '../utils/config';
import { handleAuthError } from '../utils/auth';
import { PaginatedResponse } from '../types/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  // Check for window to avoid SSR issues with localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // If body is FormData, let the browser set Content-Type (multipart/form-data with boundary)
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
      // Only handle auth error if we were expecting to be authenticated
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
    throw new ApiError(data.detail || data.message || `API Error: ${response.status}`, response.status, data);
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
    options: FetchPaginatedOptions
): Promise<PaginatedResponse<T>> {
    const { page, size, query, queryParamName } = options;
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (query && queryParamName) {
        params.append(queryParamName, query);
    }

    // The endpoint might already have query params, so we need to handle that safely? 
    // Usually endpoint here is just the path. Let's assume path.
    // If endpoint has params, we'd need to use & instead of ?. 
    // But consistent with previous utils/api.tsx which did `${endpoint}?${params}`.
    
    return request<PaginatedResponse<T>>(`${endpoint}?${params.toString()}`);
}
