//app/components/ProductsList.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSnapshot } from '../../hooks/useSnapshot';
import { FilterOptionForUseSnapshot, ProductBundleType } from '../../utils/types';
import ProductCard from './ProductCard';

export default function ProductsList({ sectionName, subsection }: { sectionName: string, subsection?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[]>(() => {
        // { field: 'subsections', operator: 'array-contains', value: subsections }
        if(subsection) {
            return [
                // { field: 'estoque', operator: '>', value: 0 },
                // { field: 'sections', operator: 'array-contains', value: sectionName },
                { field: 'subsections', operator: 'array-contains', value: subsection },
            ];
        } else {
            return [
            // { field: 'estoque', operator: '>', value: 0 },
                { field: 'sections', operator: 'array-contains', value: sectionName },
            ];
        }

    },
    [sectionName, subsection], 
    );

    const { documents } = useSnapshot<ProductBundleType>(
        'products', 
        pedidosFiltrados, 
    );


    useEffect(() => {
        setIsLoading(true);
        try {
            documents && setIsLoading(false);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);  
            } else { console.log('erro desconhecido'); }
        }
    
    }, [documents]);

    if(isLoading) return  <h1>Laoding...</h1>;

    if(documents && documents.length <= 0) return  <h1>Ainda não há produtos nessa categoria</h1>;

    return (
        <main>
            { documents && documents[0] && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    { documents.map((productData) => (
                        <ProductCard key={ productData.id } product={ productData }  />
                    )) }
                </div>
            ) }
        </main>
    );
}
