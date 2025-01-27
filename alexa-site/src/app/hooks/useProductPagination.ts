import { useState, useCallback, useMemo } from 'react';
import { useNumberedPagination } from './useNumberedPagination';
import { FilterOptionForUseSnapshot, ProductBundleType } from '@/app/utils/types';
import { SortOption } from '@/app/components/ProductList/ProductSorter';
import removeAccents from '../utils/removeAccents';

const MAX_STOCK_EMULATOR = 9999999999;
const MAX_PRICE_EMULATOR = 999999999999999;
const MAX_STOCK_PRODUCTION = 20;
const MAX_PRICE_PRODUCTION = 2000;

const MAX_STOCK = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ? MAX_STOCK_EMULATOR : MAX_STOCK_PRODUCTION;
const MAX_PRICE = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ? MAX_PRICE_EMULATOR : MAX_PRICE_PRODUCTION;

export const useProductPagination = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showStoreProducts, setShowStoreProducts] = useState(true);
    const [showOutStoreProducts, setShowOutStoreProducts] = useState(true);
    const [estoqueRange, setEstoqueRange] = useState<[number, number]>([0, MAX_STOCK]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
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
        const baseFilters: FilterOptionForUseSnapshot[] = [
            { field: 'estoqueTotal', operator: '>=', value: estoqueRange[0] },
            { field: 'estoqueTotal', operator: '<=', value: estoqueRange[1] },
            { field: 'value.price', operator: '>=', value: priceRange[0] },
            { field: 'value.price', operator: '<=', value: priceRange[1] },
        ];

        // Se existe um termo de busca, verifica no campo keyWords
        if (searchTerm) {
            const normalizedTerm = removeAccents(searchTerm.toLowerCase());
            return [
                ...baseFilters,
                { field: 'keyWords', operator: 'array-contains', value: normalizedTerm },
            ];
        }

        return baseFilters;
    }, [
        searchTerm,
        estoqueRange,
        priceRange,
    ]);

    const filtrosFinais = useMemo<FilterOptionForUseSnapshot[] | null>(() => {
        if (!pedidosFiltrados) return null;

        const filtrosShowProduct: FilterOptionForUseSnapshot[] = [];

        if (showStoreProducts && showOutStoreProducts) {
            // Não adiciona filtro, mostra todos
        } else if (showStoreProducts) {
            filtrosShowProduct.push({ field: 'showProduct', operator: '==', value: true });
        } else if (showOutStoreProducts) {
            filtrosShowProduct.push({ field: 'showProduct', operator: '==', value: false });
        } else {
            // Nenhum produto deve ser mostrado
            return [{ field: 'showProduct', operator: '==', value: 'none' }];
        }

        return [...pedidosFiltrados, ...filtrosShowProduct];
    }, [pedidosFiltrados, showStoreProducts, showOutStoreProducts]);

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
        filtrosFinais,
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
        showStoreProducts,
        setShowStoreProducts,
        showOutStoreProducts,
        setShowOutStoreProducts,
        estoqueRange,
        setEstoqueRange,
        priceRange,
        setPriceRange,
    };
};
