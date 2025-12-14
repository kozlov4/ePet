'use client';
import { useCallback, useState } from 'react';
import {
    ColumnDefinition,
    Organization,
    PaginatedResponse,
    ViewConfig,
} from '../../types/api';
import { fetchPaginatedData } from '../../utils/api';
import { Table } from '../ui/Table';
import router from 'next/router';
import { API_BASE } from '../../utils/config';

export function Organizations() {
    const activeView = 'organizations';

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
            addNewLink: '/CNAP/organization/create',
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
            const dataStr = encodeURIComponent(JSON.stringify(org));
            router.push(
                `/CNAP/organization/${org.organization_id}?data=${dataStr}`,
            );
        } else if (action === 'delete') {
            if (
                window.confirm(
                    `Are you sure you want to delete ${org.organization_name}?`,
                )
            ) {
                const token = localStorage.getItem('access_token');
                const res = await fetch(
                    `${API_BASE}/organizations/organizations/${org.organization_id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!res.ok) {
                    throw new Error('Failed to delete organization');
                }

                router.reload();
            }
        }
    };
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
