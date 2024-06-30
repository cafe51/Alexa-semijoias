// app/context/UserInfoContext
'use client';

import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType, FilterOption, OrderType, ProductCartType, UserType } from '../utils/types';
import { useSnapshot2 } from '../hooks/useSnapshot2';
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

    const { documents: userInfo } = useSnapshot2<UserType>(
        'usuarios',
        userQuery,
    );
    
    const { documents: carrinho } = useSnapshot2<CartInfoType>(
        'carrinhos',
        userQuery, 
    );

    const { documents: pedidos } = useSnapshot2<OrderType>(
        'pedidos', 
        userQuery, 
    );

    const { mappedProducts } = useCart(productIds, carrinho);

    useEffect(() => {
        if (carrinho && carrinho) {
            const ids = carrinho.map((info) => info.productId);
            console.log('useEffect userInforContext.tsx');
            setProductIds(ids);
        }
    }, [carrinho]);

    return (
        <UserInfoContext.Provider value={ { carrinho: mappedProducts, userInfo: userInfo ? userInfo[0] : null, pedidos: pedidos }  }>
            { children }
        </UserInfoContext.Provider>
    );
}