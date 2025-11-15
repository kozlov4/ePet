'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/home');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <h1 className="text-6xl font-bold text-black mb-4">404</h1>
            <p className="text-2xl font-medium text-gray-700 mb-6">
                Ой! Цю сторінку не знайдено.
            </p>
            <p className="text-lg text-gray-500">
                Перенаправляємо вас на головну сторінку...
            </p>
            <div className="mt-8 w-12 h-12 border-4 border-t-black border-gray-200 rounded-full animate-spin"></div>
        </div>
    );
}