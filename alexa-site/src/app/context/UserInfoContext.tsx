// app/context/UserInfoContext
'use client';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType, FilterOption, OrderType, ProductCartType, ProductType, UserType } from '../utils/types';
import { useSnapshot } from '../hooks/useSnapshot';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import { useCart } from '../hooks/useCart';

interface IUserInfoContext {
    carrinho: (ProductCartType)[] | null;
    userInfo: (UserType & WithFieldValue<DocumentData>) | null;
    pedidos: (OrderType & WithFieldValue<DocumentData>)[] | null;
    setCartLocalStorageState: Dispatch<SetStateAction<CartInfoType[]>>;
}
export const UserInfoContext = createContext<IUserInfoContext | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
    const [cartLocalStorageState, setCartLocalStorageState] = useState<CartInfoType[]>(
        JSON.parse(localStorage.getItem('cart') || '[]'), // Inicializa com o valor atual
    );
    
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

    const { mappedProducts } = useCart(user ? cartInfos : cartLocalStorageState, pedidosDoCarrinho, setCartLocalStorageState);

    //montagem do carrinho
    useEffect(() => {
        // se o usuário estiver logado o carrinho é montado a partir do firebase
        if(user) {
            if (cartInfos && cartInfos) {
                const ids = cartInfos.map((info) => info.productId);
                console.log('useEffect userInforContext.tsx');
                setProductIds(ids);
            }
        } else {
        // se o usuário estiver deslogado o carrinho é montado a partir do localstorage
            if (cartLocalStorageState.length > 0) {
                const ids = cartLocalStorageState.map((item) => item.productId);
                console.log('USER NÂO EXISTE!', ids);
                setProductIds(ids);
            }
        }
    }, [cartInfos, user, cartLocalStorageState]);

    return (
        <UserInfoContext.Provider value={ { carrinho: mappedProducts, userInfo: userInfo ? userInfo[0] : null, pedidos: pedidos, setCartLocalStorageState }  }>
            { children }
        </UserInfoContext.Provider>
    );
}