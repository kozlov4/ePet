'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ArrowBack from '../../assets/images/icons/ArrowBack';
import { Organization } from '../../types/api';
import { devError } from '../../utils/config';
import { organizationService } from '../../services/organizationService';
import { ApiError } from '../../services/api';

const ORGANIZATION_TYPES = ['Ветклініка', 'Притулок'];

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
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
                devError('Failed to parse organization data from URL', e);
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
        setFieldErrors((prev) => {
            if (!prev[name]) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    const parseValidationErrors = (data: unknown) => {
        const issues = Array.isArray(data)
            ? data
            : (data as any)?.detail && Array.isArray((data as any).detail)
            ? (data as any).detail
            : null;

        if (!issues) return null;

        const nextFieldErrors: Record<string, string> = {};
        const nonFieldMessages: string[] = [];

        for (const issue of issues) {
            const loc = (issue as any)?.loc;
            const msg = (issue as any)?.msg;
            const type = (issue as any)?.type;
            if (typeof msg !== 'string') continue;

            let cleanMsg = msg.replace(/^Value error,\s*/i, '');
            if (
                type === 'enum' ||
                /^Input should be\s/i.test(cleanMsg) ||
                /^Input should be\s*/i.test(msg)
            ) {
                cleanMsg = 'Оберіть коректне місто.';
            }

            if (Array.isArray(loc) && loc.length) {
                const field = loc[loc.length - 1];
                if (typeof field === 'string') {
                    if (!nextFieldErrors[field]) {
                        nextFieldErrors[field] = cleanMsg;
                    }
                    continue;
                }
            }

            nonFieldMessages.push(cleanMsg);
        }

        const hasFieldErrors = Object.keys(nextFieldErrors).length > 0;
        return {
            fieldErrors: nextFieldErrors,
            message: hasFieldErrors
                ? 'Перевірте поля.'
                : nonFieldMessages.length
                ? nonFieldMessages[0]
                : 'Виникла помилка валідації. Перевірте введені дані.',
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            if (isEditMode) {
                await organizationService.updateOrganization(id as string, formData);
            } else {
                await organizationService.createOrganization(formData);
            }

            router.push('/CNAP/organizations');
        } catch (err) {
            if (err instanceof ApiError) {
                const parsed = parseValidationErrors(err.data);
                if (parsed) {
                    setFieldErrors(parsed.fieldErrors);
                    setError(parsed.message);
                    return;
                }
                if (typeof err.message === 'string' && err.message.trim().length > 0) {
                     setError(err.message);
                     return;
                }
            }
            
            setError('Виникла помилка при збереженні. Спробуйте ще раз.');
            devError('Error saving organization:', err);
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
                                    {fieldErrors.organization_name && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.organization_name}
                                        </div>
                                    )}
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
                                    {fieldErrors.organization_type && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.organization_type}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-transparent focus-within:border-gray-300 transition-colors">
                                <div className="grid grid-cols-1 divide-y divide-gray-100">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Місто"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    {fieldErrors.city && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.city}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="Вулиця"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    {fieldErrors.street && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.street}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        name="building"
                                        value={formData.building}
                                        onChange={handleInputChange}
                                        placeholder="Будинок"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    {fieldErrors.building && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.building}
                                        </div>
                                    )}
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
                                    {fieldErrors.phone_number && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.phone_number}
                                        </div>
                                    )}
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Електронна адреса"
                                        className="w-full px-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                                        required
                                    />
                                    {fieldErrors.email && (
                                        <div className="px-4 pb-3 text-xs text-red-600">
                                            {fieldErrors.email}
                                        </div>
                                    )}
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
