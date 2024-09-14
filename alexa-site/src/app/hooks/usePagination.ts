import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

interface UsePaginationResult<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  paginatedItems: T[];
  totalPages: number;
}

export function usePagination<T>({ items, itemsPerPage }: UsePaginationProps<T>): UsePaginationResult<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return {
        currentPage,
        setCurrentPage,
        paginatedItems,
        totalPages,
    };
}