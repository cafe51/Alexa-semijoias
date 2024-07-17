//app/components/ProductsList.tsx

'use client';

import { useEffect, useState } from 'react';
import Card from './Card';
import { useSnapshot } from '../hooks/useSnapshot';
import { ProductType } from '../utils/types';

export default function ProductsList({ productType }: { productType: string }) {
    const { documents } = useSnapshot<ProductType>('produtos', [{ field: 'categoria', operator: '==', value: productType }]);
    const [isLoading, setIsLoading] = useState(true);



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
            <h2>{ productType.charAt(0).toUpperCase() + productType.slice(1) }</h2>
            { documents && documents[0] && (
                <div className=" flex flex-wrap justify-center gap-2 ">
                    { documents.map((productsData) => {
                        return <Card key={ productsData.id } productType={ productType } cardData={ productsData }  />;
                    }) }
                </div>
            ) }
        </main>
    );
}
