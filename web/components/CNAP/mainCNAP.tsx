"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAnimals } from "../../utils/fetchAnimals";
import router from "next/router";
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { Pet } from "../../types/api";


export function MainCNAP() {
    const [items, setItems] = useState<Pet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentQuery, setCurrentQuery] = useState('');
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 10;

    const executeFetch = useCallback(async (page: number, query: string, isNewSearch: boolean = false) => {
        setError(null);
        try {
            const data = await fetchAnimals(page, pageSize, query);

            setItems(prevItems => isNewSearch ? data.items : [...prevItems, ...data.items]);
            setCurrentPage(data.page);
            setTotalPages(data.total_pages);

        } catch (e) {
            setError(e instanceof Error ? e.message : 'Помилка завантаження даних.');

            if (e instanceof Error && e.message.includes('Авторизація')) {
                router.push('/signIn');
            }
        } finally {
            setIsLoadingInitial(false);
        }
    }, [pageSize]);

    useEffect(() => {
        executeFetch(1, currentQuery, true);
    }, []);

    const loadMore = useCallback(async () => {
        if (currentPage >= totalPages) return;
        await executeFetch(currentPage + 1, currentQuery);
    }, [currentPage, totalPages, currentQuery, executeFetch]);

    const observerRef = useRef<HTMLDivElement>(null);
    const { loading: isLoadingMore } = useInfiniteScroll(observerRef, loadMore, currentPage < totalPages);

    if (isLoadingInitial) {
        return <div className="p-8 text-center text-xl">Завантаження даних...</div>;
    }

    const handleFullInfoClick = (petId: string) => {
        alert(`Showing full information for pet: ${petId}`);
    };

    return (
        <div className="w-full px-35 py-10">
            <h1 className="mb-5 font-medium text-4xl">
                Паспорт домашнього улюбленця</h1>
            {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
            <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex w-full items-center rounded-lg bg-white p-2 shadow-md/10 sm:max-w-b">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mx-2 text-gray-400"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Пошук"
                        value={currentQuery}
                        // onChange={} 
                        className="w-full border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                </div>
                <Link href="/CNAP/pet-registration"
                    className="w-full shrink-0 rounded-[10em] bg-white px-5 py-3 text-sm font-semibold ring transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer">
                    Зареєструвати улюбленця
                </Link>
            </div>

            <div className="hidden grid-cols-6 pb-2 text-sm font-bold text-gray-500 md:grid text-center px-[16px]">
                <div className="col-span-1">ID:</div>
                <div className="col-span-1">Порода:</div>
                <div className="col-span-1">Стать:</div>
                <div className="col-span-1">Вид:</div>
                <div className="col-span-1">Власник:</div>
                <div className="col-span-1"></div>
            </div>

            <div className="flex flex-col bg-[rgba(217,217,217,0.27)] rounded-[2em] divide-y divide-gray-300">
                {items.map((pet, index) => (
                    <div
                        key={index}
                        className="grid items-center p-4 md:grid-cols-6 text-center">
                        <div className="col-span-1 hidden font-medium md:block">{pet.animal_passport_number}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.breed}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.gender}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.species}</div>
                        <div className="col-span-1 hidden font-medium md:block">{pet.owner?.passport_number || ''}</div>

                        <div className="col-span-2 text-right md:col-span-1">
                            <button
                                onClick={() => handleFullInfoClick(pet.animal_passport_number || '')}
                                className="rounded-[10em] bg-black px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer">
                                <span>Повна інформація</span>
                            </button>
                        </div>
                    </div>
                ))}

                {isLoadingMore && (
                    <p className="text-center mt-6 text-lg text-blue-600">Завантаження...</p>
                )}

                <div ref={observerRef} className="h-1" />
            </div>
            {!isLoadingMore && currentPage >= totalPages && items.length > 0 && (
                <p className="text-center mt-6 text-gray-500">Кінець списку ({items.length} записів).</p>
            )}
        </div>
    );
}