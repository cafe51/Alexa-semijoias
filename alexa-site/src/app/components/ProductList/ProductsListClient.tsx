// src/app/components/ProductList/ProductsListClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductBundleType, FireBaseDocument, SortOption } from '@/app/utils/types';
import ProductSorter from './ProductSorter';
import ProductCardsList from './ProductCardsList';
import SectionBanner from './SectionBanner';

interface ProductsListClientProps {
  sectionName?: string;
  subsection?: string;
  searchTerm?: string;
  initialData?: {
    products: (ProductBundleType & FireBaseDocument)[];
    hasMore: boolean;
    lastVisible: string | null;
  };
  isMobileLayout?: boolean;
}

export default function ProductsListClient({ 
    sectionName, 
    subsection, 
    searchTerm,
    initialData,
    isMobileLayout = false,
}: ProductsListClientProps) {
    const [currentSort, setCurrentSort] = useState<SortOption>({ 
        value: 'newest', 
        label: 'Novidades', 
        orderBy: 'creationDate', 
        direction: 'desc', 
    });

    // Rola para o topo ao montar o componente
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <main className='w-full'>
            {
                initialData
                &&
                <SectionBanner
                    lastAddProduct={ initialData.products[initialData.products.length - 1] }
                    sectionName={ sectionName }
                    subsection={ subsection }
                />
            }

            <div className='w-full flex justify-end px-4 md:px-8 lg:px-12 xl:px-16 pt-4 pb-4'>
                <ProductSorter 
                    currentSort={ currentSort.value }
                    onSortChange={ (option) => setCurrentSort(option) }
                />
            </div>
            <div className='w-full px-4 md:px-8 lg:px-12 xl:px-16'>
                <ProductCardsList
                    orderBy={ currentSort.orderBy }
                    direction={ currentSort.direction }
                    sectionName={ sectionName }
                    subsection={ subsection }
                    searchTerm={ searchTerm }
                    initialData={ initialData }
                    isMobileLayout={ isMobileLayout }
                />
            </div>
            
        </main>
    );
}
