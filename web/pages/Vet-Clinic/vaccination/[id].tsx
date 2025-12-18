import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ArrowBack from '../../../assets/images/icons/ArrowBack';
import CopyIcon from '../../../assets/images/icons/CopyIcon';
import { AnimatePresence, motion } from 'framer-motion';
import {
    vaccinationService,
    VaccinationData,
} from '../../../services/vaccinationService';
import { copyToClipboard } from '../../../utils/clipboard';
import { devLog } from '../../../utils/config';
import { formatUaDate } from '../../../utils/date';

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
                const data = await vaccinationService.getVaccinations(
                    id as string,
                );
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
            copyToClipboard(
                vaccinationData.passport_number,
                'Номер паспорта скопійовано!',
            );
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
        router.push(`/Vet-Clinic/vaccination/add/${id}`);
    };

    return (
        <motion.div
            className="min-h-screen"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <div className="max-w-[830px] w-full mx-auto my-12 flex flex-col gap-8">
                <motion.div
                    className="flex gap-10 items-center translate-x-[-80px]"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <motion.button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 cursor-pointer hover:bg-gray-300 transition-[0.2s]"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowBack />
                    </motion.button>

                    <p className="text-2xl whitespace-nowrap">
                        Щеплення улюбленця
                    </p>
                </motion.div>

                <motion.div
                    className="flex gap justify-between"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="flex gap-2 items-center">
                        <p className="text-4xl">
                            {vaccinationData.passport_number}
                        </p>
                        <motion.button
                            onClick={handleCopyPassport}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <CopyIcon />
                        </motion.button>
                    </div>

                    <motion.button
                        onClick={() =>
                            addVaccinationHandler(
                                typeof id === 'string'
                                    ? id
                                    : String(id?.[0] || ''),
                            )
                        }
                        className="rounded-[10em] bg-white px-14 py-2 text-[15px] font-semibold text-black border border-black cursor-pointer transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-95"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Нове щеплення
                    </motion.button>
                </motion.div>

                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
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
                                <th className="px-6 py-4 text-left border-b border-gray-300">
                                    <p className="text-[13px]">Дата:</p>
                                    <p className="text-[10px] text-[#B3B3B3]">
                                        Date
                                    </p>
                                </th>
                                <th className="px-6 py-4 text-left border-b border-gray-300">
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
                                    <motion.tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.25 + index * 0.05,
                                        }}
                                    >
                                        <td className="px-6 py-4 text-[20px]">
                                            {vaccination.drug_name}
                                            <br />
                                            {vaccination.series_number}
                                        </td>
                                        <td className="px-6 py-4 text-[20px]">
                                            <div>
                                                {formatUaDate(
                                                    vaccination.vaccination_date,
                                                )}
                                                {vaccination.valid_until && (
                                                    <span className="text-[#B3B3B3] text-[15px] block">
                                                        до{' '}
                                                        {formatUaDate(
                                                            vaccination.valid_until,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[20px]">
                                            {vaccination.organization_name}
                                        </td>
                                    </motion.tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </motion.div>
    );
}

VaccinationInfo.showFooter = false;
