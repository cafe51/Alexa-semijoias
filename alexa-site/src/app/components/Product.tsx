'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import { ProductType } from '../utils/types';
import { getProductApiById } from '../utils/api';
import ResponsiveCarousel from './ResponsiveCarousel';



export default function Product({ id, productType }: {id: string, productType: string}) {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const updateProductsState = async() => {
        const productData = await getProductApiById(productType, id);
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
            <main className="flex flex-col gap-4 items-center justify-between pt-40 p-6">
                { isLoading || !product ? 'carregando' : (
                    <>  
                        <p>Início/ { productType.charAt(0).toUpperCase() + productType.slice(1) }/ <span className='font-bold'>{ product.nome }</span></p>
                        
                        <ResponsiveCarousel productData={ product }/>
                        
                        <p className='text-sm'>{ product.descricao }</p>
                        <h2>{ product.nome.toUpperCase() }</h2>
                    </>
                // 'olá'
                ) }
            </main>
        </div>
    );
}
