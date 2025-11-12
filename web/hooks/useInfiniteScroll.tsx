'use client';

import { useState, useEffect } from 'react';

export function useInfiniteScroll(
  ref: React.RefObject<HTMLElement>,
  callback: () => Promise<void>,
  hasMore: boolean
) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !loading && hasMore) {
          setLoading(true);
          callback().finally(() => {
            setLoading(false);
          });
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, hasMore, loading]);

  return { loading };
}