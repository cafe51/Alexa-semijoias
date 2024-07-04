// app/hooks/useChangeCart.ts
import { useState } from 'react';
import { CartInfoType, ProductType } from '../utils/types';
import { useCollection } from './useCollection';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';

export const useLocalStorage = () => {
    const { addDocument, updateDocumentField } = useCollection<CartInfoType>('carrinhos');
    const [cart, setCart] = useState<CartInfoType[]>([]);

    // useEffect(() => {
    //     const storedCart = localStorage.getItem('cart');
    //     if (storedCart) {
    //         setCart(JSON.parse(storedCart));
    //     }
    // }, []);

    const addItemToLocalStorageCart = (product: ProductType) => {
        // eslint-disable-next-line prefer-const
        let localCart: CartInfoType[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = localCart.find((item) => item.productId === product.id);
        
        if (!cartItem) {
            localCart.push({
                productId: product.id,
                quantidade: 1,
                userId: 'guest',
            });
        } else if (cartItem.quantidade < product.estoque) {
            cartItem.quantidade += 1;
        }
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.warn('Produto adicionado ao carrinho localStorage.');
        return;
    };

    const removeItemFromLocalStorageCart = (productId: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((cartItem) => cartItem.productId !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const addItemToCart = (user: User, carrinho: (CartInfoType & DocumentData)[] | null, product: ProductType) => {
        const cartItem = carrinho?.find((item) => item.productId === product.id);
        if (!cartItem) {
            addDocument({
                productId: product.id,
                quantidade: 1,
                userId: user.uid,
            });
        } else if (cartItem.quantidade < product.estoque) {
            updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade += 1);
        }
    };



    return {
        cart,
        addItemToLocalStorageCart,
        removeItemFromLocalStorageCart,
        addItemToCart,
    };
};
