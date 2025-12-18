'use client';

import router from 'next/router';
import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {ColumnDefinition, Organization, PaginatedResponse, ViewConfig, } from '../../types/api';
import { fetchPaginated } from '../../services/api';
import { organizationService } from '../../services/organizationService';
import { Table } from '../ui/Table';

export default function Organizations() {
    const activeView = 'organizations';

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [deleting, setDeleting] = useState(false);

    const orgColumns: ColumnDefinition<Organization>[] = [
        { accessor: 'organization_name', header: 'Назва:' },
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
                    className="rounded-[10em] px-4 py-2 text-[15px] font-semibold bg-white text-black border border-black cursor-pointer transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-95"
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
                    className="rounded-[10em] bg-black px-4 py-2 text-[15px] font-semibold text-white border border-black cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-black/30 active:scale-95"
                >
                    Видалити
                </button>
            ),
        },
    ];

    const viewConfigs: Record<string, ViewConfig<Organization>> = {
        organizations: {
            endpoint: '/organizations/organizations',
            queryParamName: 'organization_name',
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
            return fetchPaginated(config.endpoint, {
                page,
                size,
                query,
                queryParamName: config.queryParamName,
            });
        },
        [config],
    );

    const handleAction = async (
        org: Organization,
        actionType: string,
    ): Promise<void> => {
        if (actionType === 'edit') {
            const dataStr = encodeURIComponent(JSON.stringify(org));
            router.push(
                `/CNAP/organization/${org.organization_id}?data=${dataStr}`,
            );
        }

        if (actionType === 'delete') {
            setSelectedOrg(org);
            setShowDeleteModal(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedOrg) return;

        try {
            setDeleting(true);
            await organizationService.deleteOrganization(
                selectedOrg.organization_id,
            );
            setShowDeleteModal(false);
            setSelectedOrg(null);
            router.reload();
        } catch (error) {
            console.error('Error deleting organization:', error);
            alert('Failed to delete organization');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
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

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowDeleteModal(false)}
                        />

                        <motion.div
                            className="relative bg-white rounded-3xl p-6 w-[420px] z-10"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <p className="text-xl text-center mb-2">
                                Підтвердження видалення
                            </p>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Ви дійсно бажаєте видалити організацію{' '}
                                <span className="font-semibold">
                                    {selectedOrg?.organization_name}
                                </span>
                                ?
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-1/2 py-2 border rounded-2xl hover:bg-gray-100 transition cursor-pointer"
                                >
                                    Скасувати
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="w-1/2 py-2 cursor-pointer bg-black text-white rounded-2xl hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {deleting ? 'Видалення...' : 'Видалити'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
