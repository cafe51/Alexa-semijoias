import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useAuthContext } from '../hooks/useAuthContext';

export default function CartIcon() {
    const { user } = useAuthContext();

    return (
        <Link className='relative' href={ '/carrinho' }><FiShoppingCart size={ 24 }/>
            <span className="absolute bottom-3 right-0 left-6 flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full">
                {
                    user && user.carrinho && user.carrinho.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0)
                }
                
            </span>
        </Link>
    );
}