import { useState, useCallback, useMemo } from 'react';
import { useNumberedPagination } from './useNumberedPagination';
import { ProductBundleType } from '@/app/utils/types';

export const useProductPagination = () => {
    const [error, setError] = useState<string | null>(null);

    const ordination = useMemo<{field: string, direction: 'desc' | 'asc'}>(() => 
        ({ field: 'updatingDate', direction: 'desc' }),
    []);

    const ITEMS_PER_PAGE = useMemo(() => 20, []);

    const collectionName = useMemo(() => 'products', []);

    const { 
        documents: products, 
        isLoading, 
        currentPage,
        totalPages,
        goToPage,
        refresh,
        error: paginationError,
    } = useNumberedPagination<ProductBundleType>(
        collectionName,
        null,
        ITEMS_PER_PAGE,
        ordination,
    );

    const handlePageChange = useCallback((page: number) => {
        try {
            goToPage(page);
            setError(null);
        } catch (error) {
            console.error('Erro ao mudar de página:', error);
            setError('Falha ao carregar a página. Por favor, tente novamente.');
        }
    }, [goToPage]);

    const handleRefresh = useCallback(() => {
        try {
            refresh();
            setError(null);
        } catch (error) {
            console.error('Erro ao atualizar produtos:', error);
            setError('Falha ao atualizar produtos. Por favor, tente novamente.');
        }
    }, [refresh]);

    return { 
        products: products || [], 
        isLoading, 
        error: error || paginationError,
        currentPage,
        totalPages,
        goToPage: handlePageChange,
        refresh: handleRefresh,
    };
};
