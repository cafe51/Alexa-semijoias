'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import blankImage from '../../../../../../public/blankImage.jpg';
import formatPrice from '@/app/utils/formatPrice';
import ModalMaker from '@/app/components/ModalMaker';

export default function ProductsDashboard() {
    const [products, setProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);

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
            { showVariationEditionModal && <ModalMaker
                title='Detalhes do produto'
                closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
            >
                <div>
                        Olá, mundo
                </div>
            </ModalMaker> }
            <section className='w-full'>
                {
                    products.length > 0 && products.map((product, index) => {
                        return (
                            <div
                                key={ product.id }
                                className={ `flex text-xs gap-2 w-full p-2 ${ index % 2 == 0 ? 'bg-gray-100' : 'bg-white'}` }
                                onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                            >
                                <div className='rounded-lg h-20 w-20 relative overflow-hidden flex-shrink-0'>
                                    <Image
                                        className='rounded-lg object-cover scale-100'
                                        src={ product.images ? product.images[0] : blankImage }
                                        alt="Foto da peça"
                                        fill
                                    />
                                </div>
                                <div className='flex flex-col justify-between flex-grow'>
                                    <div>
                                        <p className='font-bold'>{ product.name }</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>estoque: <span className='font-bold'>{ product.estoqueTotal }</span></p>
                                        <p>{ formatPrice(product.value.price) }</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        </main>
    );
}