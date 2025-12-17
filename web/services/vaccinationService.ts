import { request } from './api';

export interface VaccinationItem {
    drug_name: string;
    series_number: string;
    vaccination_date: string;
    valid_until: string;
    organization_name?: string;
}

export interface VaccinationData {
    passport_number: string;
    update_datetime: string;
    vaccinations: VaccinationItem[];
}

export interface AddVaccinationRequest {
    drug_name: string;
    series_number: string;
    vaccination_date: string;
    valid_until: string;
}

export const vaccinationService = {
  getVaccinations: async (petId: string | number): Promise<VaccinationData> => {
    return request<VaccinationData>(`/pets/${petId}/vaccinations`);
  },

  addVaccination: async (petId: string | number, data: AddVaccinationRequest): Promise<void> => {
    return request(`/vaccinations/${petId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
