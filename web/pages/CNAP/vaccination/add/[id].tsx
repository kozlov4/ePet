import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ArrowBack from '../../../../assets/images/icons/ArrowBack';
import CopyIcon from '../../../../assets/images/icons/CopyIcon';

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

export default function AddVaccination() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vaccinationData, setVaccinationData] =
        useState<VaccinationData | null>(null);
    const [formData, setFormData] = useState({
        drug_name: '',
        series_number: '',
        vaccination_date: '',
        valid_until: '',
    });
    const [submitting, setSubmitting] = useState(false);
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
                    `https://upcity.live/pets/${id}/vaccinations`,
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
            alert('Номер паспорта скопійовано!');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Токен авторизації відсутній');
            }

            const petId = typeof id === 'string' ? id : String(id?.[0] || '');

            const response = await fetch(
                `https://upcity.live/vaccinations/${petId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        drug_name: formData.drug_name,
                        series_number: formData.series_number,
                        vaccination_date: formData.vaccination_date,
                        valid_until: formData.valid_until,
                    }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.detail || 'Помилка додавання вакцинації';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            router.push(`/CNAP/vaccination/${petId}`);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Помилка додавання вакцинації';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Завантаження...</div>
            </div>
        );
    }

    if (error || !vaccinationData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">
                    {error || 'Дані не знайдено'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[830px] w-full mx-auto my-12 flex flex-col gap-8">
                <div className="flex gap-10 items-start translate-x-[-80px]">
                    <button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 transition-[0.2s] cursor-pointer hover:bg-gray-300"
                    >
                        <ArrowBack />
                    </button>
                    <p className="text-2xl">
                        Щеплення
                        <br />
                        улюбленця
                    </p>
                </div>
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
                <div className="bg-[#F5F5F5] rounded-2xl px-8 py-5">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium flex flex-col">
                                <span>Назва:</span>
                                <span className="text-[#B3B3B3] text-[10px">
                                    Name
                                </span>
                            </label>
                            <input
                                type="text"
                                name="drug_name"
                                value={formData.drug_name}
                                onChange={handleInputChange}
                                placeholder="Nobivac Rabies"
                                className="w-full rounded-xl bg-white px-4 py-3 text-[15px] border border-gray-200 focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium flex flex-col">
                                <span>Серія:</span>

                                <span className="text-[#B3B3B3] text-[10px">
                                    batch number
                                </span>
                            </label>
                            <input
                                type="text"
                                name="series_number"
                                value={formData.series_number}
                                onChange={handleInputChange}
                                placeholder="A488A25"
                                className="w-full rounded-xl bg-white px-4 py-3 text-[15px] border border-gray-200 focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium flex flex-col">
                                <span>Дата:</span>
                                <span className="text-[#B3B3B3] text-[10px">
                                    Date
                                </span>
                            </label>
                            <input
                                type="date"
                                name="vaccination_date"
                                value={formData.vaccination_date}
                                onChange={handleInputChange}
                                className="w-full rounded-xl bg-white px-4 py-3 text-[15px] border border-gray-200 focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium flex flex-col">
                                <span>До якого дійсне:</span>
                                <span className="text-[#B3B3B3] text-[10px] ">
                                    Date
                                </span>
                            </label>
                            <input
                                type="date"
                                name="valid_until"
                                value={formData.valid_until}
                                onChange={handleInputChange}
                                className="w-full rounded-xl bg-white px-4 py-3 text-[15px] border border-gray-200 focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                        <div className="flex justify-center mt-[22px]">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-[10em] bg-white px-14 py-3 text-[15px] font-semibold cursor-pointer text-black transition-all duration-300 border-2 border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Додавання...' : 'Додати'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
