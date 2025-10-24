import { useState, useEffect, RefObject } from 'react';

/**
 * Хук для реалізації нескінченного скролу.
 * @param observerRef - Референс на елемент, який виступає "спостерігачем" (знаходиться внизу списку).
 * @param callback - Функція, яку потрібно викликати для завантаження наступної сторінки.
 * @param hasMore - Булеве значення: чи є ще сторінки для завантаження.
 */
const useInfiniteScroll = (
  observerRef: RefObject<HTMLElement>,
  callback: () => Promise<void>,
  hasMore: boolean
) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!observerRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          callback().finally(() => {
            setLoading(false);
          });
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [observerRef, callback, hasMore]);

  return { loading };
};

export default useInfiniteScroll;