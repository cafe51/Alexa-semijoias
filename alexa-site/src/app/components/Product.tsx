'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import { ProductType } from '../utils/types';
import { getProductApiById } from '../utils/api';



export default function Product({ id }: {id: string}) {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const updateProductsState = async() => {
        const productData = await getProductApiById('brincos', id);
        setProduct(productData);
    };


    useEffect(() => {
        setIsLoading(true);
        updateProductsState();
    
        setIsLoading(false);
    }, []);


    return (
        <div className="bg-pink-50">
            <Header />
            <main className="flex flex-col items-center justify-between pt-40">
                { isLoading || !product ? 'carregando' : (
                    <h2>{ product.nome }</h2>
                // 'olá'
                ) }
            </main>
        </div>
    );
}
