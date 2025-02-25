// src/app/admin/produtos/productPage/ProductListItem.tsx
import React, { useState, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import { PiTrashSimpleBold } from 'react-icons/pi';
import blankImage from '../../../../../public/blankImage.png';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';
import CartCardPrice from '@/app/carrinho/CartCardPrice';
import ProductCardBadgesAdmin from './ProductCardBadgesAdmin';

const LONG_PRESS_THRESHOLD = 2000;

interface ProductListItemProps {
    product: ProductBundleType & FireBaseDocument;
    setSelectedProduct: (product: ProductBundleType & FireBaseDocument) => void;
    setShowProductDetailModal: (product: ProductBundleType & FireBaseDocument) => void;
    deleteDocument: (id: string) => void;
    setRefreshProducts: () => void;
    // Propriedades para o modo de multiseleção
    multiSelectMode?: boolean;
    isSelected?: boolean;
    onActivateMultiSelect?: (product: ProductBundleType & FireBaseDocument) => void;
    onToggleSelect?: (product: ProductBundleType & FireBaseDocument) => void;
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
                <p className='text-sm text-center p-2 py-4 font-bold'>
                    Tem certeza que deseja deletar esse produto?
                </p>
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
    multiSelectMode = false,
    isSelected = false,
    onActivateMultiSelect,
    onToggleSelect,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const longPressTriggered = useRef(false);
    const justActivated = useRef(false);
    // Guarda as coordenadas iniciais do toque
    const touchStartCoords = useRef<{ x: number; y: number } | null>(null);

    // Eventos para desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName !== 'BUTTON' && !multiSelectMode) {
            longPressTriggered.current = false;
            justActivated.current = false;
            timerRef.current = setTimeout(() => {
                longPressTriggered.current = true;
                justActivated.current = true;
                if (onActivateMultiSelect) {
                    onActivateMultiSelect(product);
                }
            }, LONG_PRESS_THRESHOLD);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
        if (!multiSelectMode) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (!longPressTriggered.current) {
                setShowProductDetailModal(product);
            }
        } else {
            if (justActivated.current) {
                justActivated.current = false;
            } else if (onToggleSelect) {
                onToggleSelect(product);
            }
        }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Eventos para mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartCoords.current = { x: touch.clientX, y: touch.clientY };
        if (!multiSelectMode) {
            longPressTriggered.current = false;
            justActivated.current = false;
            timerRef.current = setTimeout(() => {
                longPressTriggered.current = true;
                justActivated.current = true;
                if (onActivateMultiSelect) {
                    onActivateMultiSelect(product);
                }
            }, LONG_PRESS_THRESHOLD);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        const touch = e.changedTouches[0];
        const start = touchStartCoords.current;
        const threshold = 10; // tolerância em pixels para diferenciar tap de scroll
        let isTap = true;
        if (start) {
            const dx = Math.abs(touch.clientX - start.x);
            const dy = Math.abs(touch.clientY - start.y);
            if (dx > threshold || dy > threshold) {
                isTap = false;
            }
        }
        if (multiSelectMode) {
            if (isTap) {
                // Previne o disparo de um onClick extra
                e.preventDefault();
            }
            if (justActivated.current) {
                justActivated.current = false;
            } else if (onToggleSelect && isTap) {
                onToggleSelect(product);
            }
        } else {
            if (isTap && !longPressTriggered.current) {
                setShowProductDetailModal(product);
            }
        }
        touchStartCoords.current = null;
    };

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProduct(product);
    }, [product, setSelectedProduct]);

    const handleDeleteConfirm = useCallback(() => {
        deleteDocument(product.id);
        setRefreshProducts();
        setShowDeleteModal(false);
    }, [product.id, deleteDocument, setRefreshProducts]);

    const multiSelectStyle = useMemo(() => {
        if (multiSelectMode && isSelected) {
            return 'scale-110 border-t-4 border-x-4 border-b-6 border-[#C48B9F] shadow-[#C48B9F] shadow-lg bg-[#C48B9F]/40 hover:bg-[#C48B9F]/10 ';
        }
        return '';
    }, [multiSelectMode, isSelected]);

    return (
        <div 
            className={ ` flex bg-white shadow-lg rounded-lg transition transform justify-between ${multiSelectStyle}` }
            onContextMenu={ e => e.preventDefault() }
            style={ { 
                userSelect: 'none', 
                WebkitUserSelect: 'none', 
                WebkitTouchCallout: 'none', 
            } }
        >
            <DeleteConfirmationModal 
                isOpen={ showDeleteModal } 
                onClose={ () => setShowDeleteModal(false) } 
                onConfirm={ handleDeleteConfirm } 
            />
            <div
                className='flex gap-2 w-full'
                onMouseDown={ handleMouseDown }
                onMouseUp={ handleMouseUp }
                onMouseLeave={ handleMouseLeave }
                onTouchStart={ handleTouchStart }
                onTouchEnd={ handleTouchEnd }
            >
                <div
                    className="relative rounded-lg rounded-r-none h-28 w-28 overflow-hidden bg-gray-100"
                >
                    <Image
                        className="object-cover w-full h-full"
                        src={ product.images?.[0]?.localUrl || blankImage }
                        alt="Foto do produto"
                        fill
                        priority
                        sizes="300px"
                        draggable={ false }
                    />
                    <ProductCardBadgesAdmin product={ product }/>
                </div>
                <div className="w-full flex flex-col justify-between py-2 pr-0">
                    <div className="flex justify-between items-center w-full">
                        <p className="font-bold text-[#333333] line-clamp-2">{ toTitleCase(product.name) }</p> 
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <p className="text-[#333333]">Estoque: <span className="font-bold">{ product.estoqueTotal }</span></p>
                        <CartCardPrice value={ product.value } quantidade={ 1 } />
                    </div>
                </div>
            </div>
            
            { !multiSelectMode &&<div className='flex flex-col justify-between p-1'>
                <button className="text-[#C48B9F]" onClick={ handleEditClick }>
                    <FiEdit size={ 20 } />
                </button>
                <button className="text-red-500" onClick={ () => setShowDeleteModal(true) }>
                    <PiTrashSimpleBold size={ 20 } />
                </button>
            </div> }
        </div>
    );
});

ProductListItem.displayName = 'ProductListItem';

export default ProductListItem;
