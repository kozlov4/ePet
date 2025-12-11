import { useEffect, useState } from 'react';
import PetRegistration from '../../../components/CNAP/PetRegistration';
import { PetPassportData } from '../../../types/api';
import router from 'next/router';

const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || '';

export default function PetEgitionPage() {
    const [petData, setPetData] = useState<PetPassportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = router.query;
    useEffect(() => {
        if (!id) return;

        const fetchPetData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('Токен авторизації відсутній');
                }

                const response = await fetch(`${API_BASE}/pets/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Помилка завантаження даних');
                }

                const data = await response.json();
                setPetData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Невідома помилка',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [id]);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Завантаження...</div>
            </div>
        );
    }

    if (error || !petData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">
                    {error || 'Дані не знайдено'}
                </div>
            </div>
        );
    }
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <PetRegistration pet={petData} Alley={true} />
            </main>
        </div>
    );
}
