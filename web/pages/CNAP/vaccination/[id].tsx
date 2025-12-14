import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ArrowBack from '../../../assets/images/icons/ArrowBack';
import CopyIcon from '../../../assets/images/icons/CopyIcon';
import { API_BASE, devLog } from '../../../utils/config';

interface VaccinationData {
    passport_number: string;
    update_datetime: string;
    vaccinations: VaccinationItem[];
}

interface VaccinationItem {
    drug_name: string;
    series_number: string;
    vaccination_date: string;
    valid_until: string;
    organization_name: string;
}

export default function VaccinationInfo() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vaccinationData, setVaccinationData] =
        useState<VaccinationData | null>(null);
    const { id } = router.query;
    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        if (!id) return;

        const fetchPetData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('Токен авторизації відсутній');
                }

                const response = await fetch(
                    `${API_BASE}/pets/${id}/vaccinations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Помилка завантаження даних');
                }

                const data = await response.json();
                devLog('Vaccination data:', data);
                setVaccinationData(data);
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
        if (vaccinationData?.passport_number) {
            navigator.clipboard.writeText(vaccinationData.passport_number);
            alert('Назва препарату скопійовано!');
        }
    };

    if (error || !vaccinationData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">
                    {error || 'Дані не знайдено'}
                </div>
            </div>
        );
    }

    const addVaccinationHandler = (id: string) => {
        router.push(`/CNAP/vaccination/add/${id}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[830px] w-full mx-auto my-12 flex flex-col gap-8">
                <div className="flex gap-10 items-center translate-x-[-80px]">
                    <button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 transition-[0.2s] cursor-pointer hover:bg-gray-300"
                    >
                        <ArrowBack />
                    </button>
                    <p className="text-2xl whitespace-nowrap">
                        Щеплення улюбленця
                    </p>
                </div>
                <div className="flex gap justify-between">
                    <div className="flex gap-2 items-center">
                        <p className="text-4xl">
                            {vaccinationData.passport_number}
                        </p>
                        <button
                            onClick={handleCopyPassport}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                        >
                            <CopyIcon />
                        </button>
                    </div>
                    <button
                        onClick={() =>
                            addVaccinationHandler(
                                typeof id === 'string'
                                    ? id
                                    : String(id?.[0] || ''),
                            )
                        }
                        className="rounded-[10em] bg-white px-14 py-2 text-[15px] font-semibold cursor-pointer text-black transition-all duration-300   border-1"
                    >
                        Нове щеплення
                    </button>
                </div>
                <div className="mt-8">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-left border-b border-gray-300">
                                    <p className="text-[13px]">
                                        Назва та серія:
                                    </p>
                                    <p className="text-[10px] text-[#B3B3B3]">
                                        Name and batch number
                                    </p>
                                </th>
                                <th className="px-6 py-4 text-left  border-b border-gray-300">
                                    <p className="text-[13px]">Дата:</p>
                                    <p className="text-[10px] text-[#B3B3B3]">
                                        Date
                                    </p>
                                </th>
                                <th className="px-6 py-4 text-left  border-b border-gray-300">
                                    <p className="text-[13px]">Лікар:</p>
                                    <p className="text-[10px] text-[#B3B3B3]">
                                        Veterinarian
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {vaccinationData.vaccinations.map(
                                (vaccination, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4  text-[20px]">
                                            {vaccination.drug_name}{' '}
                                            {vaccination.series_number}
                                        </td>
                                        <td className="px-6 py-4 text-[20px]">
                                            <div>
                                                {new Date(
                                                    vaccination.vaccination_date,
                                                ).toLocaleDateString('uk-UA', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                                {vaccination.valid_until && (
                                                    <span className="text-[#B3B3B3] text-[15px] block">
                                                        до{' '}
                                                        {new Date(
                                                            vaccination.valid_until,
                                                        ).toLocaleDateString(
                                                            'uk-UA',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4  text-[20px]">
                                            {vaccination.organization_name}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
