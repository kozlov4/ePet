interface Owner { // TODO: Change later
    passport_number: string;
}

export interface Pet {
    species: string;
    breed: string;
    gender: 'Ч' | 'Ж';
    animal_passport_number: string | null;
    owner: Owner | null;
}

export interface PaginatedResponse {
    total_items: number;
    total_pages: number;
    page: number;
    size: number;
    items: Pet[];
}
