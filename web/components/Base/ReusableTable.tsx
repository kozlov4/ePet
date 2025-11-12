'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

interface ReusableTableProps {
    columns: ColumnDefinition<any>[];
    title: string;
    addNewLink: string;
    addNewText: string;
    searchPlaceholder: string;
    fetchFunction: (
        page: number,
        size: number,
        query: string,
    ) => Promise<PaginatedResponse<any>>;
    onAction: (item: any, actionType: string) => void;
}

export function ReusableTable({
    columns,
    title,
    addNewLink,
    addNewText,
    searchPlaceholder,
    fetchFunction,
    onAction,
}: ReusableTableProps) {
    const router = useRouter();

    const [items, setItems] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentQuery, setCurrentQuery] = useState('');
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 10;

    const debouncedQuery = useDebounce(currentQuery, 500);

    const executeFetch = useCallback(
        async (page: number, query: string, isNewSearch: boolean = false) => {
            setError(null);
            if (isNewSearch) setIsLoadingInitial(true);

            try {
                const data = await fetchFunction(page, pageSize, query);

                let newItems = Array.isArray(data) ? data : data.items;

                setItems((prevItems) =>
                    isNewSearch ? newItems : [...prevItems, ...newItems],
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
        [fetchFunction, pageSize, router, title],
    );

    useEffect(() => {
        executeFetch(1, debouncedQuery, true);
    }, [debouncedQuery, executeFetch]);

    const loadMore = useCallback(async () => {
        if (currentPage >= totalPages) return;
        await executeFetch(currentPage + 1, debouncedQuery, false);
    }, [currentPage, totalPages, debouncedQuery, executeFetch]);

    const hasMore = currentPage < totalPages;

    const observerRef = useRef<HTMLDivElement>(null);
    const { loading: isLoadingMore } = useInfiniteScroll(
        observerRef,
        loadMore,
        hasMore,
    );

    const handleSearch = (query: string) => {
        setCurrentQuery(query);
    };

    if (isLoadingInitial && items.length === 0) {
        return (
            <div className="p-8 text-center text-xl">Завантаження даних...</div>
        );
    }

    const gridCols = columns.length;
    const gridColsClass = `md:grid-cols-${gridCols}`;

    return (
        <div className="w-full px-4 md:px-10 py-10">
            <h1 className="mb-5 font-medium text-[40px]">{title}</h1>

            {error && (
                <div className="mt-4 p-4 bg-red-800 border border-red-600 text-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mb-8 flex flex-col w-full md:flex-row gap-1">
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
                        id="0"
                        type="text"
                        placeholder={searchPlaceholder}
                        value={currentQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 text-[13px]"
                    />
                </div>

                <Link
                    href={addNewLink}
                    className="text-[15px] w-full flex-shrink-0 md:w-auto shrink-0 rounded-[10em] border border-gray-700 px-10 py-3 text-sm font-semibold transition-colors hover:bg-gray-700 cursor-pointer text-center"
                >
                    {addNewText}
                </Link>
            </div>

            <div className="overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="">
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
                        {items.map((item) => {
                            const key =
                                item.pet_id ??
                                item.organization_id ??
                                Math.random();

                            return (
                                <tr
                                    key={key}
                                    className="hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.accessor)}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[24px]"
                                        >
                                            {col.cell
                                                ? col.cell(item, onAction)
                                                : String(
                                                      (item as any)[
                                                          col.accessor
                                                      ],
                                                  )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
}
