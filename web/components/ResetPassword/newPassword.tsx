"use client";
import { useState } from 'react';
import { motion } from "framer-motion";
import router from 'next/router';

export function NewPassword(props: { token: string }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSetNewPassword = async (emailAddress) => {
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
            const response = await fetch('https://upcity.live/reset-password/', { // TODO: MOVE DOMAIN TO ENV VARIABLE
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: props.token,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setMessage('Новий пароль встановлено!');

        } catch (error) {
            console.error('Error during setting new password:', error);
            setMessage('Помилка. Не вдалося створити новий пароль. Спробуйте ще раз.');
        } finally {
            setIsLoading(false);
            router.push('/signIn');
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
                        className="w-full h-[30%] px-4 py-2 font-normal text-[20px] text-[#b3b3b3] border border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="Підтвердіть новий пароль"
                        className="w-full h-[30%] px-4 py-2 mt-4 font-normal text-[20px] text-[#b3b3b3] border border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Added mt-4 for spacing
                    />
                </motion.div>

                <motion.span
                    className="flex justify-center font-normal text-[15px] text-[#424242] mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    Пароль має містити щонайменше 8 символів.
                </motion.span>
                {message && (
                    <span className="flex justify-center text-[14px] text-red-500 mt-2">
                        {message}
                    </span>
                )}
                <motion.button
                    onClick={() => handleSetNewPassword(newPassword)}
                    disabled={isLoading}
                    className="w-full h-[15%] mt-[1%] flex font-medium text-xl justify-center items-center rounded-4xl bg-black text-white"
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
