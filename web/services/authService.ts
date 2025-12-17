import { request } from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_name: string;
  organization_type?: string;
  detail?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    return request<LoginResponse>('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formData.toString(),
      skipAuth: true,
    });
  },

  forgotPassword: async (email: string): Promise<any> => {
    return request('/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  resetPassword: async (token: string, password: string): Promise<any> => {
    return request('/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: password }),
      skipAuth: true,
    });
  }
};
