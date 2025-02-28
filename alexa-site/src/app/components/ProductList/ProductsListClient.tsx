// src/app/components/ProductList/ProductsListClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductBundleType, FireBaseDocument, SortOption } from '@/app/utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import ProductSorter from './ProductSorter';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getBreadcrumbItems } from '@/app/utils/breadcrumbUtils';
import toTitleCase from '@/app/utils/toTitleCase';
import { useProducts } from '@/app/hooks/useProducts';

interface ProductsListClientProps {
  sectionName?: string;
  subsection?: string;
  searchTerm?: string;
  initialData?: {
    products: (ProductBundleType & FireBaseDocument)[];
    hasMore: boolean;
    lastVisible: string | null;
  };
}

export default function ProductsListClient({ 
    sectionName, 
    subsection, 
    searchTerm,
    initialData, 
}: ProductsListClientProps) {
    const [currentSort, setCurrentSort] = useState<SortOption>({ 
        value: 'newest', 
        label: 'Novidades', 
        orderBy: 'creationDate', 
        direction: 'desc', 
    });

    const paginatorRef = useRef<HTMLDivElement>(null);

    const { 
        products: productsToShow, 
        isLoading, 
        hasMore, 
        loadMore, 
    } = useProducts({
        sectionName,
        subsection,
        initialData,
        orderBy: currentSort.orderBy,
        direction: currentSort.direction,
        searchTerm,
    });

    // Rola para o topo ao montar o componente
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        if (!hasMore || isLoading || !paginatorRef.current) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                loadMore();
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1,
        });
        observer.observe(paginatorRef.current);
        return () => {
            if (paginatorRef.current) {
                observer.unobserve(paginatorRef.current);
            }
            observer.disconnect();
        };
    }, [hasMore, isLoading, loadMore, paginatorRef]);

    if (isLoading && productsToShow.length === 0) {
        return <LoadingIndicator />;
    }

    if (productsToShow.length === 0) {
        if (searchTerm) {
            return <h1 className="text-center mt-8">Nenhum produto encontrado para &ldquo;{ searchTerm }&rdquo;</h1>;
        }
        return <h1 className="text-center mt-8">Ainda não há produtos nessa seção</h1>;
    }
    
    return (
        <main>
            { productsToShow.length > 0 && (
                <>
                    { sectionName && (
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center uppercase text-[#333333]">
                                { subsection ? toTitleCase(subsection) : toTitleCase(sectionName) }
                            </h1>
                            <Breadcrumbs items={ getBreadcrumbItems(sectionName, subsection) } />
                        </div>
                    ) }
                    <div className='w-full flex justify-end'>
                        <ProductSorter 
                            currentSort={ currentSort.value }
                            onSortChange={ (option) => setCurrentSort(option) }
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        { productsToShow.map((productData) => (
                            <ProductCard key={ productData.id } product={ productData } />
                        )) }
                    </div>
                    { hasMore && (
                        <div ref={ paginatorRef }>
                            <ButtonPaginator loadMore={ loadMore } isLoading={ isLoading }>
                                Mostrar mais
                            </ButtonPaginator>
                        </div>
                    ) }
                </>
            ) }
        </main>
    );
}
