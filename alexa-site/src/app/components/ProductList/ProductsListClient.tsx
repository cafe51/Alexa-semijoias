// src/app/components/ProductList/ProductsListClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductBundleType, FireBaseDocument, SortOption } from '@/app/utils/types';
import ProductSorter from './ProductSorter';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getBreadcrumbItems } from '@/app/utils/breadcrumbUtils';
import toTitleCase from '@/app/utils/toTitleCase';
import ProductCardsList from './ProductCardsList';

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
        <main>

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center uppercase text-[#333333]">
                    { subsection ? toTitleCase(subsection) : toTitleCase(sectionName || 'produtos') }
                </h1>
                <Breadcrumbs items={ getBreadcrumbItems(sectionName, subsection) } />
            </div>

            <div className='w-full flex justify-end'>
                <ProductSorter 
                    currentSort={ currentSort.value }
                    onSortChange={ (option) => setCurrentSort(option) }
                />
            </div>
                    
            <ProductCardsList
                orderBy={ currentSort.orderBy }
                direction={ currentSort.direction }
                sectionName={ sectionName }
                subsection={ subsection }
                searchTerm={ searchTerm }
                initialData={ initialData }
                isMobileLayout={ isMobileLayout }
            />
            
        </main>
    );
}
