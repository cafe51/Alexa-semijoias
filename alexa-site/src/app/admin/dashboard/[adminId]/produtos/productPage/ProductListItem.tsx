import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import { PiTrashSimpleBold } from 'react-icons/pi';
import blankImage from '../../../../../../../public/blankImage.jpg';
import { formatPrice } from '@/app/utils/formatPrice';
import { useState } from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';

interface ProductListItemProps {
    product: ProductBundleType & FireBaseDocument;
    index: number;
    setSelectedProduct: (product: ProductBundleType & FireBaseDocument) => void;
    setShowProductDetailModal: () => void;
    setShowEditionModal: () => void;
    deleteDocument: () => Promise<void>;
    setRefreshProducts: () => void;
}

export default function ProductListItem({
    product,
    index,
    setSelectedProduct,
    setShowProductDetailModal,
    setShowEditionModal,
    deleteDocument,
    setRefreshProducts,
}: ProductListItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <div
            className={ `flex text-xs gap-2 w-full h-32 p-2 ${ index % 2 == 0 ? 'bg-gray-100' : 'bg-white'}` }
        >
            {
                showDeleteModal && <ModalMaker closeModelClick={ () => setShowDeleteModal(false) } title='Deletar produto'>
                    <div className='flex flex-col gap-2 p-2'>
                        <p className='text-xl font-bold'>Tem certeza que deseja deletar esse produto?</p>
                        <div className='flex justify-between w-full'>
                            <div className=''>
                                <LargeButton color='red' onClick={ () => {
                                    deleteDocument();
                                    setRefreshProducts();
                                    setShowDeleteModal(false);
                                } }>
                            Sim
                                </LargeButton >
                            </div>

                            <div className=''>
                                <LargeButton color='green' onClick={ () => setShowDeleteModal(false) }>
                            Não
                                </LargeButton>
                            </div>

                        </div>
                    </div>
                </ModalMaker>
            }
            <div className='rounded-lg h-20 w-20 relative overflow-hidden flex-shrink-0'
                onClick={ () => {
                    setSelectedProduct(product);
                    setShowProductDetailModal();
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
                    setShowProductDetailModal();
                } }>
                    <p className='font-bold'>{ product.name }</p>
                </div>
                <div className='flex justify-between'>
                    <p>estoque: <span className='font-bold'>{ product.estoqueTotal }</span></p>
                    <p>{ formatPrice(product.value.price) }</p>
                </div>
            </div>

            <div className='flex flex-col items-center justify-between min-w-7 h-full flex-shrink-0'>
                <button
                    onClick={ () => {
                        console.log(product);
                        setSelectedProduct(product);
                        setShowEditionModal();
                    } }
                >
                    <FiEdit size={ 20 }/>
                </button>
                <button className='flex-shrink-0' onClick={ () =>  setShowDeleteModal(true) }>
                    <PiTrashSimpleBold size={ 20 }/>
                </button>
            </div>

        </div>
    );
}