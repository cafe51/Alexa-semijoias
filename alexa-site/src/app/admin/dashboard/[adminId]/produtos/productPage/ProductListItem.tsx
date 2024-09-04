import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { FiEdit } from 'react-icons/fi';
import { PiTrashSimpleBold } from 'react-icons/pi';
import blankImage from '../../../../../../../public/blankImage.jpg';
import formatPrice from '@/app/utils/formatPrice';

interface ProductListItemProps {
    product: ProductBundleType & FireBaseDocument;
    index: number;
    setSelectedProduct: Dispatch<SetStateAction<ProductBundleType & FireBaseDocument>>;
    setShowProductDetailModal: Dispatch<SetStateAction<boolean>>;
    showProductDetailModal: boolean;
    showEditionModal: boolean;
    setShowEditionModal: Dispatch<SetStateAction<boolean>>
}

export default function ProductListItem({
    product,
    index,
    setSelectedProduct,
    setShowProductDetailModal,
    showProductDetailModal,
    showEditionModal,
    setShowEditionModal,
}: ProductListItemProps) {
    return (
        <div
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
                    src={ product.images ? product.images[0].localUrl : blankImage }
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
}