import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import CatIcon from '../../../assets/images/icons/CatIcon';
import UkraineArmsIcon from '../../../assets/images/icons/UkraineArmsIcon';
import { HeaderProps } from './HeaderTypes';

export const Header: React.FC<HeaderProps> = ({
    navProps,
    accountName,
    buttonProps,
}) => {
    const router = useRouter();
    const pathname = router.pathname;
    const isAuthPage = pathname === '/signIn' || pathname === '/reset-password';

    return (
        <div
            className={`w-full h-20 bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)] rounded-b-[15px]  ${
                isAuthPage ? 'absolute' : 'relative'
            }`}
        >
            <motion.div
                className="flex mx-[5%] h-full justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className="flex gap-14 w-[40%] h-full items-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <motion.div
                        className="flex h-full gap-4 items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <motion.div
                            className="flex w-12 h-12 justify-center items-center bg-black rounded-lg"
                            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.6,
                                type: 'spring',
                                stiffness: 150,
                            }}
                        >
                            <CatIcon />
                        </motion.div>
                        <motion.div
                            className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg"
                            initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.8,
                                type: 'spring',
                                stiffness: 150,
                            }}
                        >
                            <UkraineArmsIcon />
                        </motion.div>
                    </motion.div>

                    {navProps.map((e) => (
                        <Link href={e.href} key={e.label} passHref>
                            <motion.div
                                className="relative text-black text-md font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                {e.label}
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                <Link
                    href={buttonProps.href}
                    className="flex gap-4 items-center"
                >
                    {accountName && (
                        <span className="text-black">{accountName}</span>
                    )}
                    <motion.button
                        className="flex px-5 py-3 bg-black rounded-3xl cursor-pointer justify-center items-center text-white font-medium text-[15px] transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {buttonProps.label}
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export const HeaderMain: React.FC = () => {
    const defaultProps: HeaderProps = {
        navProps: [
            { label: 'Головна', href: '/home' },
            { label: 'Питання та відповіді', href: '/home#faq' },
        ],
        accountName: '',
        buttonProps: {
            label: 'Увійти',
            href: '/signIn',
        },
    };

    return <Header {...defaultProps} />;
};
