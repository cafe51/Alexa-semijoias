// src/app/hooks/useProducts.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';

type ProductsResponse = {
  products: (ProductBundleType & FireBaseDocument)[];
  hasMore: boolean;
  lastVisible: string | null;
};

type UseProductsProps = {
  sectionName?: string;
  subsection?: string;
  initialData?: ProductsResponse;
  orderBy?: string;
  direction?: 'asc' | 'desc';
  searchTerm?: string;
};

export function useProducts({
    sectionName,
    subsection,
    initialData,
    orderBy = 'creationDate',
    direction = 'desc',
    searchTerm,
}: UseProductsProps) {
    const [products, setProducts] = useState<(ProductBundleType & FireBaseDocument)[]>(
        initialData ? initialData.products : [],
    );
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData?.hasMore ?? false);
    const [lastVisible, setLastVisible] = useState<string | null>(
        initialData?.lastVisible || null,
    );

    // useRef para identificar a primeira renderização
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Na primeira render, se os parâmetros estiverem nos valores default e não houver filtros,
        // usamos o initialData e não buscamos os dados novamente.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (!searchTerm && !subsection && initialData && orderBy === 'creationDate' && direction === 'desc') {
                return;
            }
        }

        const fetchProductsData = async() => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (sectionName) params.append('section', sectionName);
                if (subsection) params.append('subsection', subsection);
                params.append('orderBy', orderBy);
                params.append('direction', direction);
                if (searchTerm) params.append('searchTerm', searchTerm);
                const response = await fetch(`/api/products?${params.toString()}`);
                if (!response.ok) {
                    throw new Error('Falha ao carregar produtos');
                }
                const data: ProductsResponse = await response.json();
                setProducts(data.products);
                setHasMore(data.hasMore);
                setLastVisible(data.lastVisible);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductsData();
    }, [sectionName, subsection, orderBy, direction, searchTerm]); // note que removemos initialData daqui

    const loadMore = async() => {
        if (!hasMore || isLoading) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (sectionName) params.append('section', sectionName);
            if (subsection) params.append('subsection', subsection);
            if (lastVisible) params.append('lastVisible', lastVisible);
            params.append('orderBy', orderBy);
            params.append('direction', direction);
            if (searchTerm) params.append('searchTerm', searchTerm);
            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Falha ao carregar mais produtos');
            }
            const data: ProductsResponse = await response.json();
            setProducts(prev => [...prev, ...data.products]);
            setHasMore(data.hasMore);
            setLastVisible(data.lastVisible);
        } catch (error) {
            console.error('Erro ao carregar mais produtos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        products,
        isLoading,
        hasMore,
        loadMore,
    };
}
