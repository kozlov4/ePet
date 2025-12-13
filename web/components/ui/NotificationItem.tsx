import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../../types/api';

// Міні-компонент для іконки-стрілки (якщо вона відсутня, потрібно створити/адаптувати)
// Якщо ArrowDown це SVG, то потрібно додати функціонал для зміни напрямку
const Chevron = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const containerClasses =
        'mb-4 p-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl bg-[rgba(171,171,171,0.27)]';

    return (
        <div className={containerClasses} onClick={toggleOpen}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Запит на всиновлення тварини
                    </h3>
                    {`Користувач ${notification.user_full_name} надіслав(ла) запит на всиновлення тварини.`}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-400 cursor-pointer">
                    {isOpen ? 'Згорнути' : 'Розгорнути'}
                    <Chevron isOpen={isOpen} />
                </div>
            </div>
            <div className="mt-2">
                {isOpen && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pt-3 "
                        >
                            <div className="overflow-hidden">
                                <p className="space-y-2 text-sm text-gray-600">{`Ідентифікатор: ${notification.pet_id}`}</p>
                                <br />
                                <p className="space-y-2 text-sm text-gray-600">{`Контактні дані користувача:`}</p>
                                <p className="space-y-2 text-sm text-gray-600">{`- Електронна пошта: ${notification.user_email}`}</p>
                                <br />
                                <p className="space-y-2 text-sm text-gray-600">{`Будь ласка, зв’яжіться з користувачем для підтвердження заявки та подальшого оформлення всиновлення. `}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
