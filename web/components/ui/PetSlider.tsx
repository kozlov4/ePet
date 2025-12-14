'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Pet {
    id: number;
    name: string;
    nameEn: string;
}

interface PetSliderProps {
    pets: Pet[];
    onPetSelect?: (pet: Pet) => void;
}

export const PetSlider: React.FC<PetSliderProps> = ({ pets, onPetSelect }) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const cardWidth = 284; // 263px card + 21px gap

    const updateScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        // Check if all cards fit in the container (with small tolerance for rounding)
        const canScroll = scrollWidth > clientWidth + 5; // 5px tolerance
        setIsScrollable(canScroll);

        if (canScroll) {
            setCanScrollLeft(scrollLeft > 5); // 5px tolerance
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px tolerance

            // Update current index based on scroll position
            const newIndex = Math.round(scrollLeft / cardWidth);
        } else {
            setCanScrollLeft(false);
            setCanScrollRight(false);
        }
    };

    const scrollLeft = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = cardWidth;
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = cardWidth;
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });
    };

    // Update scroll buttons on mount and scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Use setTimeout to ensure DOM is fully rendered
        const timeoutId = setTimeout(() => {
            updateScrollButtons();
        }, 100);

        container.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        return () => {
            clearTimeout(timeoutId);
            container.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [pets.length]);

    return (
        <div className="relative w-full">
            {/* Left Arrow */}
            {isScrollable && canScrollLeft && (
                <button
                    onClick={scrollLeft}
                    className="absolute -left-11 top-1/2 -translate-y-1/2 z-20  rounded-full p-2  hover:bg-gray-100 transition-colors"
                    aria-label="Попередній"
                >
                    <svg
                        width="16"
                        height="28"
                        viewBox="0 0 16 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15.4569 25.3088L13.1581 27.5612L0.636892 15.2851C0.435058 15.0884 0.274879 14.8545 0.165575 14.5968C0.0562712 14.3392 0 14.0629 0 13.7838C0 13.5047 0.0562712 13.2284 0.165575 12.9708C0.274879 12.7131 0.435058 12.4792 0.636892 12.2825L13.1581 0L15.4547 2.2525L3.70273 13.7806L15.4569 25.3088Z"
                            fill="black"
                        />
                    </svg>
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className={`flex gap-[21px] scroll-smooth scrollbar-hide ${
                    isScrollable ? 'overflow-x-auto' : 'overflow-x-hidden'
                }`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {pets.map((pet, index) => (
                    <motion.div
                        key={pet.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 w-[263px] cursor-pointer"
                        onClick={() => onPetSelect?.(pet)}
                    >
                        <div className="flex items-center bg-[#eee] rounded-[28px] py-3 pl-4 pr-10 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <div className="relative w-[121px] h-[143px] flex-shrink-0">
                                <Image
                                    src="/PetAvatar.png"
                                    alt={pet.name}
                                    width={121}
                                    height={143}
                                    className="object-cover rounded-2xl"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold text-black mb-1">
                                    {pet.name}
                                </h3>
                                <p className="text-[13px]  text-gray-600">
                                    {pet.nameEn}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Right Arrow */}
            {isScrollable && canScrollRight && (
                <button
                    onClick={scrollRight}
                    className="absolute -right-11 top-1/2 -translate-y-1/2 z-20 rounded-full p-2  hover:bg-gray-100 transition-colors"
                    aria-label="Наступний"
                >
                    <svg
                        width="16"
                        height="28"
                        viewBox="0 0 16 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.000138283 2.2518L2.29897 -0.000701904L14.8201 12.2754C15.022 12.4721 15.1822 12.706 15.2915 12.9637C15.4008 13.2214 15.457 13.4977 15.457 13.7767C15.457 14.0558 15.4008 14.3321 15.2915 14.5898C15.1822 14.8474 15.022 15.0813 14.8201 15.278L2.29897 27.5605L0.00230503 25.308L11.7543 13.7799L0.000138283 2.2518Z"
                            fill="black"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
