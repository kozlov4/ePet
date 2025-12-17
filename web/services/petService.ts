import { GenerateExtractRequest, GenerateExtractResponse, PetPassportData, UserPet } from '../types/api';
import { request } from './api';

export const petService = {
  getPet: async (petId: number | string): Promise<PetPassportData> => {
    return request<PetPassportData>(`/pets/${petId}`);
  },

  registerPet: async (data: FormData): Promise<any> => {
    return request('/pets', {
      method: 'POST',
      body: data,
    });
  },

  updatePet: async (petId: number, data: FormData): Promise<any> => {
    return request(`/pets/${petId}/update`, {
      method: 'POST',
      body: data,
    });
  },

  deletePet: async (petId: number): Promise<void> => {
    return request(`/pets/delete/${petId}`, {
      method: 'DELETE',
    });
  },

  getUserPets: async (): Promise<UserPet[]> => {
    const data = await request<UserPet[] | { items: UserPet[] }>('/users/me/pets');
    return Array.isArray(data) ? data : data.items || [];
  },

  generateExtract: async (data: GenerateExtractRequest): Promise<GenerateExtractResponse> => {
    return request<GenerateExtractResponse>('/pets/generate-report', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
