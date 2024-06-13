// app/carrinho/page.tsx
'use client';

import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import CartItemsSection from './CartItemsSection';

export default function Carrinho() {
    // const [isLoading, setIsLoading] = useState<any>(true);
    const [productIds, setProductIds] = useState<string[] | null>(null);

    const { user } = useAuthContext();


    useEffect(() => {
        if (user && user.carrinho) {
            const ids = user.carrinho.map((info) => info.productId);
            setProductIds(ids);
        }
    }, [user]);

    return (
        productIds && user && user.carrinho ? <CartItemsSection productIds={ productIds } carrinho={ user.carrinho } /> : <p>Loading...</p>
    );
}