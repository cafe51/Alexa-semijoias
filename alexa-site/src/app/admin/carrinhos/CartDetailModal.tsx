// components/CartDetailModal.tsx
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
                { items.map((item, index) => (
                    <CartItem key={ index } item={ item } />
                )) }
            </div>
        </SlideInModal>
    );
};

export default CartDetailModal;
