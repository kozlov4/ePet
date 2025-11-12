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
} from '../../types/api';

export function FavoriteList() {
    const router = useRouter();
    const activeView = (router.query.view as string) || 'animals';

    const handleAction = (item: any, actionType: string) => {
        const id = item.pet_id || item.id;

        if (actionType === 'details') {
            alert(`(MainCNAP) Повна інформація для ID: ${id}`);
            console.log('Повна інформація:', item);
        }

        if (actionType === 'delete') {
            if (
                window.confirm(
                    `(MainCNAP) Ви впевнені, що хочете видалити ID: ${id}?`,
                )
            ) {
                console.log('Видалення...', item);
                alert(`Елемент ${id} видалено.`);
            }
        }

        if (actionType === 'edit') {
            alert(`(MainCNAP) Редагування ID: ${id}`);
            // router.push(`/admin/orgs/edit/${id}`)
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
            accessor: 'pet_id',
            header: '',
            cell: (pet, onActionCallback) => (
                <button
                    onClick={() => onActionCallback(pet, 'details')}
                    className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer"
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
                    className="rounded-lg bg-white border border-gray-300 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-gray-100 cursor-pointer"
                >
                    Видалити
                </button>
            ),
        },
    ];

    const orgColumns: ColumnDefinition<Organization>[] = [
        {
            accessor: 'organization_name',
            header: 'Назва',
        },
        {
            accessor: 'street',
            header: 'Адреса',
        },
        {
            accessor: 'phone_number',
            header: 'Телефон',
        },
        {
            accessor: 'email',
            header: 'Email',
        },
        {
            accessor: 'id',
            header: 'Дії',
            cell: (org, onActionCallback) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onActionCallback(org, 'edit')}
                        className="rounded-lg bg-gray-200 px-4 py-2 ..."
                    >
                        Редагувати
                    </button>
                    <button
                        onClick={() => onActionCallback(org, 'delete')}
                        className="rounded-lg bg-red-600 text-white px-4 py-2 ..."
                    >
                        Видалити
                    </button>
                </div>
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
            addNewLink: '/CNAP/pet-registration',
            addNewText: 'Додати тварину',
            searchPlaceholder: 'Пошук...',
        },
        orgs: {
            endpoint: '/organizations',
            queryParamName: 'organization_name',
            columns: orgColumns,
            title: 'Список організацій',
            addNewLink: '/admin/org-registration',
            addNewText: 'Додати організацію',
            searchPlaceholder: 'Пошук за назвою...',
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
