import { Notification, Organization } from '../types/api';
import { request } from './api';

export const organizationService = {
    getOrganizationList: async (): Promise<Notification[]> => {
        return request<Notification[]>('/organizations/organization/list');
    },

    getOrganizationInfo: async (): Promise<Organization> => {
        return request<Organization>('/organizations/info');
    },

    createOrganization: async (data: Organization): Promise<Organization> => {
        const payload = { ...data };
        delete (payload as any).organization_id;
        return request<Organization>('/organizations/create', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    updateOrganization: async (
        id: string,
        data: Organization,
    ): Promise<Organization> => {
        return request<Organization>(`/organizations/organizations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    getOrganization: async (id: string): Promise<Organization> => {
        return request<Organization>(`/organizations/organizations/${id}`);
    },

    deleteOrganization: async (id: string): Promise<void> => {
        return request(`/organizations/organizations/${id}`, {
            method: 'DELETE',
        });
    },
};
