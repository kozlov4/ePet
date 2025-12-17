'use client';

import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleAction = async (item: Pet, actionType: string) => {
        const id = item.pet_id;

        if (actionType === 'details') {
            router.push(`/Alley/pet-passport/${id}`);
        }

        if (actionType === 'delete') {
            setSelectedPet(item);
            setShowDeleteModal(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedPet) return;

        try {
            setDeleting(true);
            await petService.deletePet(selectedPet.pet_id);
            setShowDeleteModal(false);
            setSelectedPet(null);
            router.reload();
        } catch (error) {
            console.error('Failed to delete pet', error);
            alert('Не вдалося видалити тварину');
        } finally {
            setDeleting(false);
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
                    className="rounded-[10em] w-[70%] ml-[30%] bg-black px-4 py-2 text-[15px] font-semibold cursor-pointer text-white transition-all duration-300 hover:bg-white hover:text-black border border-black hover:shadow-lg hover:shadow-black/30 active:scale-95"
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
                    className="rounded-[10em] bg-white border-2 border-black px-4 py-2 text-[15px] font-semibold text-black transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-95 cursor-pointer"
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
                                Ви дійсно бажаєте видалити тварину з ID{' '}
                                <span className="font-semibold">
                                    {selectedPet?.animal_passport_number ||
                                        selectedPet?.pet_id}
                                </span>
                                ?
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() =>
                                        setShowDeleteModal(false)
                                    }
                                    className="w-1/2 py-2 border rounded-2xl hover:bg-gray-100 transition cursor-pointer"
                                >
                                    Скасувати
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="w-1/2 py-2 cursor-pointer bg-black text-white rounded-2xl hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {deleting
                                        ? 'Видалення...'
                                        : 'Видалити'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
