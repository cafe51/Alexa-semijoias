// app/carrinho/page.tsx
'use client';

import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import CartItemsSection from './CartItemsSection';

export default function Carrinho() {
    const [productIds, setProductIds] = useState<string[] | null>(null);

    const { user } = useAuthContext();


    useEffect(() => {
        if (user && user.carrinho) {
            const ids = user.carrinho.map((info: any) => info.productId);
            setProductIds(ids);
        }
    }, [user]);

    return (
        productIds ? <CartItemsSection productIds={ productIds } carrinho={ user.carrinho } /> : <p>Loading...</p>
    );
}