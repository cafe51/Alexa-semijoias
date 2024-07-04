// app/hooks/useLocalStorage.ts
import { CartInfoType, ProductCartType, ProductType } from '../utils/types';
import { useUserInfo } from './useUserInfo';

export const useLocalStorage = () => {
    const { setCartLocalStorageState } = useUserInfo();

    const removeOneToLocalStorage = (product: ProductCartType) => {
        // eslint-disable-next-line prefer-const
        let localCart: CartInfoType[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = localCart.find((item) => item.productId === product.id);
        
        if (cartItem && cartItem.quantidade >= 2) {
            cartItem.quantidade -= 1;
        }
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.warn('Produto subtraído ao carrinho localStorage.');
        setCartLocalStorageState(JSON.parse(localStorage.getItem('cart') || '[]'));
        return;
    };

    const fixQuantityByStockInLocalStorage = (product: ProductType) => {
        // eslint-disable-next-line prefer-const
        let localCart: CartInfoType[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = localCart.find((item) => item.productId === product.id);
        
        if (cartItem && cartItem.quantidade > product.estoque) {
            cartItem.quantidade = product.estoque;
        }
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.warn('Quantidade do produto do produto', product.id ,' do carrinho corrigida.');
        setCartLocalStorageState(JSON.parse(localStorage.getItem('cart') || '[]'));
        return;
    };

    const addOneToLocalStorage = (product: ProductCartType) => {
        // eslint-disable-next-line prefer-const
        let localCart: CartInfoType[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = localCart.find((item) => item.productId === product.id);
        
        if (cartItem && cartItem.quantidade < product.estoque) {
            cartItem.quantidade += 1;
        }
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.warn('Produto somado ao carrinho localStorage.');
        setCartLocalStorageState(JSON.parse(localStorage.getItem('cart') || '[]'));
        return;
    };

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
        setCartLocalStorageState(JSON.parse(localStorage.getItem('cart') || '[]'));
        return;
    };

    const removeItemFromLocalStorageCart = (productId: string) => {
        return productId;
    };




    return {
        addItemToLocalStorageCart,
        removeItemFromLocalStorageCart,
        addOneToLocalStorage,
        removeOneToLocalStorage,
        fixQuantityByStockInLocalStorage,
    };
};
