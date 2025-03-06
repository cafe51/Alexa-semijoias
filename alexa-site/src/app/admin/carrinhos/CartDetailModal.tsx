// src/app/admin/carrinhos/CartDetailModal.tsx
import React from 'react';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import CartItem from './CartItem';
import { useUser } from './useUser';
import { CartInfoType } from '@/app/utils/types';

interface CartDetailModalProps {
  userId: string;
  items: CartInfoType[];
  isOpen: boolean;
  onClose: () => void;
}

const CartDetailModal: React.FC<CartDetailModalProps> = ({ userId, items, isOpen, onClose }) => {
    const { user, loading: userLoading } = useUser(userId);
    return (
        <SlideInModal
            isOpen={ isOpen }
            closeModelClick={ onClose }
            title={ `Carrinho de ${userLoading || !user ? 'Carregando...' : user.nome}` }
            slideDirection="right"
        >
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Detalhes do Carrinho</h2>
                { items.map(item => (
                    // Utilize a propriedade id do documento como key (assegure-se de que item.id esteja disponível)
                    <div key={ item.skuId } onClick={ () => console.log('item', item) }>
                        <CartItem key={ item.skuId } item={ item } />
                    </div>
                )) }
            </div>
        </SlideInModal>
    );
};

export default CartDetailModal;
