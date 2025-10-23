"use client";
import { useState } from 'react';
import { motion } from "framer-motion";

export function MainReset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (emailAddress) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://upcity.live/forgot-password/', { // MOVE DOMAIN TO ENV VARIABLE
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setMessage('Посилання для скидання пароля надіслано!');

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
            className="w-full h-[30%] px-4 py-2 font-normal text-[20px] text-[#b3b3b3] border border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </motion.div>

        <motion.span
          className="flex justify-center font-normal text-[15px] text-[#424242] mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Новий пароль буде надіслано на вказану електронну адресу
        </motion.span>
        {message && (
          <span className="flex justify-center text-[14px] text-red-500 mt-2">
            {message}
          </span>
        )}
        <motion.button
          onClick={() => handleResetPassword(email)}
          disabled={isLoading}
          className="w-full h-[15%] mt-[1%] flex font-medium text-xl justify-center items-center rounded-4xl bg-black text-white"
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
