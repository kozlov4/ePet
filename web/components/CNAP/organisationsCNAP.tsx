"use client";
import { useEffect, useState } from "react";

interface Organisation {
    name: string;
    type: string;
    address: string;
    phone_number: number;
    email: string;
}

const sampleOrganisations: Organisation[] = [
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
    { name: "ДоброVet", type: "Ветеринарна клініка", address: "вул. Шевченка, 12", phone_number: 380501234567, email: "selychenko.hal@gmail.com" },
];

export function OrganisationsCNAP() {
    const [searchTerm, setSearchTerm] = useState('');
    const [orgs, setOrgs] = useState<Organisation[]>(sampleOrganisations);

    const filteredOrgs = orgs.filter((org) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
            org.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            org.type.toLowerCase().includes(lowerCaseSearchTerm) ||
            org.address.toLowerCase().includes(lowerCaseSearchTerm) ||
            (org.phone_number).toString().toLowerCase().includes(lowerCaseSearchTerm) ||
            org.email.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const handleFullInfoClick = (orgId: string) => {
        alert(`Showing full information for pet: ${orgId}`);

    };

    const handleRegisterPetClick = () => {
        alert('Navigating to pet registration form!');
    };

    return (
        <div className="w-full px-35 py-10">
            <h1 className="mb-5 font-medium text-4xl">
                Список організацій</h1>
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
                <button
                    onClick={handleRegisterPetClick}
                    className="w-full shrink-0 rounded-[10em] bg-white px-5 py-3 text-sm font-semibold ring transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer">
                    Зареєструвати організацію
                </button>
            </div>

            <div className="hidden grid-cols-7 pb-2 text-sm font-bold text-gray-500 md:grid text-center px-[16px]">
                <div className="col-span-1">Назва:</div>
                <div className="col-span-1">Тип:</div>
                <div className="col-span-1">Адреса:</div>
                <div className="col-span-1">Телефон:</div>
                <div className="col-span-1">email:</div>
                <div className="col-span-1"></div>
                <div className="col-span-1"></div>
            </div>

            <div className="flex flex-col bg-[rgba(217,217,217,0.27)] rounded-[2em] divide-y divide-gray-300">
                {filteredOrgs.map((org, index) => (
                    <div
                        key={index}
                        className="grid items-center p-4 md:grid-cols-7 text-center">
                        <div className="col-span-1 hidden font-medium md:block">{org.name}</div>
                        <div className="col-span-1 hidden font-medium md:block">{org.type}</div>
                        <div className="col-span-1 hidden font-medium md:block">{org.address}</div>
                        <div className="col-span-1 hidden font-medium md:block">{org.phone_number}</div>
                        <div className="col-span-1 hidden font-medium md:block">{org.email}</div>

                        <div className="col-span-2 text-right md:col-span-2 gap-6 flex justify-end">
                            <button
                                onClick={() => handleFullInfoClick(org.name)}
                                className="w-full shrink-0 rounded-[10em] bg-white px-5 py-3 text-sm font-semibold ring transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer">
                                <span>Редагувати</span>
                            </button>
                            <button
                                onClick={() => handleFullInfoClick(org.name)}
                                className="rounded-[10em] bg-black px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer">
                                <span>Видалити</span>
                            </button>
                        </div>
                        <div className="col-span-1 text-right md:col-span-1">

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}