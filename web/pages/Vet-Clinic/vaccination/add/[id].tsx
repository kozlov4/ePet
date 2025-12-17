import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ArrowBack from '../../../../assets/images/icons/ArrowBack';
import CopyIcon from '../../../../assets/images/icons/CopyIcon';
import {
    vaccinationService,
    VaccinationData,
} from '../../../../services/vaccinationService';
import { copyToClipboard } from '../../../../utils/clipboard';
import { fromIsoDateInputToDot } from '../../../../utils/date';

export default function AddVaccination() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
                const data = await vaccinationService.getVaccinations(
                    id as string,
                );
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
            copyToClipboard(
                vaccinationData.passport_number,
                'Номер паспорта скопійовано!',
            );
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        for (const issue of issues) {
            const loc = (issue as any)?.loc;
            const msg = (issue as any)?.msg;
            if (typeof msg !== 'string') continue;
            const cleanMsg = msg.replace(/^Value error,\s*/i, '');

            if (Array.isArray(loc) && loc.length) {
                const field = loc[loc.length - 1];
                if (typeof field === 'string' && !nextFieldErrors[field]) {
                    nextFieldErrors[field] = cleanMsg;
                }
            }
        }

        return {
            fieldErrors: nextFieldErrors,
            message:
                Object.keys(nextFieldErrors).length > 0
                    ? 'Перевірте поля.'
                    : 'Виникла помилка валідації. Перевірте введені дані.',
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setFieldErrors({});

        try {
            const petId = typeof id === 'string' ? id : String(id?.[0] || '');

            await vaccinationService.addVaccination(petId, {
                drug_name: formData.drug_name,
                series_number: formData.series_number,
                vaccination_date: fromIsoDateInputToDot(
                    formData.vaccination_date,
                ),
                valid_until: fromIsoDateInputToDot(formData.valid_until),
            });

            router.push(`/Vet-Clinic/vaccination/${petId}`);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Помилка додавання вакцинації';
            setError(errorMessage);
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
        <div className="">
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

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="bg-[#F5F5F5] rounded-2xl px-8 py-5">
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
                            {fieldErrors.vaccination_date && (
                                <div className="text-xs text-red-600">
                                    {fieldErrors.vaccination_date}
                                </div>
                            )}
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
                            {fieldErrors.valid_until && (
                                <div className="text-xs text-red-600">
                                    {fieldErrors.valid_until}
                                </div>
                            )}
                        </div>
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
    );
}

AddVaccination.showFooter = false;
