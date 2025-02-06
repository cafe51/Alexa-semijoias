// src/app/components/ProductList/ProductsListClient.tsx
'use client';

import { useState } from 'react';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import ProductSorter, { SortOption } from './ProductSorter';
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
                    <ProductSorter 
                        currentSort={ currentSort.value }
                        onSortChange={ (option) => setCurrentSort(option) }
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        { productsToShow.map((productData) => (
                            <ProductCard key={ productData.id } product={ productData } />
                        )) }
                    </div>
                    { hasMore && (
                        <ButtonPaginator loadMore={ loadMore } isLoading={ isLoading }>
              Carregar mais
                        </ButtonPaginator>
                    ) }
                </>
            ) }
        </main>
    );
}
