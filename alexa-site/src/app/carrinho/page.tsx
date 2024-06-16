// app/carrinho/page.tsx
'use client';

import { useEffect, useState } from 'react';
import CartItemsSection from './CartItemsSection';
import { useUserInfo } from '../hooks/useUserInfo';

export default function Carrinho() {
    const [productIds, setProductIds] = useState<string[] | null>(null);


    const  carrinho = useUserInfo()?.carrinho;


    useEffect(() => {
        if (carrinho && carrinho) {
            const ids = carrinho.map((info) => info.productId);
            setProductIds(ids);
        }
    }, [carrinho]);

    return (
        productIds && carrinho ? <CartItemsSection productIds={ productIds } carrinho={ carrinho } /> : <p>Loading...</p>
    );
}