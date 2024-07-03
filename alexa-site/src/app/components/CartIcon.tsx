//app/components/CartIcon.tsx
'use client';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useUserInfo } from '../hooks/useUserInfo';
import { useEffect, useState } from 'react';

export default function CartIcon() {
    const carrinho = useUserInfo()?.carrinho;
    const [loadingIcon, setLoadingIcon] = useState(true);
    const [cartQuantity, setCartQuantity] = useState(0);

    useEffect(() => {
        if(carrinho) {
            setLoadingIcon(true);
            const quantity = carrinho.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0);
            setCartQuantity(quantity);
            setLoadingIcon(false);
        }
    }, [carrinho]);

    return (
        <Link className='relative' href={ '/carrinho' }><FiShoppingCart size={ 24 } data-testid='cartIcon'/>
            <span className="absolute bottom-3 right-0 left-6 flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full">
                {
                    // carrinho && carrinho.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0)
                    loadingIcon ? 'X' : cartQuantity
                }
                
            </span>
        </Link>
    );
}