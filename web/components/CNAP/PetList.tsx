'use client';

import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { Table } from '../../components/ui/Table';
import { ColumnDefinition, PaginatedResponse, Pet } from '../../types/api';
import { fetchPaginatedData } from '../../utils/api';
import { API_BASE } from '../../utils/config';

export function PetList() {
    const router = useRouter();
    const activeView = (router.query.view as string) || 'animals';

    const handleAction = async (item: any, actionType: string) => {
        const id = item.pet_id || item.id;

        if (actionType === 'details') {
            router.push(`/Alley/pet-passport/${id}`);
        }

        if (actionType === 'delete') {
            if (window.confirm(`Ви впевнені, що хочете видалити ID: ${id}?`)) {
                const token = localStorage.getItem('access_token');
                const res = await fetch(
                    `${API_BASE}/pets/delete/${item.pet_id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!res.ok) {
                    throw new Error('Failed to delete pet');
                }

                router.reload();
            }
        }
    };

    const animalColumns: ColumnDefinition<Pet>[] = [
        {
            accessor: 'animal_passport_number',
            header: 'ID:',
            cell: (pet) => pet.animal_passport_number || pet.pet_id,
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

    interface ViewConfig {
        endpoint: string;
        queryParamName: string;
        columns: ColumnDefinition<any>[];
        title: string;
        addNewLink: string;
        addNewText: string;
        searchPlaceholder: string;
    }

    const viewConfigs: Record<string, ViewConfig> = {
        animals: {
            endpoint: '/organizations/animals',
            queryParamName: 'animal_passport_number',
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
            return fetchPaginatedData(config.endpoint, {
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
