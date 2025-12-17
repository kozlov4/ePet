import { ReactNode } from 'react';

interface Owner {
    passport_number: string;
}

export interface Pet {
    pet_id: number;
    species: string;
    breed: string;
    gender: string;
    animal_passport_number: string | null;
    owner: Owner | null;
    series?: string;
}
export interface PetPassportData {
    pet_id: number;
    passport_number: string;
    img_url?: string;
    pet_name: string;
    pet_name_en?: string;
    date_of_birth: string;
    breed: string;
    breed_en?: string;
    gender: string;
    gender_en?: string;
    color: string;
    color_en?: string;
    species: string;
    species_en?: string;
    organization_id: number | null;
    owner_passport_number: string;
    identifier_type: string;
    identifier_type_en?: string;
    date: string;
    identifier_number: string;
}

export interface Organization {
    organization_id: string;
    organization_name: string;
    organization_type: string;
    city: string;
    street: string;
    building: string;
    phone_number: string;
    email: string;
}

export interface PaginatedResponse<T> {
    total_items: number;
    total_pages: number;
    page: number;
    size: number;
    items: T[];
}

export interface ColumnDefinition<T> {
    accessor: keyof T;
    header: string;
    cell?: (
        item: T,
        onAction: (item: T, actionType: string) => void,
    ) => ReactNode;
}

export interface ViewConfig<T = any> {
    endpoint: string;
    queryParamName: string;
    columns: ColumnDefinition<T>[];
    title: string;
    addNewLink: string;
    addNewText?: string;
    searchPlaceholder: string;
}

export interface User {
    name: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    organizationType: string | null;
    login: (userData: User, token: string, organizationType?: string) => void;
    logout: () => void;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export type NotificationType = 'adoption_request' | 'cancellation' | 'success';

export interface Notification {
    request_id: number;
    creation_date: string;
    user_full_name: string;
    user_email: string;
    pet_id: number;
}

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
