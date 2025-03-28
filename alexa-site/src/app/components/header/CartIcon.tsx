//app/components/CartIcon.tsx
'use client';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useEffect, useState } from 'react';
// import { Badge } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';

export default function CartIcon({ isMobile, buttonSize }: {isMobile: boolean, buttonSize: number}) {
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
        setLoadingIcon(false);
    }, [carrinho]);

    return (
        <Link
            className='relative flex text-[#C48B9F]'
            href={ '/carrinho' }
            title='Carrinho de compras'
            aria-label='Carrinho de compras'
        >
            <FiShoppingCart size={ buttonSize } data-testid='cartIcon'/>
            <span className={ `flex items-center justify-center text-white bg-[#C48B9F] rounded-full ${ isMobile ?'absolute -top-1 -right-4 w-5 h-5 text-xs' : 'w-7 h-7 text-lg'} ${ loadingIcon ? 'animate-spin' : ''}` }>
                {
                // carrinho && carrinho.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0)
                    loadingIcon ? <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div> : cartQuantity
                }
                
            </span>
        </Link>
    );
}