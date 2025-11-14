'use client';
import { useCallback, useEffect, useState } from 'react';
import {
    ColumnDefinition,
    Organization,
    PaginatedResponse,
    ViewConfig,
} from '../../types/api';
import { ReusableTable } from '../Base/ReusableTable';
import { fetchPaginatedData } from '../../utils/api';

export function Organisations() {
    const activeView = 'organizations';
    const [searchTerm, setSearchTerm] = useState('');

    const orgColumns: ColumnDefinition<Organization>[] = [
        {
            accessor: 'organization_name',
            header: 'Назва:',
        },
        { accessor: 'organization_type', header: 'Тип:' },
        {
            accessor: 'city',
            header: 'Адреса:',
            cell: (org) => `${org.city}, ${org.street} ${org.building}` || '-',
        },
        { accessor: 'phone_number', header: 'Телефон:' },
        { accessor: 'email', header: 'email:' },
        {
            accessor: 'organization_id',
            header: '',
            cell: (org, onActionCallback) => (
                <button
                    onClick={() => onActionCallback(org, 'edit')}
                    className="rounded-[10em] px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-gray-800 cursor-pointer border border-black bg-white"
                >
                    Редагувати
                </button>
            ),
        },
        {
            accessor: 'organization_id',
            header: '',
            cell: (org, onActionCallback) => (
                <button
                    onClick={() => onActionCallback(org, 'delete')}
                    className="rounded-[10em] bg-black px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer"
                >
                    Видалити
                </button>
            ),
        },
    ];

    const viewConfigs: Record<string, ViewConfig> = {
        organizations: {
            endpoint: '/organizations/organizations',
            queryParamName: '',
            columns: orgColumns,
            title: 'Список організацій',
            addNewLink: '/CNAP/pet-registration',
            addNewText: 'Зареєструвати організацію',
            searchPlaceholder: 'Пошук...',
        },
    };
    const config = viewConfigs[activeView];

    const fetchFunction = useCallback(
        async (
            page: number,
            size: number,
            query: string,
        ): Promise<PaginatedResponse<Organization>> => {
            if (!config) {
                throw new Error('Конфігурація не знайдена');
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
    const handleAction = async (
        org: Organization,
        action: 'edit' | 'delete',
    ) => {
        if (action === 'edit') {
            // TODO: Implement edit logic
            alert(`Editing organization: ${org.organization_name}`);
        } else if (action === 'delete') {
            if (
                window.confirm(
                    `Are you sure you want to delete ${org.organization_name}?`,
                )
            ) {
                // TODO: Implement delete logic
                alert(`Deleting organization: ${org.organization_name}`);
            }
        }
    };

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
