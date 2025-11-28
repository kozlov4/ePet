'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || '';

export function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const isValidEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleResetPassword = async (emailAddress) => {
        setIsLoading(true);
        setMessage('');

        if (!isValidEmail(emailAddress)) {
            setMessage(
                'Неправильний тип даних: введіть коректну електронну адресу'
            );
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE}/forgot-password/`,
                {
                    // MOVE DOMAIN TO ENV VARIABLE
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: emailAddress }),
                }
            );

            if (response.ok) {
                setMessage(
                    'Якщо електронна адреса існує, посилання для скидання паролю було надіслано на пошту'
                );
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            setMessage('Помилка. Не вдалося надіслати. Спробуйте ще раз.');
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
                    Відновлення паролю
                </motion.h1>

                <motion.div
                    className="w-full h-[70%] flex flex-col justify-center items-center p-4 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Електронна адреса"
                        className="w-full h-[30%] px-4 py-2 font-normal text-[20px] text-black border border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </motion.div>

                {message && (
                    <span
                        className={`flex w-full justify-center text-center text-[14px] mt-2 ${
                            message ===
                            'Якщо електронна адреса існує, посилання для скидання паролю було надіслано на пошту'
                                ? 'text-green-400'
                                : 'text-red-500'
                        }`}
                    >
                        {message}
                    </span>
                )}
                <motion.button
                    onClick={() => handleResetPassword(email)}
                    disabled={isLoading}
                    className="w-full h-[15%] mt-[1%] flex justify-center items-center font-medium text-xl rounded-3xl bg-black text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    Скинути пароль
                </motion.button>
            </div>
        </div>
    );
}
