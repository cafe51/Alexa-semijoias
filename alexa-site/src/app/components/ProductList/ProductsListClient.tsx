// src/app/components/ProductList/ProductsListClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductBundleType, FireBaseDocument, SortOption } from '@/app/utils/types';
import ProductSorter from './ProductSorter';
import ProductCardsList from './ProductCardsList';
import SectionBanner from './SectionBanner';
import { sendGTMEvent } from '@/app/utils/analytics';
import toTitleCase from '@/app/utils/toTitleCase';
import { createSlugName } from '@/app/utils/createSlugName';

interface ProductsListClientProps {
    bannerImage?: string | null;
    bannerDescription?: string | null;
    sectionName?: string;
    subsection?: string;
    collectionName?: string;
    searchTerm?: string;
    initialData?: {
        products: (ProductBundleType & FireBaseDocument)[];
        hasMore: boolean;
        lastVisible: string | null;
    };
    isMobileLayout?: boolean;
}

export default function ProductsListClient({
    bannerImage,
    bannerDescription,
    sectionName, 
    subsection,
    collectionName,
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

    useEffect(() => {
        try {
            const listName = collectionName ? collectionName : (subsection ? subsection : sectionName || 'todos os produtos'); 
            // Garante que temos produtos para enviar
            if (initialData && initialData.products && initialData.products.length > 0) { 
                sendGTMEvent('view_item_list', {
                    ecommerce: {
                        item_list_id: createSlugName(listName), // ID da lista (ex: 'brincos')
                        item_list_name: toTitleCase(listName), // Nome da lista (ex: 'Brincos')
                        items: initialData.products.map((product, index) => ({ // Mapeia os produtos da lista
                            item_id: product.id,
                            item_name: product.name,
                            item_brand: 'Alexa Semijoias',
                            item_category: listName, // A categoria principal desta lista
                            // item_variant: ..., // Se aplicável
                            price: product.value.promotionalPrice ? product.value.promotionalPrice : product.value.price, // Preço do item
                            quantity: 1, // Quantidade é sempre 1 para listas
                            index: index + 1, // Posição do item na lista (começa em 1)
                        })),
                    },
                });
            }
        } catch (error) {
            console.error('Erro ao enviar GTM view_item_list:', error); 
        }

    }, [initialData, sectionName, subsection, collectionName]); // Dependências
    
    return (
        <main className='w-full'>
            {
                initialData
                &&
                <SectionBanner
                    bannerImage={ bannerImage }
                    bannerDescription={ bannerDescription }
                    lastAddProduct={ initialData.products[initialData.products.length - 1] }
                    sectionName={ sectionName }
                    subsection={ subsection }
                    collectionName={ collectionName }
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
                    collectionName={ collectionName }
                    searchTerm={ searchTerm }
                    initialData={ initialData }
                    isMobileLayout={ isMobileLayout }
                />
            </div>
            
        </main>
    );
}
