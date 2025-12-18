'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ArrowBack from '../../assets/images/icons/ArrowBack';
import CopyIcon from '../../assets/images/icons/CopyIcon';
import { petService } from '../../services/petService';
import { PetPassportData } from '../../types/api';
import { copyToClipboard } from '../../utils/clipboard';
import { formatUaDate } from '../../utils/date';

export function PetPassport({
    actionButton,
    changeButton,
}: {
    actionButton?: React.ReactNode;
    changeButton?: React.ReactNode;
}) {
    const router = useRouter();
    const { id } = router.query;

    const [petData, setPetData] = useState<PetPassportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: 'easeOut' },
        },
    };

    useEffect(() => {
        if (!id) return;

        const fetchPetData = async () => {
            try {
                const data = await petService.getPet(id as string);
                setPetData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Невідома помилка',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [id]);

    const handleCopyPassport = () => {
        if (petData?.passport_number) {
            copyToClipboard(
                petData.passport_number,
                'Номер паспорта скопійовано!',
            );
        }
    };

    const handleBack = () => router.back();

    const handleDelete = () => setShowDeleteModal(true);

    const confirmDeletePet = async () => {
        if (!id) return;

        try {
            setDeleting(true);
            await petService.deletePet(Number(id));
            router.back();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Невідома помилка');
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleChange = () => {
        router.push(`/Alley/pet-edition/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Завантаження...</div>
            </div>
        );
    }

    if (error || !petData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">
                    {error || 'Дані не знайдено'}
                </div>
            </div>
        );
    }

    interface InfoFieldItem {
        label: string;
        value: string;
        labelEn?: string;
        valueEn?: string;
    }

    const InfoField = ({ fields }: { fields: InfoFieldItem[] }) => (
        <div className="grid grid-cols-[1fr_1fr] gap-x-6 gap-y-4 bg-[#F5F5F5] rounded-2xl py-6 px-6 w-[368px]">
            {fields.map((field, index) => (
                <div key={index} className="contents">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm">{field.label}</p>
                        {field.labelEn && (
                            <p className="text-xs text-[#B3B3B3]">
                                {field.labelEn}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm break-words">{field.value}</p>
                        {field.valueEn && (
                            <p className="text-xs text-[#B3B3B3] break-words">
                                {field.valueEn}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <div className="max-w-[830px] mx-auto my-12 flex flex-col gap-8">
                <motion.div
                    className="flex gap-10 items-start translate-x-[-80px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <motion.button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 cursor-pointer hover:bg-gray-300 transition"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowBack />
                    </motion.button>
                    <p className="text-2xl">
                        {changeButton
                            ? 'Повна інформація'
                            : 'Паспорт домашнього улюбленця'}
                    </p>
                </motion.div>

                {petData.passport_number !== '—' && (
                    <motion.div
                        className="flex gap-2 items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <p className="text-5xl">{petData.passport_number}</p>
                        <motion.button
                            onClick={handleCopyPassport}
                            className="hover:opacity-70 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <CopyIcon />
                        </motion.button>
                    </motion.div>
                )}

                <motion.div
                    className="flex justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="flex gap-10">
                        <motion.img
                            src={petData.img_url}
                            alt=""
                            className="w-[200px] h-[250px] rounded-3xl object-cover"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="flex flex-col gap-8">
                            <div>
                                <p className="text-2xl">{petData.pet_name}</p>
                                <p className="text-sm">{petData.pet_name_en}</p>
                            </div>
                            <div>
                                <p className="text-[13px]">Дата народження:</p>
                                <p className="text-[10px] text-[#B3B3B3]">
                                    Date of birth
                                </p>
                                <p className="text-[13px]">
                                    {formatUaDate(petData.date_of_birth)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <InfoField
                            fields={[
                                {
                                    label: 'Порода:',
                                    labelEn: 'Breed',
                                    value: petData.breed,
                                    valueEn: petData.breed_en,
                                },
                                {
                                    label: 'Стать:',
                                    labelEn: 'Gender',
                                    value: petData.gender,
                                    valueEn: petData.gender_en,
                                },
                            ]}
                        />
                        <InfoField
                            fields={[
                                {
                                    label: 'Масть:',
                                    labelEn: 'Coat',
                                    value: petData.color,
                                    valueEn: petData.color_en,
                                },
                                {
                                    label: 'Вид:',
                                    labelEn: 'Species',
                                    value: petData.species,
                                    valueEn: petData.species_en,
                                },
                            ]}
                        />
                    </div>
                </div>
                {actionButton && (
                    <div className="flex justify-between">
                        <InfoField
                            fields={[
                                {
                                    label: 'Місцезнаходження чіпу:',
                                    labelEn: 'Chip location',
                                    value: petData.identifier_type,
                                    valueEn: petData.identifier_type_en,
                                },
                                {
                                    label: 'Дата чіпування:',
                                    labelEn: 'Chip date',
                                    value: formatUaDate(petData.date),
                                },
                                {
                                    label: 'Номер чіпу:',
                                    labelEn: 'Chip number',
                                    value: petData.identifier_number,
                                },
                            ]}
                        />
                        <InfoField
                            fields={[
                                {
                                    label: 'Власник:',
                                    labelEn: 'Owner',
                                    value: petData.owner_passport_number,
                                },
                                {
                                    label: 'Орган що видав:',
                                    labelEn: 'Issuing authority',
                                    value: petData.organization_id?.toString() || '',
                                },
                            ]}
                        />
                    </div>
                )}

                {actionButton && (
                    <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.button
                            onClick={handleDelete}
                            className="w-[45%] py-2 cursor-pointer bg-black text-white rounded-3xl hover:bg-white hover:text-black hover:border-black border transition"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Видалити
                        </motion.button>
                    </motion.div>
                )}

                {changeButton && (
                    <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                    >
                        <motion.button
                            onClick={handleChange}
                            className="w-[45%] py-2 bg-black text-white rounded-3xl hover:bg-white hover:text-black hover:border-black border transition"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Редагувати
                        </motion.button>
                    </motion.div>
                )}
            </div>

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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
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
                                Ви дійсно бажаєте видалити цю тварину?
                            </p>

                            <div className="flex gap-4">
                                <motion.button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-1/2 py-2 border rounded-2xl hover:bg-gray-100 transition cursor-pointer"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Скасувати
                                </motion.button>
                                <motion.button
                                    onClick={confirmDeletePet}
                                    disabled={deleting}
                                    className="w-1/2 py-2 cursor-pointer bg-black text-white rounded-2xl hover:bg-red-600 transition disabled:opacity-50"
                                    whileHover={{ scale: deleting ? 1 : 1.04 }}
                                    whileTap={{ scale: deleting ? 1 : 0.95 }}
                                >
                                    {deleting ? 'Видалення...' : 'Видалити'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

PetPassport.showFooter = false;
