'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ArrowFront from '../../assets/images/icons/ArrowFront';
import { BoneIcon } from '../../assets/images/icons/BoneIcon';

const Home = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserName = localStorage.getItem('user_name') || '';
            setUserName(storedUserName);
        }
    }, []);

    return (
        <div className="px-12 flex flex-col h-[70%] max-w-full mx-auto">
            <motion.div
                className="pt-12 pl-16 pr-9 pb-9 rounded-2xl flex justify-between w-full bg-cover"
                style={{ backgroundImage: "url('./HomeBackground.png')" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className="flex flex-col justify-between"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <motion.h1
                        className="text-white text-6xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        єПрихисток
                    </motion.h1>
                    <motion.p
                        className="text-white text-base"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        Дайте шанс на дім — оберіть улюбленця через
                        «ЄПрихисток».
                    </motion.p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                >
                    <BoneIcon />
                </motion.div>
            </motion.div>

            <section className="relative mt-40 mx-6">
                <motion.div
                    className="flex flex-col gap-12 max-w-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <motion.h1
                        className="text-[#1E1E1E] text-6xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        Завантажте
                        <br />
                        наш додаток
                    </motion.h1>
                    <motion.p
                        className="text-[#3A3A3A] text-xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.3 }}
                    >
                        Піклуйтесь про свого пухнастого друга зручніше, ніж будь-коли.Зберігайте документи, переглядайте історію щеплень, отримуйте нагадування про візити до ветеринара та відкривайте нові можливості догляду — все в одному місці <br /><br /> Завантажте «єУлюбленець» і зробіть життя свого улюбленця ще кращим
                        
                    </motion.p>
                    <motion.img
                        src="./google-play.png"
                        alt=""
                        className="w-[186px] h-[61px]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                    />
                </motion.div>
                <motion.img
                    src="./download-app.png"
                    alt=""
                    className="absolute right-0 -top-40 w-220 h-200"
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 1.7 }}
                />
            </section>

            <section className="my-48" id="faq">
                <motion.h1
                    className="text-4xl text-black mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.9 }}
                >
                    Питання та відповіді
                </motion.h1>
                <motion.div
                    className="px-6 py-14 bg-[rgba(217,217,217,_0.27)] rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2 }}
                >
                    {[
                        'Як додати нового улюбленця до застосунку?',
                        'Додати нового улюбленця може лише співробітник ЦНАП. Ви отримаєте паспорт тварини у застосунку після внесення даних працівником.',
                        'Чи можна редагувати дані про улюбленця?',
                        'Де зберігаються документи мого улюбленця?',
                        'Як отримати витяг про щеплення або інші довідки?',
                        'Що робити, якщо я загубив(ла) доступ до акаунта?',
                    ].map((q, i) => (
                        <motion.div
                            className="flex justify-between w-full py-4"
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 2 + i * 0.2 }}
                        >
                            <p className="text-[13px] text-black">{q}</p>
                            <a href="#" className="w-5 h-5">
                                <ArrowFront />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
