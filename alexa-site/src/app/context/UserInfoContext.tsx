// app/context/UserInfoContext
'use client';

import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType, FilterOption, OrderType, ProductCartType, ProductType, UserType } from '../utils/types';
import { useSnapshot } from '../hooks/useSnapshot';
import { DocumentData } from 'firebase/firestore';
import { useCart } from '../hooks/useCart';

interface IUserInfoContext {
    carrinho: (ProductCartType)[] | null;
    userInfo: (UserType & DocumentData) | null;
    pedidos: (OrderType & DocumentData)[] | null;
}
export const UserInfoContext = createContext<IUserInfoContext | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
    const [productIds, setProductIds] = useState<string[]>(['']);
    
    
    const { user } = useAuthContext();
    
    const userQuery = useMemo<FilterOption[]>(() => 
        [{ field: 'userId', operator: '==', value: user ? user.uid : 'invalidId' }],
    [user], // Só recriar a query quando 'user' mudar
    );

    const { documents: userInfo } = useSnapshot<UserType>(
        'usuarios',
        userQuery,
    );
    
    const { documents: cartInfos } = useSnapshot<CartInfoType>(
        'carrinhos',
        userQuery, 
    );

    const { documents: pedidos } = useSnapshot<OrderType>(
        'pedidos', 
        userQuery, 
    );


    const pedidosDoCarrinhoQuery = useMemo<FilterOption[]>(() => 
        [{ field: 'id', operator: 'in', value: productIds && productIds.length > 0 ? productIds : ['invalidId'] }],
    [productIds], // Só recriar a query quando 'productIds' mudar
    );

    const { documents: pedidosDoCarrinho } = useSnapshot<ProductType>(
        'produtos', 
        pedidosDoCarrinhoQuery, 
    );

    const { mappedProducts } = useCart(cartInfos, pedidosDoCarrinho);

    console.log('AAAAA mappedProducts', cartInfos?.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0));

    useEffect(() => {
        if (cartInfos && cartInfos) {
            const ids = cartInfos.map((info) => info.productId);
            console.log('useEffect userInforContext.tsx');
            setProductIds(ids);
        }
    }, [cartInfos]);

    return (
        <UserInfoContext.Provider value={ { carrinho: mappedProducts, userInfo: userInfo ? userInfo[0] : null, pedidos: pedidos }  }>
            { children }
        </UserInfoContext.Provider>
    );
}