// src/app/components/ProductList/ProductsListClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductBundleType, FireBaseDocument, SortOption } from '@/app/utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import ProductSorter from './ProductSorter';
import SectionPageTitle from '@/app/section/SectionPageTitle';
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
    
    useEffect(() => {
        // Se não há mais produtos para carregar ou já está carregando, não faz nada
        if (!hasMore || isLoading || !paginatorRef.current) return;
        
        // Cria um Intersection Observer para detectar quando o botão fica visível
        const observer = new IntersectionObserver((entries) => {
            // Se o botão está visível na tela e há mais produtos para carregar
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                // Aciona o carregamento de mais produtos
                loadMore();
            }
        }, {
            // Define a margem de observação (pode ser ajustada conforme necessário)
            rootMargin: '0px',
            // Define o quanto do elemento precisa estar visível para acionar (0 a 1)
            threshold: 0.1,
        });
        
        // Começa a observar o elemento do botão
        observer.observe(paginatorRef.current);
        
        // Limpa o observer quando o componente é desmontado
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
                        <SectionPageTitle 
                            section={ sectionName } 
                            subsection={ subsection } 
                        />
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
