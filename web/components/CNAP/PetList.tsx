'use client';

import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { Table } from '../../components/ui/Table';
import { petService } from '../../services/petService';
import { fetchPaginated } from '../../services/api';
import {
    ColumnDefinition,
    PaginatedResponse,
    Pet,
    ViewConfig,
} from '../../types/api';

export function PetList({
    all_fields_to_search,
}: {
    all_fields_to_search?: boolean;
}) {
    const router = useRouter();
    const activeView = (router.query.view as string) || 'animals';

    const handleAction = async (item: Pet, actionType: string) => {
        const id = item.pet_id;

        if (actionType === 'details') {
            router.push(`/Alley/pet-passport/${id}`);
        }

        if (actionType === 'delete') {
            if (window.confirm(`Ви впевнені, що хочете видалити ID: ${id}?`)) {
                try {
                    await petService.deletePet(item.pet_id);
                    router.reload();
                } catch (error) {
                    console.error('Failed to delete pet', error);
                    alert('Не вдалося видалити тварину');
                }
            }
        }
    };

    const animalColumns: ColumnDefinition<Pet>[] = [
        {
            accessor: 'animal_passport_number',
            header: 'ID:',
            cell: (pet) =>
                all_fields_to_search ? pet.pet_id : pet.animal_passport_number,
        },
        { accessor: 'breed', header: 'Порода:' },
        { accessor: 'gender', header: 'Стать:' },
        { accessor: 'species', header: 'Вид:' },
        {
            accessor: 'pet_id',
            header: '',
            cell: (pet, onActionCallback) => (
                <button
                    onClick={() => onActionCallback(pet, 'details')}
                    className="rounded-[10em] w-[70%] ml-[30%] bg-black px-4 py-2 text-[15px] font-semibold cursor-pointer text-white transition-all duration-300 hover:bg-white hover:text-black border-1 hover:border-black"
                >
                    Повна інформація
                </button>
            ),
        },
        {
            accessor: 'owner',
            header: '',
            cell: (pet, onActionCallback) => (
                <button
                    onClick={() => onActionCallback(pet, 'delete')}
                    className="rounded-[10em] bg-white border-2  border-black px-4 py-2 text-[15px] font-semibold text-black transition-all duration-300 hover:bg-black hover:text-white cursor-pointer"
                >
                    Видалити
                </button>
            ),
        },
    ];

    const viewConfigs: Record<string, ViewConfig<Pet>> = {
        animals: {
            endpoint: '/organizations/animals',
            queryParamName: all_fields_to_search
                ? 'search'
                : 'animal_passport_number',
            columns: animalColumns,
            title: 'Список тварин',
            addNewLink: '/Alley/pet-registration',
            addNewText: 'Додати тварину',
            searchPlaceholder: 'Пошук...',
        },
    };

    const config = viewConfigs[activeView];

    const fetchFunction = useCallback(
        (
            page: number,
            size: number,
            query: string,
        ): Promise<PaginatedResponse<any>> => {
            if (!config) {
                return Promise.reject(new Error('Конфігурація не знайдена'));
            }
            return fetchPaginated(config.endpoint, {
                page,
                size,
                query,
                queryParamName: config.queryParamName,
            });
        },
        [config],
    );

    if (!config) {
        return <div>Завантаження конфігурації або невірний URL...</div>;
    }

    return (
        <Table
            key={activeView}
            columns={config.columns}
            title={config.title}
            addNewLink={config.addNewLink}
            addNewText={config.addNewText}
            searchPlaceholder={config.searchPlaceholder}
            fetchFunction={fetchFunction}
            onAction={handleAction}
        />
    );
}
