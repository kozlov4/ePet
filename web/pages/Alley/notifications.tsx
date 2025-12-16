'use client';

import ArrowLeft from '../../assets/images/icons/ArrowLeft';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NotificationItem from '../../components/ui/NotificationItem';
import { Notification } from '../../types/api';
import { API_BASE } from '../../utils/config';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[] | null>(
        null,
    );
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            throw new Error(
                'Токен авторизації відсутній. Будь ласка, увійдіть.',
            );
        }
        setError(null);
        try {
            const res = await fetch(
                `${API_BASE}/organizations/organization/list`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                },
            );

            if (!res.ok) {
                throw new Error('Не вдалося завантажити повідомлення.');
            }

            const data = await res.json();
            setNotifications(data);
        } catch (e) {
            const message =
                e instanceof Error
                    ? e.message
                    : 'Помилка завантаження повідомлень.';
            setError(message);
        } finally {
            setIsLoadingInitial(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    if (isLoadingInitial) {
        return (
            <div className="py-8 text-xl text-gray-600">Завантаження...</div>
        );
    }

    if (error) {
        return <div className="text-red-500 py-8 text-xl">{error}</div>;
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className="py-8 text-xl text-gray-600">Повідомлень немає.</div>
        );
    }

    return (
        <motion.div
            className="min-h-screen pt-10 px-4 md:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="max-w-3xl mx-12">
                <h1 className="text-4xl font-light text-black mb-8">
                    Повідомлення
                </h1>

                <motion.div
                    className="w-full"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {notifications.map((notification, index) => (
                        <motion.div
                            key={notification.request_id}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                        >
                            <NotificationItem notification={notification} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
