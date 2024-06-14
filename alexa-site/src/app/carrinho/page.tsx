// app/carrinho/page.tsx
'use client';

// import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import CartItemsSection from './CartItemsSection';
import { useUserInfo } from '../hooks/useUserInfo';

export default function Carrinho() {
    // const [isLoading, setIsLoading] = useState<any>(true);
    const [productIds, setProductIds] = useState<string[] | null>(null);

    // const { user } = useAuthContext();


    // useEffect(() => {
    //     if (user && user.carrinho) {
    //         const ids = user.carrinho.map((info) => info.productId);
    //         setProductIds(ids);
    //     }
    // }, [user]);

    const { carrinho } = useUserInfo();


    useEffect(() => {
        if (carrinho && carrinho) {
            const ids = carrinho.map((info: any) => info.productId);
            setProductIds(ids);
        }
    }, [carrinho]);

    return (
        productIds && carrinho ? <CartItemsSection productIds={ productIds } carrinho={ carrinho } /> : <p>Loading...</p>
    );
}