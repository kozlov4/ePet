"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Pet {
    id: string;
    breed: string;
    gender: 'Ч' | 'Ж';
    type: string;
    ownerId: string;
}

const samplePets: Pet[] = [
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Кіт', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ж', type: 'Кіт', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Сфінкс', gender: 'Ч', type: 'Кіт', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Кіт', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ж', type: 'Кіт', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Собака', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Собака', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Собака', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Собака', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Собака', ownerId: '009154744' },
    { id: 'UA AA 658199', breed: 'Метис', gender: 'Ч', type: 'Собака', ownerId: '009154744' },
];

export function MainCNAP() {
    const [searchTerm, setSearchTerm] = useState('');
    const [pets, setPets] = useState<Pet[]>(samplePets);

    const filteredPets = pets.filter((pet) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
            pet.id.toLowerCase().includes(lowerCaseSearchTerm) ||
            pet.breed.toLowerCase().includes(lowerCaseSearchTerm) ||
            pet.gender.toLowerCase().includes(lowerCaseSearchTerm) ||
            pet.type.toLowerCase().includes(lowerCaseSearchTerm) ||
            pet.ownerId.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const handleFullInfoClick = (petId: string) => {
        alert(`Showing full information for pet: ${petId}`);

    };

    return (
        <div className="w-full bg-gray-50 px-35 py-10">
            <h1 className="mb-5 font-medium text-4xl">
                Паспорт домашнього улюбленця</h1>
            <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex w-full items-center rounded-lg bg-white p-2 shadow-md/10 sm:max-w-b">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mx-2 text-gray-400"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Пошук"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                </div>
                <Link href="/CNAP/pet-registration"
                    className="w-full shrink-0 rounded-[10em] bg-white px-5 py-3 text-sm font-semibold ring transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer">
                    Зареєструвати улюбленця
                </Link>
            </div>

            <div className="hidden grid-cols-6 pb-2 text-sm font-bold text-gray-500 md:grid text-center px-[16px]">
                <div className="col-span-1">ID:</div>
                <div className="col-span-1">Порода:</div>
                <div className="col-span-1">Стать:</div>
                <div className="col-span-1">Вид:</div>
                <div className="col-span-1">Власник:</div>
                <div className="col-span-1"></div>
            </div>

            <div className="flex flex-col bg-[rgba(217,217,217,0.27)] rounded-[2em] divide-y divide-gray-300">
                {filteredPets.map((pet, index) => (
                    <div
                        key={index}
                        className="grid items-center p-4 md:grid-cols-6 text-center">
                        <div className="col-span-1 hidden font-medium md:block">{pet.id}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.breed}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.gender}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.type}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.ownerId}</div>

                        <div className="col-span-2 text-right md:col-span-1">
                            <button
                                onClick={() => handleFullInfoClick(pet.id)}
                                className="rounded-[10em] bg-black px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer">
                                <span>Повна інформація</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}