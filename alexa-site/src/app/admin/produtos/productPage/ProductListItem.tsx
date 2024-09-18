import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import { PiTrashSimpleBold } from 'react-icons/pi';
import blankImage from '../../../../../public/blankImage.jpg';
import { formatPrice } from '@/app/utils/formatPrice';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';

interface ProductListItemProps {
    product: ProductBundleType & FireBaseDocument;
    index: number;
    setSelectedProduct: (product: ProductBundleType & FireBaseDocument) => void;
    setShowProductDetailModal: (product: ProductBundleType & FireBaseDocument) => void;
    deleteDocument: (id: string) => void;
    setRefreshProducts: () => void;
}

const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = React.memo(({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <ModalMaker closeModelClick={ onClose } title='Deletar produto'>
            <div className='flex flex-col gap-2 p-2'>
                <p className='text-xl font-bold'>Tem certeza que deseja deletar esse produto?</p>
                <div className='flex justify-between w-full'>
                    <LargeButton color='red' onClick={ onConfirm }>
                        Sim
                    </LargeButton>
                    <LargeButton color='green' onClick={ onClose }>
                        Não
                    </LargeButton>
                </div>
            </div>
        </ModalMaker>
    );
});

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

const ProductListItem: React.FC<ProductListItemProps> = React.memo(({
    product,
    index,
    setSelectedProduct,
    setShowProductDetailModal,
    deleteDocument,
    setRefreshProducts,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEditClick = useCallback(() => {
        setSelectedProduct(product);
    }, [product, setSelectedProduct]);

    const handleProductImageClick = useCallback(() => {
        setShowProductDetailModal(product);
    }, [product, setShowProductDetailModal]);

    const handleDeleteClick = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        deleteDocument(product.id);
        setRefreshProducts();
        setShowDeleteModal(false);
    }, [product.id, deleteDocument, setRefreshProducts]);

    return (
        <div className={ `flex text-xs gap-2 w-full h-32 p-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}` }>
            <DeleteConfirmationModal
                isOpen={ showDeleteModal }
                onClose={ () => setShowDeleteModal(false) }
                onConfirm={ handleDeleteConfirm }
            />
            <div className='rounded-lg h-20 w-20 relative overflow-hidden flex-shrink-0'
                onClick={ handleProductImageClick }
            >
                <Image
                    className='rounded-lg object-cover scale-100'
                    src={ product.images && product.images.length > 0 && product.images[0].localUrl ? product.images[0].localUrl : blankImage }
                    alt="Foto da peça"
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                />
            </div>

            <div className='flex flex-col justify-between flex-grow'>
                <p className='font-bold'>{ product.name }</p>
                <div className='flex justify-between'>
                    <p>estoque: <span className='font-bold'>{ product.estoqueTotal }</span></p>
                    <p>{ formatPrice(product.value.price) }</p>
                </div>
            </div>

            <div className='flex flex-col items-center justify-between min-w-7 h-full flex-shrink-0'>
                <button onClick={ handleEditClick }>
                    <FiEdit size={ 20 } />
                </button>
                <button className='flex-shrink-0' onClick={ handleDeleteClick }>
                    <PiTrashSimpleBold size={ 20 } />
                </button>
            </div>
        </div>
    );
});

ProductListItem.displayName = 'ProductListItem';

export default ProductListItem;