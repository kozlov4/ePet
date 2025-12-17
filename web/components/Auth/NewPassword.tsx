'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../../services/authService';
import { devError } from '../../utils/config';

export function NewPasswordPage(props: { token: string }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSetNewPassword = async (): Promise<void> => {
        setIsLoading(true);
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('Паролі не співпадають.');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setMessage('Пароль має бути щонайменше 8 символів.');
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(props.token, newPassword);
            router.push('/signIn');
            setMessage('Новий пароль встановлено!');
        } catch (error) {
            devError('Error during setting new password:', error);

            if (
                error instanceof Error &&
                error.message === 'Недійсний або прострочений токен.'
            ) {
                setMessage('Недійсний або прострочений токен');
            } else {
                setMessage('Сталася помилка. Спробуйте пізніше.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-[50%] h-full flex bg-white">
            <div className="w-full h-[50%] mt-[25%] mx-[8%]">
                <motion.h1
                    className="font-medium ml-[3%] text-5xl mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Новий пароль
                </motion.h1>

                <motion.div
                    className="w-full h-[70%] flex flex-col justify-center items-center p-4 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        placeholder="Новий пароль"
                        className="w-full h-[30%] px-4 py-2 font-normal text-[20px] text-black border border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="Підтвердіть новий пароль"
                        className="w-full h-[30%] px-4 py-2 mt-4 font-normal text-[20px] text-black border border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Added mt-4 for spacing
                    />
                </motion.div>

                {message && (
                    <span
                        className={`flex w-full justify-center text-center text-[14px] mt-2 ${
                            message === 'Новий пароль встановлено!'
                                ? 'text-green-400'
                                : 'text-red-500'
                        }`}
                    >
                        {message}
                    </span>
                )}
                <motion.button
                    onClick={() => handleSetNewPassword()}
                    disabled={isLoading}
                    className="w-full h-[15%] mt-[1%] flex justify-center items-center font-medium text-xl rounded-3xl bg-black text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    {isLoading ? 'Збереження...' : 'Змінити пароль'}
                </motion.button>
            </div>
        </div>
    );
}
