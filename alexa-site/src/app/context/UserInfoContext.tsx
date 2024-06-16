// app/context/UserInfoContext
'use client';

import { ReactNode, createContext, useMemo } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType, FilterOption, OrderType, UserType } from '../utils/types';
import { useCollection2 } from '../hooks/useCollection2';
import { DocumentData } from 'firebase/firestore';

interface IUserInfoContext {
    carrinho: (CartInfoType & DocumentData)[] | null;
    userInfo: (UserType & DocumentData) | null;
    pedidos: (OrderType & DocumentData)[] | null;
}
export const UserInfoContext = createContext<IUserInfoContext | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {

    const { user } = useAuthContext();

    const userQuery = useMemo<FilterOption[]>(() => 
        [{ field: 'userId', operator: '==', value: user ? user.uid : 'invalidId' }],
    [user], // Só recriar a query quando 'user' mudar
    );

    const { documents: userInfo } = useCollection2<UserType>(
        'usuarios',
        userQuery,
    );
    
    const { documents: carrinho } = useCollection2<CartInfoType>(
        'carrinhos',
        userQuery, 
    );

    const { documents: pedidos } = useCollection2<OrderType>(
        'pedidos', 
        userQuery, 
    );

    return (
        <UserInfoContext.Provider value={ { carrinho: carrinho, userInfo: userInfo ? userInfo[0] : null, pedidos: pedidos }  }>
            { children }
        </UserInfoContext.Provider>
    );
}