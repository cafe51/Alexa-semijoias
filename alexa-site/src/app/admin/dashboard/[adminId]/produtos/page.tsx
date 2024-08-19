'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { ProductBundleType } from '@/app/utils/types';
import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import blankImage from '../../../../../../public/blankImage.jpg';

export default function ProductsDashboard() {
    const [products, setProducts] = useState<(ProductBundleType & DocumentData)[]>([]);
    const { getAllDocuments } = useCollection<ProductBundleType>('products');

    useEffect(() => {
        const fetchProducts = async() => {
            const res = await getAllDocuments();
            setProducts(res);
        };
        fetchProducts();
    }, []);

    return (
        <main className='w-full'>
            <section className='w-full'>
                {
                    products.length > 0 && products.map((product, index) => {
                        return (
                            <div key={ product.id } className={ `flex flex-col justify-between text-xs gap-2 w-full p-2 ${ index % 2 == 0 ? 'bg-gray-100' : 'bg-white'}` }>
                                <div className='rounded-lg relative h-[75px] w-[75px] overflow-hidden'>
                                    <Image
                                        className='rounded-lg object-cover scale-125'
                                        src={ product.images ? product.images[0] : blankImage }
                                        alt="Foto da peça"
                                        fill
                                    />
                                </div>
                                <p>{ product.name }</p>
                            </div>
                        );
                    })
                }
            </section>
        </main>
    );
}