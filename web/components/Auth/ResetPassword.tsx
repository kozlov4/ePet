'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { authService } from '../../services/authService';
import { devError, devLog } from '../../utils/config';

export function ResetPasswordPage() {
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(
        'Новий пароль буде надіслано на вказану електронну адресу',
    );

    const validateEmail = (value: string): string => {
        if (!value) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Невірний формат електронної пошти';
        return '';
    };

    const handleResetPassword = async (emailAddress: string): Promise<void> => {
        setIsLoading(true);
        setMessage('');

        const error = validateEmail(emailAddress);
        setEmailError(error);

        if (error) {
            setIsLoading(false);
            return;
        }

        try {
            await authService.forgotPassword(emailAddress);
            setMessage('Посилання для скидання паролю було надіслано на пошту');
        } catch (error) {
            devError('Error during password reset:', error);
            setMessage('Сталася помилка. Спробуйте пізніше.');
        } finally {
            setIsLoading(false);
        }
    };
    devLog(email);
    const isFormValid = !validateEmail(email) && email;

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
                        type="email"
                        placeholder="Електронна адреса"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(validateEmail(e.target.value));
                        }}
                        className={`w-full h-[30%] px-4 py-2 font-normal text-[20px] border rounded-xl 
                            focus:outline-none focus:ring-2
                            ${
                                emailError
                                    ? 'border-red-500 ring-red-500 text-red-500'
                                    : 'border-[#e6e6e6] ring-blue-500 text-black'
                            }`}
                    />

                    {emailError && (
                        <p className="text-red-500 text-sm mt-1 text-center w-full">
                            {emailError}
                        </p>
                    )}
                </motion.div>

                {message && (
                    <span
                        className={`flex w-full justify-center text-center text-[14px] mt-2 ${
                            message ===
                            'Новий пароль буде надіслано на вказану електронну адресу'
                                ? 'text-gray-700'
                                : message ===
                                  'Сталася помилка. Спробуйте пізніше.'
                                ? 'text-red-500'
                                : 'text-green-500'
                        }`}
                    >
                        {message}
                    </span>
                )}
                <motion.button
                    onClick={() => handleResetPassword(email)}
                    disabled={!isFormValid || isLoading}
                    className={`w-full h-[15%] mt-[1%] flex justify-center items-center font-medium text-xl rounded-3xl transition-all duration-300 ease-in-out 
                        ${
                            isFormValid
                                ? 'bg-black text-white hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98]'
                                : 'bg-gray-700 text-gray-200 cursor-not-allowed'
                        }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    Надіслати
                </motion.button>
            </div>
        </div>
    );
}
