import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ArrowLeft from '../../assets/images/icons/ArrowLeft';
import { Organization } from '../../types/api';
import { fetchOrganizationInfo } from '../../utils/fetchOrganization';

export function Menu() {
    const [items, setItems] = useState<Organization | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const executeFetch = useCallback(async () => {
        setError(null);
        try {
            const data = await fetchOrganizationInfo();

            if (data) {
                setItems(data);
            } else {
                throw new Error('Невірний формат відповіді API');
            }
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Помилка завантаження даних.';
            setError(message);

            if (message.includes('Авторизація')) {
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

    function logout() {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/signIn');
    }

    ('use client');

    return (
        <motion.div
            className="w-[100%] h-[80%] px-[18%] pt-[3%]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <motion.div
                className="w-full flex items-center gap-[4%]"
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
                <span className="font-normal text-[24px] text-black">
                    Повна інформація
                </span>
            </motion.div>

            <motion.div
                className="w-[60%] pl-[9%]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
            >
                <div className="w-full flex mt-[5%] gap-5 items-end">
                    <motion.span
                        className="font-normal text-[40px] text-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                    >
                        {items?.organization_name || ''}
                    </motion.span>
                </div>

                <motion.div
                    className="w-[90%] h-10 flex-col mt-[8%]"
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
                            sub: 'type of organization',
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
                            className="flex justify-between mb-[3%]"
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <div className="min-w-[100px]">
                                <span className="block font-normal text-[15px] text-black">
                                    {item.label}
                                </span>
                                <span className="block font-normal text-[12px] text-[#b3b3b3]">
                                    {item.sub}
                                </span>
                            </div>

                            <span className="block font-normal text-[15px] text-black text-right break-words max-w-[50%]">
                                {item.value}
                            </span>
                        </motion.div>
                    ))}

                    <motion.div
                        className="flex w-full justify-end"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <button
                            className="
                            flex items-center justify-center
                            border-black border-[1px]
                            px-5 py-2 rounded-[30px]
                            font-medium text-[12px] text-black
                            bg-white cursor-pointer
                            transition-all duration-300 ease-out
                            hover:bg-black hover:text-white hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]
                            active:scale-[0.97]
                        "
                            onClick={() => router.push('/reset-password')}
                        >
                            Забув пароль
                        </button>
                    </motion.div>

                    <motion.div
                        className="
                        w-full h-10 mt-[5%] flex justify-center items-center
                        rounded-3xl cursor-pointer font-medium text-white
                        bg-black from-black
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
                        onClick={logout}
                    >
                        Вийти
                    </motion.div>
                </motion.div>
            </motion.div>

            <div className="w-10 h-50 mt-50"></div>
        </motion.div>
    );
}
