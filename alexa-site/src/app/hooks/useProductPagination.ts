import { useState, useCallback, useMemo } from 'react';
import { useNumberedPagination } from './useNumberedPagination';
import { FilterOptionForUseSnapshot, ProductBundleType } from '@/app/utils/types';
import { SortOption } from '@/app/components/ProductList/ProductSorter';
import removeAccents from '../utils/removeAccents';

export const useProductPagination = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [currentSort, setCurrentSort] = useState<SortOption>({ 
        value: 'newest', 
        label: 'Novidades', 
        orderBy: 'updatingDate', 
        direction: 'desc',
    });

    const ordination = useMemo<{field: string, direction: 'asc' | 'desc'}>(() => 
        ({ field: currentSort.orderBy, direction: currentSort.direction }),
    [currentSort]);

    const ITEMS_PER_PAGE = useMemo(() => 20, []);

    const collectionName = useMemo(() => 'products', []);

    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[] | null>(() => {
        // const baseFilters: FilterOptionForUseSnapshot[] = [
        //     { field: 'showProduct', operator: '==', value: true },
        //     { field: 'estoqueTotal', operator: '>', value: 0 },
        // ];

        // Se existe um termo de busca, verifica no campo keyWords
        if (searchTerm) {
            const normalizedTerm = removeAccents(searchTerm.toLowerCase());
            return [
                // ...baseFilters,
                { field: 'keyWords', operator: 'array-contains', value: normalizedTerm },
            ];
        }

        // // Filtro por subseção, se especificado
        // if (subsection) {
        //     return [
        //         ...baseFilters,
        //         { field: 'subsections', operator: 'array-contains', value: subsection },
        //     ];
        // }

        // // Filtro por seção, se especificado
        // if (sectionName) {
        //     return [
        //         ...baseFilters,
        //         { field: 'sections', operator: 'array-contains', value: sectionName },
        //     ];
        // }

        // return baseFilters;
        return null;
    }, [
        // sectionName,
        // subsection,
        searchTerm,
    ]);

    const { 
        documents: products, 
        isLoading, 
        currentPage,
        totalPages,
        totalDocuments,
        goToPage,
        refresh,
        error: paginationError,
    } = useNumberedPagination<ProductBundleType>(
        collectionName,
        pedidosFiltrados,
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

    const handleSortChange = useCallback((sortOption: SortOption) => {
        try {
            setCurrentSort(sortOption);
            goToPage(1); // Volta para a primeira página ao mudar a ordenação
        } catch (error) {
            console.error('Erro ao mudar ordenação:', error);
            setError('Falha ao ordenar produtos. Por favor, tente novamente.');
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
        totalDocuments,
        currentSort: currentSort.value,
        goToPage: handlePageChange,
        onSortChange: handleSortChange,
        refresh: handleRefresh,
        setSearchTerm,
        searchTerm,
    };
};
