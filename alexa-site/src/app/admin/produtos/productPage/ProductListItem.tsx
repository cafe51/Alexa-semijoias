import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import { PiTrashSimpleBold } from 'react-icons/pi';
import blankImage from '../../../../../public/blankImage.png';
import { formatPrice } from '@/app/utils/formatPrice';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';

interface ProductListItemProps {
    product: ProductBundleType & FireBaseDocument;
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
                <p className='text-sm text-center p-2 py-4 font-bold'>Tem certeza que deseja deletar esse produto?</p>
                <div className='flex justify-between w-full'>
                    <div className='w-5/12'>
                        <LargeButton color='red' onClick={ onConfirm }>
                        Sim
                        </LargeButton>
                    </div>

                    <div className='w-5/12'>
                        <LargeButton color='green' onClick={ onClose }>
                        Não
                        </LargeButton>
                    </div>

                </div>
            </div>
        </ModalMaker>
    );
});

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

const ProductListItem: React.FC<ProductListItemProps> = React.memo(({
    product,
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
        <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg transition transform hover:scale-105">
            <DeleteConfirmationModal isOpen={ showDeleteModal } onClose={ () => setShowDeleteModal(false) } onConfirm={ handleDeleteConfirm } />
            <div className="flex justify-between items-center">
                <p className="font-bold text-[#333333]">{ toTitleCase(product.name) }</p>
                <button className="text-[#C48B9F]" onClick={ handleEditClick }>
                    <FiEdit size={ 20 } />
                </button>
            </div>
            
            <div
                className="relative rounded-lg h-28 w-28 overflow-hidden bg-gray-100"
                onClick={ handleProductImageClick }
            >
                <Image
                    className="object-cover w-full h-full"
                    src={ product.images?.[0]?.localUrl || blankImage }
                    alt="Foto do produto"
                    fill
                    // loading="lazy"
                    priority
                    sizes='300px'
                />
            </div>

            <div className="flex justify-between items-center">
                <p className="text-[#333333]">Estoque: <span className="font-bold">{ product.estoqueTotal }</span></p>
                <p className="text-[#D4AF37] font-bold">{ formatPrice(product.value.price) }</p>
                <button className="text-red-500" onClick={ handleDeleteClick }>
                    <PiTrashSimpleBold size={ 20 } />
                </button>
            </div>
        </div>
    );
});

ProductListItem.displayName = 'ProductListItem';

export default ProductListItem;