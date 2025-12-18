'use client';

import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { Table } from '../../components/ui/Table';
import {
    ColumnDefinition,
    PaginatedResponse,
    Pet,
    ViewConfig,
} from '../../types/api';
import { fetchPaginated } from '../../services/api';

export function FavoriteList({
    activeView,
}: {
    activeView: 'cnap' | 'vetclinic';
}) {
    const router = useRouter();
    const currentPath = router.pathname;

    const handleAction = (item: Pet, actionType: string) => {
        const id = item.pet_id;

        if (actionType === 'details') {
            if (currentPath.includes('/CNAP')) {
                router.push(`/CNAP/pet-passport/${id}`);
            } else if (currentPath.includes('/Vet-Clinic')) {
                router.push(`/Vet-Clinic/pet-passport/${id}`);
            }
        } else if (actionType === 'vaccination') {
            router.push(`/Vet-Clinic/vaccination/${id}`);
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
                <div className="flex flex-row w-[100%] gap-5 justify-center">
                    {activeView === 'cnap' ? (
                        <>
                            <button
                                onClick={() => onActionCallback(pet, 'details')}
                                className="cursor-pointer rounded-[10em] bg-black px-4 py-2 text-[15px] font-medium text-white border border-black transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-black/30 active:scale-95 "
                            >
                                Повна інформація
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onActionCallback(pet, 'details')}
                                className="rounded-[10em] bg-white px-4 py-2 text-[15px] font-medium text-black border border-black cursor-pointer transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-95"
                            >
                                Повна інформація
                            </button>
                        </>
                    )}
                    {activeView === 'vetclinic' && (
                        <button
                            onClick={() => onActionCallback(pet, 'vaccination')}
                            className="rounded-[10em] bg-black px-4 py-2 text-[15px] font-medium text-white border border-black cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-black/30 active:scale-95"
                        >
                            Щеплення
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const viewConfigs: Record<string, ViewConfig<Pet>> = {
        cnap: {
            endpoint: '/organizations/animals',
            queryParamName: 'animal_passport_number',
            columns: animalColumns,
            title: 'Паспорт домашнього улюбленця',
            addNewLink: '/CNAP/pet-registration',
            addNewText: 'Зареєструвати улюбленця',
            searchPlaceholder: 'Пошук...',
        },
        vetclinic: {
            endpoint: '/organizations/animals',
            queryParamName: 'animal_passport_number',
            columns: animalColumns,
            title: 'Список улюбленців',
            addNewLink: '/CNAP/pet-registration',
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
