//app/components/ProductsList.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import Card from './Card';
import { useSnapshot } from '../hooks/useSnapshot';
import { FilterOption, ProductBundleType } from '../utils/types';

export default function ProductsList({ sectionName, subsection }: { sectionName: string, subsection?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const pedidosFiltrados = useMemo<FilterOption[]>(() => {
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
            <h2>{ sectionName.charAt(0).toUpperCase() + sectionName.slice(1) }</h2>
            { subsection && <h3>{ subsection.charAt(0).toUpperCase() + subsection.slice(1) }</h3> }
            { documents && documents[0] && (
                <div className=" flex flex-wrap justify-center gap-2 ">
                    { documents.map((productData) => {
                        return <Card key={ productData.id } sectionName={ sectionName } productData={ productData }  />;
                    }) }
                </div>
            ) }
        </main>
    );
}
