// components/CartGroupCard.tsx
import React from 'react';

import { CartInfoType } from '@/app/utils/types';
import { useUser } from './useUser';
import { productCache } from './useProduct';

interface CartGroupCardProps {
  userId: string;
  items: CartInfoType[];
  onViewDetails: (userId: string, items: CartInfoType[]) => void;
}

const CartGroupCard: React.FC<CartGroupCardProps> = ({ userId, items, onViewDetails }) => {
    const { user, loading: userLoading, error: userError } = useUser(userId);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantidade, 0);

    // Calcula o total do carrinho usando dados já em cache (caso disponíveis)
    let totalPrice = 0;
    items.forEach(item => {
        const prod = productCache[item.productId];
        if (prod && prod.exist) {
            // console.log('prodXXXXXXXXXXxxprodprod', prod);

            // console.log('XXXXXXXXXXxx', prod.productVariations);
            if(!!prod.productVariations && prod.productVariations.length > 0) {
                const variation = prod.productVariations.find(v => v.sku === item.skuId);
                if (variation) {
                    totalPrice += variation.value.price * item.quantidade;
                }
            }
        }
    });

    return (
        <div className="border p-4 mb-4 rounded shadow">
            <div className="flex justify-between items-center">
                <div>
                    { userLoading ? (
                        <p>Carregando usuário...</p>
                    ) : userError || !user ? (
                        <p>Usuário desconhecido</p>
                    ) : (
                        <p className="font-bold">{ user.nome }</p>
                    ) }
                    <p>Total de itens: { totalQuantity }</p>
                    <p>
            Valor total:{ ' ' }
                        { totalPrice > 0 ? `R$ ${totalPrice.toFixed(2)}` : 'Calculando...' }
                    </p>
                </div>
                <button
                    onClick={ () => onViewDetails(userId, items) }
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
          Ver Detalhes
                </button>
            </div>

        </div>
    );
};

export default CartGroupCard;
