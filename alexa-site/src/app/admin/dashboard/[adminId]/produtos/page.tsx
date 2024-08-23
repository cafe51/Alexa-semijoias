'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import blankImage from '../../../../../../public/blankImage.jpg';
import formatPrice from '@/app/utils/formatPrice';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import DashboardProductDetails from './productPage/DashboardProductDetails';

export default function ProductsDashboard() {
    const [products, setProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState< ProductBundleType & FireBaseDocument>({
        exist: true,
        id: '',
        categories: [''],
        description: '',
        estoqueTotal: 0,
        images: [''],
        name: '',
        productVariations: [
            {
                barcode: '',
                categories: [''],
                dimensions: { altura: 0, comprimento: 0, largura: 0 },
                estoque: 0,
                image: '',
                name: '',
                peso: 0,
                productId: '',
                sku: '',
                value: { cost: 0, price: 0, promotionalPrice: 0 },
            },
        ],
        sections: [''],
        subsections: [''],
        showProduct: false,
        value: { cost: 0, price: 0, promotionalPrice: 0 },
    });

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
            <SlideInModal
                isOpen={ showVariationEditionModal }
                closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                title="Detalhes do produto"
                fullWidth
            >
                { <DashboardProductDetails product={ selectedProduct }/> }

            </SlideInModal>
            <section className='w-full'>
                {
                    products.length > 0 && products.map((product, index) => {
                        return (
                            <div
                                key={ product.id }
                                className={ `flex text-xs gap-2 w-full p-2 ${ index % 2 == 0 ? 'bg-gray-100' : 'bg-white'}` }
                                onClick={ () => {
                                    console.log(product);
                                    setSelectedProduct(product);
                                    setShowVariationEditionModal(!showVariationEditionModal);
                                } }
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