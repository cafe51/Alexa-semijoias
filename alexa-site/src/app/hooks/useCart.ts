// app/hooks/useCart.ts
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useCollection } from './useCollection';
import { ProductCartType, CartInfoType, ProductVariation } from '../utils/types';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import { useAuthContext } from './useAuthContext';
// import { useLocalStorage } from './useLocalStorage';

export const useCart = (
    cartInfos: (CartInfoType & WithFieldValue<DocumentData>)[] | null,
    productVariations: (ProductVariation)[] | null,
    setCartLocalStorageState: Dispatch<SetStateAction<CartInfoType[]>>,
) => {
    const { user } = useAuthContext();
    // const { fixQuantityByStockInLocalStorage } = useLocalStorage();

    const { updateDocumentField, deleteDocument } = useCollection(
        'carrinhos',
    );
    const [mappedProducts, setMappedProducts] = useState<(ProductCartType & WithFieldValue<DocumentData>)[] | null>(null);

    const fixQuantityByStockInLocalStorage = (productVariation: ProductVariation) => {
        // eslint-disable-next-line prefer-const
        let localCart: CartInfoType[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = localCart.find((item) => item.skuId === productVariation.sku);
        
        if (cartItem && cartItem.quantidade > productVariation.estoque) {
            cartItem.quantidade = productVariation.estoque;
        }

        if (cartItem && cartItem.quantidade < 1) {
            localCart = localCart.filter((element) => element != cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.warn('Quantidade do produto do produto', productVariation.sku ,' do carrinho corrigida.');
        setCartLocalStorageState(JSON.parse(localStorage.getItem('cart') || '[]'));
        return;
    };

    const fixQuantityByStockInFirebase = (cartInfo: CartInfoType & WithFieldValue<DocumentData>, product: ProductVariation) => {
        if(cartInfo.quantidade > product.estoque) {
            updateDocumentField(cartInfo.id, 'quantidade', cartInfo.quantidade = product.estoque);
        }
        if (cartInfo.quantidade < 1) {
            deleteDocument(cartInfo.id);
        }
    };

    useEffect(() => {
        const fetchProducts = async() => {

            if (productVariations && productVariations.length > 0 && cartInfos) {
                // console.log('productVariations', 'AAAAAAAAAAA', productVariations);
                const productsCart = productVariations
                    .map((productVariation) => {
                        const cartInfo = cartInfos.find((cart) => productVariation.sku === cart.skuId); 

                        if(!cartInfo) return undefined;
                        if(cartInfo) {
                            if ((cartInfo.quantidade > productVariation.estoque) || cartInfo.quantidade < 1) {
                                if(user) {
                                    fixQuantityByStockInFirebase(cartInfo, productVariation);
                                }
                                else {
                                    fixQuantityByStockInLocalStorage(productVariation);
                                }
                            }
                            return {
                                ...productVariation,
                                ...cartInfo,
                            };}
                        
                    }).filter(Boolean) as ProductCartType[];
                        
                setMappedProducts(productsCart);
            }
            // }
        };

        fetchProducts();
    }, [cartInfos, productVariations, user]); // Mantém as dependências para garantir que o efeito seja executado quando necessário

    // console.log('AAAAA mappedProducts', mappedProducts);

    return { mappedProducts };
};