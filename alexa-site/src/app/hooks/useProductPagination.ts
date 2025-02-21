// src/app/admin/produtos/hooks/useProductPagination.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNumberedPagination } from './useNumberedPagination';
import { FilterOptionForUseSnapshot, ProductBundleType, SortOption } from '@/app/utils/types';
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
    // Estados para filtragem por seção e subseção
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedSubsection, setSelectedSubsection] = useState<string>('');

    // Novo estado: itens por página (10, 50, 100 ou "all")
    const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);

    // NOVOS ESTADOS PARA OS FILTROS:
    const [showPromotional, setShowPromotional] = useState(false);
    const [showLancamento, setShowLancamento] = useState(false);

    // Se searchTerm estiver preenchido, reseta os filtros de seção e subseção
    useEffect(() => {
        if (searchTerm.trim() !== '') {
            setSelectedSection('');
            setSelectedSubsection('');
        }
    }, [searchTerm]);

    const ordination = useMemo<{field: string, direction: 'asc' | 'desc'}>(() => 
        ({ field: currentSort.orderBy, direction: currentSort.direction }),
    [currentSort]);

    const collectionName = useMemo(() => 'products', []);

    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[] | null>(() => {
        const baseFilters: FilterOptionForUseSnapshot[] = [
            { field: 'estoqueTotal', operator: '>=', value: estoqueRange[0] },
            { field: 'estoqueTotal', operator: '<=', value: estoqueRange[1] },
            { field: 'value.price', operator: '>=', value: priceRange[0] },
            { field: 'value.price', operator: '<=', value: priceRange[1] },
        ];

        if (searchTerm) {
            const normalizedTerm = removeAccents(searchTerm.toLowerCase());
            baseFilters.push({ field: 'keyWords', operator: 'array-contains', value: normalizedTerm });
        } else {
            if (selectedSection) {
                if (selectedSubsection) {
                    baseFilters.push({ 
                        field: 'subsections', 
                        operator: 'array-contains', 
                        value: `${selectedSection}:${selectedSubsection}`, 
                    });
                } else {
                    baseFilters.push({ 
                        field: 'sections', 
                        operator: 'array-contains', 
                        value: selectedSection, 
                    });
                }
            }
        }
        // Adiciona os filtros para promoção e lançamento, se ativados
        if (showPromotional) {
            baseFilters.push({ field: 'promotional', operator: '==', value: true });
        }
        if (showLancamento) {
            baseFilters.push({ field: 'lancamento', operator: '==', value: true });
        }

        return baseFilters;
    }, [
        searchTerm,
        estoqueRange,
        priceRange,
        selectedSection,
        selectedSubsection,
        showPromotional,
        showLancamento,
    ]);

    const filtrosFinais = useMemo<FilterOptionForUseSnapshot[] | null>(() => {
        if (!pedidosFiltrados) return null;

        const filtrosShowProduct: FilterOptionForUseSnapshot[] = [];

        if (showStoreProducts && showOutStoreProducts) {
            // Sem filtro adicional
        } else if (showStoreProducts) {
            filtrosShowProduct.push({ field: 'showProduct', operator: '==', value: true });
        } else if (showOutStoreProducts) {
            filtrosShowProduct.push({ field: 'showProduct', operator: '==', value: false });
        } else {
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
        itemsPerPage,
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
            goToPage(1);
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
        selectedSection,
        setSelectedSection,
        selectedSubsection,
        setSelectedSubsection,
        itemsPerPage,
        setItemsPerPage,
        showPromotional,
        setShowPromotional,
        showLancamento,
        setShowLancamento,
    };
};
