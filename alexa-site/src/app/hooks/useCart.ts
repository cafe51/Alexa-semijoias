// app/hooks/useCart.ts
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useCollection } from './useCollection';
import { ProductCartType, CartInfoType, ProductType } from '../utils/types';
import { DocumentData } from 'firebase/firestore';
import { useAuthContext } from './useAuthContext';
// import { useLocalStorage } from './useLocalStorage';

export const useCart = (cartInfos: (CartInfoType & DocumentData)[] | null, products: (ProductType & DocumentData)[] | null, setCartLocalStorageState: Dispatch<SetStateAction<CartInfoType[]>>) => {
    const { user } = useAuthContext();
    // const { fixQuantityByStockInLocalStorage } = useLocalStorage();


    const { updateDocumentField } = useCollection(
        'carrinhos',
    );
    const [mappedProducts, setProdutos] = useState<ProductCartType[] | null>(null);

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

    useEffect(() => {
        const fetchProducts = async() => {

            if (products && products.length > 0 && cartInfos) {
                const productsCart = products
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .map(({ categoria, desconto, descricao, image, lancamento, ...restProduct }) => {
                        const cartInfo = cartInfos.find((cart) => restProduct.id === cart.productId); 

                        if(!cartInfo) return undefined;
                        if(cartInfo) {
                            if (cartInfo.quantidade > restProduct.estoque) {
                                if(user) {
                                    updateDocumentField(cartInfo.id, 'quantidade', cartInfo.quantidade = restProduct.estoque);
                                } else {
                                    const fullProduct = { categoria, desconto, descricao, image, lancamento, ...restProduct };
                                    fixQuantityByStockInLocalStorage(fullProduct);
                                }
                            }
                            return {
                                ...restProduct,
                                image: image[0],
                                ...cartInfo,
                            };}
                        
                    }).filter(Boolean) as ProductCartType[];
                        
                setProdutos(productsCart);
            }
            // }
        };

        fetchProducts();
    }, [cartInfos, products, user]); // Mantém as dependências para garantir que o efeito seja executado quando necessário

    // console.log('AAAAA mappedProducts', mappedProducts);

    return { mappedProducts };
};