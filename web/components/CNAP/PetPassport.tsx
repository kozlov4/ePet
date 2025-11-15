'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


import ArrowBack from '../../assets/images/icons/ArrowBack';
import CopyIcon from '../../assets/images/icons/CopyIcon';

interface PetPassportData {
    pet_id: number;
    passport_number: string;
    img_url?: string;
    pet_name: string;
    pet_name_en?: string;
    date_of_birth: string;
    breed: string;
    breed_en?: string;
    gender: string;
    gender_en?: string;
    color: string;
    color_en?: string;
    species: string;
    species_en?: string;
    organization_id: number | null;
    owner_passport_number: string;
    identifier_type: string;
    identifier_type_en?: string;
    date: string;
    identifier_number: string;
}

export  function PetPassport({
    actionButton, changeButton     
}: {
    actionButton?: React.ReactNode,
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
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('Токен авторизації відсутній');
                }

                const response = await fetch(`https://upcity.live/pets/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Помилка завантаження даних');
                }

                const data = await response.json();
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
            navigator.clipboard.writeText(petData.passport_number);
            alert('Номер паспорта скопійовано!');
        }
    };

    const handleBack = () => {
        router.back();
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return dateString;
        }
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
        <div className="w-[369px] grid grid-cols-[max-content_1fr] gap-x-8 gap-y-3 bg-[#F5F5F5] rounded-2xl py-4 pl-6 pr-6">
            {fields.flatMap((field, index) => [
                <div key={`label-${index}`} className="flex flex-col gap-1">
                    <p className="text-sm text-black whitespace-nowrap">
                        {field.label}
                    </p>
                    {field.labelEn && (
                        <p className="text-xs text-[#B3B3B3] whitespace-nowrap">
                            {field.labelEn}
                        </p>
                    )}
                </div>,
                <div key={`value-${index}`} className="flex flex-col gap-1">
                    <p className="text-sm text-black">{field.value}</p>
                    {field.valueEn && (
                        <p className="text-xs text-[#B3B3B3]">
                            {field.valueEn}
                        </p>
                    )}
                </div>,
            ])}
        </div>
    );

    const handleDelete = async () => {
    const petId = router.query.id; 

    if (!petId) {
        alert("ID не знайдено у маршруті");
        return;
    }

    const confirmDelete = confirm("Видалити цього улюбленця?");
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("Токен авторизації відсутній");
            return;
        }

        const response = await fetch(`https://upcity.live/pets/delete/${petId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Помилка видалення");
        }

        alert("Улюбленця успішно видалено!");
       router.back()
    } catch (error) {
        alert(error instanceof Error ? error.message : "Невідома помилка");
    }
};

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[830px] w-full mx-auto my-12 flex flex-col gap-8">
                <div className="flex gap-10 items-start translate-x-[-80px]">
                    <button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 transition-[0.2s] cursor-pointer hover:bg-gray-300"
                    >
                        <ArrowBack/>
                    </button>
                    <p className="text-2xl">
                        Паспорт домашнього
                        <br />
                        улюбленця
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="text-4xl">{petData.passport_number}</p>
                    <button
                        onClick={handleCopyPassport}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    >
                        <CopyIcon/>
                    </button>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-10">
                        <img
                            src={petData.img_url}
                            alt=""
                            className="w-[200px] h-[250px] rounded-3xl"
                        />
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-1">
                                <p className="text-2xl">{petData.pet_name}</p>
                                <p className="text-sm">{petData.pet_name_en}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm">Дата народження:</p>
                                <p className="text-sm">Date of birth</p>
                                <p className="text-sm  text-[#B3B3B3]">
                                    {formatDate(petData.date_of_birth)}
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
                {!changeButton && (
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
                                value: formatDate(petData.date),
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
                    ">
                        Видалити
                    </button></div>
                )}
                {changeButton && (
                    <div
                    className="flex justify-start">
                    <button className="
                    px-4 py-2 w-[45%] 
                    bg-black text-white font-medium text-base 
                    rounded-3xl border border-transparent cursor-pointer
                    hover:bg-white hover:text-black hover:border-black
                    transition
                ">
                    Редагувати
                    </button></div>
                )}
            </div>
        </div>
    );
}
