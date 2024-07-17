// app/hooks/useLocalStorage.ts
import { CartInfoType, ProductCartType, ProductType } from '../utils/types';
import { useUserInfo } from './useUserInfo';

export const useLocalStorage = () => {
    const { setCartLocalStorageState } = useUserInfo();

    const getLocalCart = (): CartInfoType[] => {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    };

    const setLocalCart = (cart: CartInfoType[]) => {
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartLocalStorageState(cart);
    };

    const removeOneFromLocalStorage = (product: ProductCartType) => {
        const localCart = getLocalCart();
        const cartItem = localCart.find(item => item.productId === product.id);
        
        if (cartItem) {
            if (cartItem.quantidade > 1) {
                cartItem.quantidade -= 1;
            } else {
                const index = localCart.indexOf(cartItem);
                localCart.splice(index, 1);
            }
        }

        setLocalCart(localCart);
        console.warn('Produto removido ou quantidade subtraída do carrinho localStorage.');
    };

    const fixQuantityByStockInLocalStorage = (product: ProductType) => {
        const localCart = getLocalCart();
        const cartItem = localCart.find(item => item.productId === product.id);
        
        if (cartItem && cartItem.quantidade > product.estoque) {
            cartItem.quantidade = product.estoque;
        }

        setLocalCart(localCart);
        console.warn(`Quantidade do produto ${product.id} no carrinho corrigida.`);
    };

    const addOneToLocalStorage = (product: ProductCartType) => {
        const localCart = getLocalCart();
        const cartItem = localCart.find(item => item.productId === product.id);
        
        if (cartItem && cartItem.quantidade < product.estoque) {
            cartItem.quantidade += 1;
        }

        setLocalCart(localCart);
        console.warn('Produto somado ao carrinho localStorage.');
    };

    const addItemToLocalStorageCart = (product: ProductType) => {
        const localCart = getLocalCart();
        const cartItem = localCart.find(item => item.productId === product.id);
        
        if (!cartItem) {
            localCart.push({
                productId: product.id,
                quantidade: 1,
                userId: 'guest',
            });
        } else if (cartItem.quantidade < product.estoque) {
            cartItem.quantidade += 1;
        }

        setLocalCart(localCart);
        console.warn('Produto adicionado ao carrinho localStorage.');
    };

    const removeItemFromLocalStorageCart = (productId: string) => {
        const localCart = getLocalCart();
        const updatedCart = localCart.filter(item => item.productId !== productId);

        setLocalCart(updatedCart);
        console.warn('Produto removido do carrinho localStorage.');
    };

    return {
        addItemToLocalStorageCart,
        removeItemFromLocalStorageCart,
        addOneToLocalStorage,
        removeOneFromLocalStorage,
        fixQuantityByStockInLocalStorage,
        getLocalCart,
        setLocalCart,
    };
};
