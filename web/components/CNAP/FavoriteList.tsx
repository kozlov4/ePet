'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { ReusableTable } from '../../components/Base/ReusableTable';
import { fetchPaginatedData } from '../../utils/api';
import {
    ColumnDefinition,
    Pet,
    Organization,
    PaginatedResponse,
    ViewConfig,
} from '../../types/api';

export function FavoriteList() {
    const router = useRouter();
    const activeView = 'animals';

    const handleAction = (item: any, actionType: string) => {
        const id = item.pet_id || item.id;

        if (actionType === 'details') {
            alert(`(MainCNAP) Повна інформація для ID: ${id}`);
        }
    };

    const animalColumns: ColumnDefinition<Pet>[] = [
        {
            accessor: 'animal_passport_number',
            header: 'ID:',
            cell: (pet) => pet.animal_passport_number || 'null',
        },
        { accessor: 'breed', header: 'Порода:' },
        { accessor: 'gender', header: 'Стать:' },
        { accessor: 'species', header: 'Вид:' },
        {
            accessor: 'owner',
            header: 'Власник:',
            cell: (pet) => pet.owner?.passport_number || 'null',
        },
        {
            accessor: 'pet_id',
            header: '',
            cell: (pet, onActionCallback) => (
                <button
                    onClick={() => onActionCallback(pet, 'details')}
                    className="rounded-[10em] bg-black px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer"
                >
                    Повна інформація
                </button>
            ),
        },
    ];

    const viewConfigs: Record<string, ViewConfig> = {
        animals: {
            endpoint: '/organizations/animals',
            queryParamName: 'animal_passport_number',
            columns: animalColumns,
            title: 'Паспорт домашнього улюбленця',
            addNewLink: '/CNAP/pet-registration',
            addNewText: 'Зареєструвати улюбленця',
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
        <ReusableTable
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
