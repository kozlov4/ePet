'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import ArrowLeft from '../../assets/images/icons/ArrowLeft';
import { Organization } from '../../types/api';
import { AuthContext } from '../../hooks/AuthProvider';
import { organizationService } from '../../services/organizationService';

export function Menu() {
    const [items, setItems] = useState<Organization | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const executeFetch = useCallback(async () => {
        setError(null);
        try {
            const data = await organizationService.getOrganizationInfo();

            if (data) {
                setItems(data);
            } else {
                throw new Error('Невірний формат відповіді API');
            }
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Помилка завантаження даних.';
            setError(message);

            if (message.includes('Авторизація') || message.includes('Authentication')) {
                router.push('/signIn');
            }
        } finally {
            setIsLoadingInitial(false);
        }
    }, [router]);

    useEffect(() => {
        executeFetch();
    }, [executeFetch]);

    if (isLoadingInitial) {
        return <div className="text-center py-4">Завантаження...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    const auth = useContext(AuthContext);

    const handleLogout = () => {
        auth?.logout();
        router.push('/signIn');
    };

    return (
        <motion.div
            className="w-full flex-col justify-center px-[8%] pt-8 pb-12 pl-[10%]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <motion.div
                className="w-full flex justify-start items-center gap-[4%]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <button
                    className="cursor-pointer"
                    onClick={() => router.back()}
                >
                    <ArrowLeft />
                </button>
                <span className="font-normal text-[24px] text-black">Меню</span>
            </motion.div>

            <motion.div
                className="max-w-[920px]  pl-[7%]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
            >
                <div className="w-full flex mt-[5%] gap-5 items-end">
                    <motion.span
                        className="font-semibold text-[48px] leading-[1.1] md:text-[56px] text-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                    >
                        {items?.organization_name || ''}
                    </motion.span>
                </div>

                <motion.div
                    className="max-w-[920px] mt-10 flex flex-col"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.15,
                            },
                        },
                    }}
                >
                    {[
                        {
                            label: 'Тип організації',
                            sub: 'Type of organization',
                            value: items?.organization_type || '',
                        },
                        {
                            label: 'Адреса:',
                            sub: 'Address',
                            value: `${items?.city} ${items?.street} ${items?.building}`,
                        },
                        {
                            label: 'Номер телефону:',
                            sub: 'Phone number',
                            value: items?.phone_number || '',
                        },
                        {
                            label: 'Електронна адреса',
                            sub: 'E-mail address',
                            value: items?.email || '',
                        },
                        {
                            label: 'Пароль',
                            sub: 'Password',
                            value: '************',
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="grid grid-cols-[220px_1fr] gap-8 mb-6 items-start"
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <div className="w-[220px]">
                                <span className="block font-medium text-[16px] text-black">
                                    {item.label}
                                </span>
                                <span className="block font-normal text-[12px] text-[#b3b3b3]">
                                    {item.sub}
                                </span>
                            </div>

                            <div className="flex flex-col items-start">
                                <span className="block font-normal text-[15px] text-black break-words">
                                    {item.value}
                                </span>

                                {item.label === 'Пароль' && (
                                    <button
                                        className="mt-2 w-[25%]  border-gray-400 border-[0.5px]  py-0.5 rounded-[8px] font-semibold text-sm text-gray-600 bg-transparent cursor-pointer transition-all duration-200 ease-out hover:border-gray-600 hover:text-gray-800 active:scale-[0.95]"
                                        onClick={() =>
                                            router.push('/reset-password')
                                        }
                                    >
                                        Забув(ла) пароль
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        className="
                        w-full max-w-[420px] h-12 mt-12 flex justify-center items-center
                        rounded-[999px] cursor-pointer font-medium text-[16px] text-white
                        bg-black
                        border-2 border-transparent
                        transition-all duration-300 ease-out
                        hover:bg-white hover:text-black hover:border-black
                        hover:shadow-[0_0_15px_rgba(0,0,0,0.25)]
                    "
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogout}
                    >
                        Вийти
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
