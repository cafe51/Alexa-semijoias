// app/context/UserInfoContext
'use client';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType, FilterOption, OrderType, ProductBundleType, ProductCartType, ProductVariation, UserType } from '../utils/types';
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
    
    const [productIds, setProductIds] = useState<string[] | null>(null);
    const [skuList, setSkuList] = useState<string[]>(['']);
    const [productVariationsState, setProductVariationsState] = useState<(ProductVariation & WithFieldValue<DocumentData>)[] | never[]>([]);

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

    const produtosDoCarrinhoQuery = useMemo<FilterOption[]>(() => 
        [{ field: '__name__', operator: 'in', value: productIds && productIds.length > 0 ? productIds : ['invalidId'] }],
    [productIds], // Só recriar a query quando 'productIds' mudar
    );

    const { documents: produtosDoCarrinho } = useSnapshot<ProductBundleType>(
        'products', 
        produtosDoCarrinhoQuery, 
    );

    // useEffect(() => {
    //     console.log('produtosDoCarrinho', produtosDoCarrinho);
    //     console.log('productIds', productIds);
    // },[produtosDoCarrinho, productIds]);

    // useEffect(() => {
    //     console.log('cartInfos', cartInfos);
    // },[cartInfos]);
    

    // useEffect(() => {
    //     console.log('productVariationsState', productVariationsState);
    // },[productVariationsState]);

    // useEffect(() => {
    //     console.log('skuList', skuList);
    // },[skuList]);

    useEffect(() => {
        if(produtosDoCarrinho) {
            const res = [];
            for(const produtoDoCarrinho of produtosDoCarrinho) {
                const prodVar = produtoDoCarrinho.productVariations.filter((prodv) => skuList.includes(prodv.sku));
                res.push(...prodVar);
            }
            setProductVariationsState(res);
        }

    }, [produtosDoCarrinho, skuList]);

    const { mappedProducts } = useCart(user ? cartInfos : cartLocalStorageState, productVariationsState, setCartLocalStorageState);
    // useCart(CartInfoType[], ProductType[], Dispatch<SetStateAction<CartInfoType[]>>)

    //montagem do carrinho
    useEffect(() => {
        // se o usuário estiver logado o carrinho é montado a partir do firebase
        if(user) {
            if (cartInfos && cartInfos) {
                const cartInfosCLone1 = [...cartInfos];
                const cartInfosCLone2 = [...cartInfos];
                const ids = cartInfosCLone1.map((info) => info.productId);
                const skus = cartInfosCLone2.map((info) => info.skuId);

                console.log('useEffect userInforContext.tsx cartInfos');
                setProductIds(Array.from(new Set(ids))); //remove valores repetidos
                setSkuList(skus);
            }
        } else {
        // se o usuário estiver deslogado o carrinho é montado a partir do localstorage
            if (cartLocalStorageState.length > 0) {
                const cartInfosCLone1 = [...cartLocalStorageState];
                const cartInfosCLone2 = [...cartLocalStorageState];
                const ids = cartInfosCLone1.map((info) => info.productId);
                const skus = cartInfosCLone2.map((info) => info.skuId);
                
                console.log('USER NÂO EXISTE!', ids);
                setProductIds(Array.from(new Set(ids))); //remove valores repetidos
                setSkuList(skus);
            }
        }
    }, [cartInfos, user, cartLocalStorageState]);

    return (
        <UserInfoContext.Provider value={ { carrinho: mappedProducts, userInfo: userInfo ? userInfo[0] : null, pedidos: pedidos, setCartLocalStorageState }  }>
            { children }
        </UserInfoContext.Provider>
    );
}