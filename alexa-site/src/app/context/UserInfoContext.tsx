// app/context/UserInfoContext
'use client';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType, FilterOptionForUseSnapshot, FireBaseDocument, ProductBundleType, ProductCartType, ProductVariation, UserType } from '../utils/types';
import { useSnapshot } from '../hooks/useSnapshot';
import { useCart } from '../hooks/useCart';
import { useMultiSnapshot } from '../hooks/useMultiSnapshot';

interface IUserInfoContext {
    carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null;
    userInfo: (UserType & FireBaseDocument) | null;
    // pedidos: (OrderType & FireBaseDocument)[] | null;
    setCartLocalStorageState: Dispatch<SetStateAction<CartInfoType[]>>;
}
export const UserInfoContext = createContext<IUserInfoContext | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
    const [cartLocalStorageState, setCartLocalStorageState] = useState<CartInfoType[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCartLocalStorageState(JSON.parse(localStorage.getItem('cart') || '[]'));
        }
    }, []);

    const [productIds, setProductIds] = useState<string[] | null>(null);
    const [skuList, setSkuList] = useState<string[]>(['']);
    const [productVariationsState, setProductVariationsState] = useState<(ProductVariation)[] | never[]>([]);

    const { user } = useAuthContext();

    const filterOptionsArrays = useMemo(() => {
        if (!productIds || productIds.length === 0) {
            return [[{ field: '__name__', operator: 'in', value: ['invalidId'] }]];
        }
        const chunks = [];
        for (let i = 0; i < productIds.length; i += 30) {
            chunks.push([{ field: '__name__', operator: 'in', value: productIds.slice(i, i + 30) }]);
        }
        return chunks;
    }, [productIds]);
    
    const userQuery = useMemo<FilterOptionForUseSnapshot[]>(() => 
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

    const { documents: produtosDoCarrinho } = useMultiSnapshot<ProductBundleType>('products', filterOptionsArrays);


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

    //montagem do carrinho
    useEffect(() => {
        const mountCart = () => {
            if (user) {
                if (cartInfos && cartInfos.length > 0) {
                    const ids = cartInfos.map((info) => info.productId);
                    const skus = cartInfos.map((info) => info.skuId);

                    console.log('useEffect userInforContext.tsx cartInfos');
                    setProductIds(Array.from(new Set(ids))); //remove valores repetidos
                    setSkuList(skus);
                }
            } else {
                if (cartLocalStorageState.length > 0) {
                    const ids = cartLocalStorageState.map((info) => info.productId);
                    const skus = cartLocalStorageState.map((info) => info.skuId);
                    
                    console.log('USER NÃO EXISTE!', ids);
                    setProductIds(Array.from(new Set(ids))); //remove valores repetidos
                    setSkuList(skus);
                }
            }
        };

        if (typeof window !== 'undefined') {
            mountCart();
        }
    }, [cartInfos, user, cartLocalStorageState]);

    return (
        <UserInfoContext.Provider value={ {
            carrinho: mappedProducts,
            userInfo: userInfo ? userInfo[0] : null,
            // pedidos: pedidos,
            setCartLocalStorageState,
        }  }>
            { children }
        </UserInfoContext.Provider>
    );
}