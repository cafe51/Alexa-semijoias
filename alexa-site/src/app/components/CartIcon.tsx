import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';




export default function CartIcon() {
    const [cartQuantity, setCartQuantity] = useState(0);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            try {
                user.carrinho ? setCartQuantity(user.carrinho.length) : setCartQuantity(0);
            } catch (e) {
                console.error('Invalid JSON in localStorage:', e);
            }
        } else {
            setCartQuantity(0);
        }
    }, [router, user]);
    return (
        <Link className='relative' href={ '/carrinho' }><FiShoppingCart size={ 24 }/>
            <span className="absolute bottom-3 right-0 left-6 flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full">
                { cartQuantity }
            </span>
        </Link>
    );
}