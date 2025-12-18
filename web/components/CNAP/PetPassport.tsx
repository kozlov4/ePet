'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

    const handleBack = () => {
        router.back();
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
        <div className="grid grid-cols-[1fr_1fr] gap-x-6 gap-y-4 bg-[#F5F5F5] rounded-2xl py-6 pl-6 pr-6 w-[368px]">
            {fields.map((field, index) => (
                <>
                    <div key={`${index}-label`} className="flex flex-col gap-1">
                        <p className="text-sm text-black whitespace-nowrap">
                            {field.label}
                        </p>
                        {field.labelEn && (
                            <p className="text-xs text-[#B3B3B3] whitespace-nowrap">
                                {field.labelEn}
                            </p>
                        )}
                    </div>
                    <div key={`${index}-value`} className="flex flex-col gap-1">
                        <p className="text-sm text-black break-words">
                            {field.value}
                        </p>
                        {field.valueEn && (
                            <p className="text-xs text-[#B3B3B3] break-words">
                                {field.valueEn}
                            </p>
                        )}
                    </div>
                </>
            ))}
        </div>
    );

    const handleDelete = async () => {
        const petId = router.query.id;

        if (!petId) {
            alert('ID не знайдено у маршруті');
            return;
        }

        const confirmDelete = confirm('Видалити цього улюбленця?');
        if (!confirmDelete) return;

        try {
            await petService.deletePet(Number(petId));
            alert('Улюбленця успішно видалено!');
            router.back();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Невідома помилка');
        }
    };

    const handleChange = async () => {
        router.push(`/Alley/pet-edition/${id}`);
    };

    return (
        <div className="">
            <div className="max-w-[830px] w-full mx-auto my-12 flex flex-col gap-8">
                <div className="flex gap-10 items-start translate-x-[-80px]">
                    <button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 transition-[0.2s] cursor-pointer hover:bg-gray-300"
                    >
                        <ArrowBack />
                    </button>
                    <p className="text-2xl">{`${
                        changeButton
                            ? 'Повна інформація'
                            : 'Паспорт домашнього улюбленця'
                    }`}</p>
                </div>
                {petData.passport_number != '—' && (
                    <div className="flex gap-2 items-center">
                        <p className="text-5xl">{petData.passport_number}</p>
                        <button
                            onClick={handleCopyPassport}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                        >
                            <CopyIcon />
                        </button>
                    </div>
                )}
                <div className="flex justify-between items-start">
                    <div className="flex gap-10 ">
                        <img
                            src={petData.img_url}
                            alt=""
                            className="w-[200px] h-[250px] rounded-3xl object-cover"
                        />
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-1">
                                <p className="text-2xl">{petData.pet_name}</p>
                                <p className="text-sm">{petData.pet_name_en}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[13px]">Дата народження:</p>
                                <p className="text-[10px] text-[#B3B3B3]">
                                    Date of birth
                                </p>
                                <p className="text-[13px] ">
                                    {formatUaDate(petData.date_of_birth)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 w-[368px]">
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
                                    value: petData.identifier_number,
                                },
                            ]}
                        />
                    </div>
                )}

                {actionButton && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleDelete}
                            className="
                        px-4 py-2 w-[45%] 
                        bg-black text-white font-medium text-base 
                        rounded-3xl border border-transparent cursor-pointer
                        hover:bg-white hover:text-black hover:border-black
                        transition
                    "
                        >
                            Видалити
                        </button>
                    </div>
                )}
                {changeButton && (
                    <div className="flex justify-start">
                        <button
                            className="
                    px-4 py-2 w-[45%] 
                    bg-black text-white font-medium text-base 
                    rounded-3xl border border-transparent cursor-pointer
                    hover:bg-white hover:text-black hover:border-black
                    transition"
                            onClick={handleChange}
                        >
                            Редагувати
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

PetPassport.showFooter = false;
