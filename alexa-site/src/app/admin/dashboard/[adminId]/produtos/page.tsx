'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, ProductBundleType, StateNewProductType } from '@/app/utils/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import blankImage from '../../../../../../public/blankImage.jpg';
import formatPrice from '@/app/utils/formatPrice';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import DashboardProductDetails from './productPage/DashboardProductDetails';
import { PiTrashSimpleBold } from 'react-icons/pi';
import { FiEdit } from 'react-icons/fi';
import DashboardProductEdition from './productPage/DashboardProductEdition';
import { emptyProductBundleInitialState } from './productPage/emptyProductBundleInitialState';
import { initialEmptyState } from '@/app/hooks/useNewProductState';
import { useProductConverter } from '@/app/hooks/useProductConverter';

export default function ProductsDashboard() {
    const [products, setProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [showEditionModal, setShowEditionModal] = useState<boolean>(false);
    const [showProductDetailModal, setShowProductDetailModal] = useState<boolean>(false);
    const [productBundleEditable, setProductBundleEditable] = useState<StateNewProductType>(initialEmptyState);
    const [selectedProduct, setSelectedProduct] = useState< ProductBundleType & FireBaseDocument>(emptyProductBundleInitialState);
    // const [fileImages, setFileImages] = useState<{ file: File; localUrl: string; }[]>();

    const { useProductDataHandlers } = useProductConverter();

    const { getAllDocuments } = useCollection<ProductBundleType>('products');
    

    useEffect(() => {
        const fetchProducts = async() => {
            const res = await getAllDocuments();
            setProducts(res);
        };
        fetchProducts();
    }, []);



    useEffect(() => {
        if(selectedProduct.exist) {
            const editableProduct = useProductDataHandlers.finalTypeToEditableType(selectedProduct);
            setProductBundleEditable(editableProduct);
        }
    }, [selectedProduct]);

    return (
        <main className='w-full h-full'>
            <SlideInModal
                isOpen={ showEditionModal }
                closeModelClick={ () => setShowEditionModal(!showEditionModal)  }
                title="Editar Produto"
                fullWidth
            >
                { <DashboardProductEdition
                    product={ productBundleEditable }
                    useProductDataHandlers={ useProductDataHandlers }
                    productFromFirebase={ selectedProduct }
                /> }
            </SlideInModal>
            <SlideInModal
                isOpen={ showProductDetailModal }
                closeModelClick={ () => setShowProductDetailModal(!showProductDetailModal) }
                title="Detalhes do produto"
                fullWidth
            >
                { <DashboardProductDetails product={ selectedProduct }/> }

            </SlideInModal>
            <section className='flex flex-col gap-2 w-full h-full'>
                {
                    products.length > 0 && products.map((product, index) => {
                        return (
                            <div
                                key={ product.id }
                                className={ `flex text-xs gap-2 w-full h-32 p-2 ${ index % 2 == 0 ? 'bg-gray-100' : 'bg-white'}` }
                            >
                                <div className='rounded-lg h-20 w-20 relative overflow-hidden flex-shrink-0'
                                    onClick={ () => {
                                        setSelectedProduct(product);
                                        setShowProductDetailModal(!showProductDetailModal);
                                    } }
                                >
                                    <Image
                                        className='rounded-lg object-cover scale-100'
                                        src={ product.images ? product.images[0] : blankImage }
                                        alt="Foto da peça"
                                        fill
                                    />
                                </div>

                                <div className='flex flex-col justify-between flex-grow'>
                                    <div onClick={ () => {
                                        setSelectedProduct(product);
                                        setShowProductDetailModal(!showProductDetailModal);
                                    } }>
                                        <p className='font-bold'>{ product.name }</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>estoque: <span className='font-bold'>{ product.estoqueTotal }</span></p>
                                        <p>{ formatPrice(product.value.price) }</p>
                                    </div>
                                </div>

                                <div className='flex flex-col items-center justify-between min-w-7 h-full flex-shrink-0'>
                                    <div
                                        onClick={ () => {
                                            console.log(product);
                                            setSelectedProduct(product);
                                            setShowEditionModal(!showEditionModal);
                                        } }
                                    >
                                        <FiEdit size={ 20 }/>
                                    </div>
                                    <div className='flex-shrink-0'>
                                        <PiTrashSimpleBold size={ 20 }/>
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