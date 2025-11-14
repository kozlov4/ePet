'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { ColumnDefinition, PaginatedResponse } from '../../types/api';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export function ReusableTable({
    columns,
    title,
    addNewLink,
    addNewText,
    searchPlaceholder,
    fetchFunction,
    onAction,
}) {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentQuery, setCurrentQuery] = useState('');
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 10;

    const debouncedQuery = useDebounce(currentQuery, 2000);

    const executeFetch = useCallback(
        async (page, query, isNewSearch = false) => {
            setError(null);
            if (isNewSearch) setIsLoadingInitial(true);

            try {
                const data = await fetchFunction(page, pageSize, query);
                let newItems = Array.isArray(data) ? data : data.items;

                setItems((prev) =>
                    isNewSearch ? newItems : [...prev, ...newItems],
                );
                setCurrentPage(data.page);
                setTotalPages(data.total_pages);
                setTotalItems(data.total_items);
            } catch (e) {
                const errorMsg =
                    e instanceof Error
                        ? e.message
                        : 'Помилка завантаження даних.';
                setError(errorMsg);
                if (e instanceof Error && e.message.includes('Авторизація')) {
                    router.push('/signIn');
                }
            } finally {
                setIsLoadingInitial(false);
            }
        },
        [fetchFunction, pageSize, router],
    );

    useEffect(() => {
        executeFetch(1, debouncedQuery, true);
    }, [debouncedQuery, executeFetch]);

    const loadMore = useCallback(async () => {
        if (currentPage >= totalPages) return;
        await executeFetch(currentPage + 1, debouncedQuery, false);
    }, [currentPage, totalPages, debouncedQuery, executeFetch]);

    const hasMore = currentPage < totalPages;

    const observerRef = useRef(null);
    const { loading: isLoadingMore } = useInfiniteScroll(
        observerRef,
        loadMore,
        hasMore,
    );

    const handleSearch = (query) => setCurrentQuery(query);

    if (isLoadingInitial && items.length === 0) {
        return (
            <div className="p-8 text-center text-xl">Завантаження даних...</div>
        );
    }

    const gridColsClass = `md:grid-cols-${columns.length}`;

    return (
        <motion.div
            className="max-w-[1920px] w-full px-4 md:px-10 py-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <motion.h1
                className="mb-5 font-medium text-[40px]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {title}
            </motion.h1>

            {error && (
                <motion.div
                    className="mt-4 p-4 bg-red-800 border border-red-600 text-red-100 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.div>
            )}

            <motion.div
                className="mb-8 flex flex-col w-full md:flex-row gap-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex-1 flex w-full rounded-xl border border-gray-300 bg-white p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 mr-50 text-[13px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mx-2 text-gray-500"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={currentQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 text-[13px]"
                    />
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Link
                        href={addNewLink}
                        className="text-[15px] w-full md:w-auto flex-shrink-0 rounded-[10em] border-2 border-black bg-white px-10 py-3 font-semibold text-black text-center cursor-pointer transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg"
                    >
                        {addNewText}
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.accessor)}
                                    className="px-6 py-4 text-left text-sm font-medium text-[20px]"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="ReusableTable divide-y overflow-hidden divide-gray-300">
                        {items.map((item, i) => {
                            const key =
                                item.pet_id ?? item.organization_id ?? i;
                            return (
                                <motion.tr
                                    key={key}
                                    className="hover:bg-[rgba(255,255,255,0.05)]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.accessor)}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[24px]"
                                        >
                                            {col.cell
                                                ? col.cell(item, onAction)
                                                : String(item[col.accessor])}
                                        </td>
                                    ))}
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>

            {isLoadingMore && (
                <p className="text-center mt-6 text-lg text-blue-400">
                    Завантаження...
                </p>
            )}

            <div ref={observerRef} className="h-1" />

            {!isLoadingMore && !hasMore && items?.length > 0 && (
                <p className="text-center mt-6 text-gray-400">
                    Кінець списку ({totalItems} записів).
                </p>
            )}
        </motion.div>
    );
}
