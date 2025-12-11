'use client';
import React, { useState, useEffect } from 'react';
import { Organization } from '../../types/api';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import ArrowBack from '../../assets/images/icons/ArrowBack';

const ORGANIZATION_TYPES = ['Ветклініка', 'Притулок'];
const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || '';

interface OrganizationPageProps {
    initialData?: Organization;
}

export default function OrganizationPage({
    initialData,
}: OrganizationPageProps) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState<Organization>({
        organization_id: '',
        organization_name: '',
        organization_type: '',
        city: '',
        street: '',
        building: '',
        phone_number: '',
        email: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const id = params?.id as string | undefined;
    const isEditMode = !!id && id !== 'create';

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            return;
        }

        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam));
                setFormData(parsedData);
            } catch (e) {
                console.error('Failed to parse organization data from URL', e);
                setError('Помилка при читанні даних організації.');
            }
        }
    }, [initialData, searchParams]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            const url = isEditMode
                ? ${API_BASE}/organizations/organizations/${id}
                : ${API_BASE}/organizations/create;

            const method = isEditMode ? 'PUT' : 'POST';

            const payload = { ...formData };
            if (!isEditMode) {
                delete payload.organization_id;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: Bearer ${token},
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            router.push('/CNAP/organizations');
        } catch (err) {
            setError('Виникла помилка при збереженні. Спробуйте ще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 px-35 py-10 flex justify-center items-center">
            <div className="w-full max-w-4xl">
                <div className="mb-8 flex items-center justify-start">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 rounded-full bg-black p-2 transition-[0.2s] cursor-pointer hover:bg-gray-300"
                    >
                        <ArrowBack />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {isEditMode
                            ? 'Редагування організації'
                            : 'Реєстрація організації'}
                    </h1>
                </div>
<div className="w-full justify-center max-w-4xl rounded-xl bg-[rgba(217,217,217,0.27)] p-6 shadow-lg sm:p-8 lg:p-10 mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl p-6 sm:p-8"
                    >
                        <div className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-transparent focus-within:border-gray-300 transition-colors">
                                    <input
                                        type="text"
                                        name="organization_name"
                                        value={formData.organization_name}
                                        onChange={handleInputChange}
                                        placeholder="Назва організації"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    <select
                                        name="organization_type"
                                        value={formData.organization_type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 bg-transparent appearance-none text-sm cursor-pointer"
                                        required
                                    >
                                        <option
                                            value=""
                                            disabled
                                            className="text-gray-400"
                                        >
                                            Тип організації
                                        </option>
                                        {ORGANIZATION_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
<div className="space-y-3 pt-2">
                                <div className="bg-white flex rounded-xl overflow-hidden shadow-sm border border-transparent focus-within:border-gray-300 transition-colors">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Місто"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="Вулиця"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="building"
                                        value={formData.building}
                                        onChange={handleInputChange}
                                        placeholder="Будинок"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-transparent focus-within:border-gray-300 transition-colors">
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        placeholder="Номер телефону"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Електронна адреса"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
<div className="mt-10">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white rounded-full py-4 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? 'Завантаження...'
                                    : isEditMode
                                    ? 'Зберегти зміни'
                                    : 'Зареєструвати'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
