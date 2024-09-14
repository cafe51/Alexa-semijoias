'use client';

import { useEffect, useState } from 'react';
import { CartInfoType, ProductCartType, ProductVariation } from '../utils/types';
import { useUserInfo } from './useUserInfo';

export const useLocalStorage = () => {
    const { setCartLocalStorageState } = useUserInfo();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getLocalCart = (): CartInfoType[] => {
        if (isClient) {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        }
        return [];
    };

    const setLocalCart = (cart: CartInfoType[]) => {
        if (isClient) {
            localStorage.setItem('cart', JSON.stringify(cart));
            setCartLocalStorageState(cart);
        }
    };

    const removeOneFromLocalStorage = (product: ProductCartType) => {
        if (isClient) {
            const localCart = getLocalCart();
            const cartItem = localCart.find(item => item.skuId === product.skuId);
            
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
        }
    };

    const fixQuantityByStockInLocalStorage = (productVariation: ProductVariation) => {
        if (isClient) {
            const localCart = getLocalCart();
            const cartItem = localCart.find(item => item.skuId === productVariation.sku);
            
            if (cartItem && cartItem.quantidade > productVariation.estoque) {
                cartItem.quantidade = productVariation.estoque;
            }

            setLocalCart(localCart);
            console.warn(`Quantidade do produto ${productVariation.sku} no carrinho corrigida.`);
        }
    };

    const addOneToLocalStorage = (product: ProductCartType) => {
        if (isClient) {
            const localCart = getLocalCart();
            const cartItem = localCart.find(item => item.skuId === product.skuId);
            
            if (cartItem && cartItem.quantidade < product.estoque) {
                cartItem.quantidade += 1;
            }

            setLocalCart(localCart);
            console.warn('Produto somado ao carrinho localStorage.');
        }
    };

    const addItemToLocalStorageCart = (productVariation: ProductVariation, quantity: number) => {
        if (isClient) {
            const localCart = getLocalCart();
            const cartItem = localCart.find(item => item.skuId === productVariation.sku);
            
            if (!cartItem) {
                localCart.push({
                    skuId: productVariation.sku,
                    productId: productVariation.productId,
                    quantidade: quantity,
                    userId: 'guest',
                });
            } else if (cartItem.quantidade < productVariation.estoque) {
                cartItem.quantidade += quantity;
            }

            setLocalCart(localCart);
            console.warn('Produto adicionado ao carrinho localStorage.');
        }
    };

    const removeItemFromLocalStorageCart = (sku: string) => {
        if (isClient) {
            const localCart = getLocalCart();
            const updatedCart = localCart.filter(item => item.skuId !== sku);

            setLocalCart(updatedCart);
            console.warn('Produto removido do carrinho localStorage.');
        }
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
