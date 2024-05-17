'use client';

import { useEffect, useState } from 'react';
import Header from './Header';

import { ProductType } from '../utils/types';
import { getProductApi } from '../utils/api';
import Card from './Card';


export default function ProductsList({ productType }: { productType: string }) {
    const [products, setProducts] = useState<ProductType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const updateProductsState = async() => {
        const productsData = await getProductApi(productType);
        setProducts(productsData);
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
                <h2>{ productType.charAt(0).toUpperCase() + productType.slice(1) }</h2>
                <div className="">
                    { isLoading || !products ? (
                        <h2>Loading...</h2>
                    ) : (
                        <div className=" flex flex-wrap justify-center gap-2">
                            { products.map((productsData) => {
                                return <Card key={ productsData.id } productType={ productType } cardData={ productsData }  />;
                            }) }
                        </div>
                    ) }
                </div>
            </main>
        </div>
    );
}
