// app/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useCollection } from './useCollection';
import { ProductCartType, CartInfoType, ProductType } from '../utils/types';
import { DocumentData } from 'firebase/firestore';

export const useCart = (cartInfos: (CartInfoType & DocumentData)[] | null, products: (ProductType & DocumentData)[] | null) => {
    const { updateDocumentField } = useCollection(
        'carrinhos',
    );
    const [mappedProducts, setProdutos] = useState<ProductCartType[] | null>(null);

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
                                updateDocumentField(cartInfo.id, 'quantidade', cartInfo.quantidade = restProduct.estoque);
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
    }, [cartInfos, products]); // Mantém as dependências para garantir que o efeito seja executado quando necessário

    // console.log('AAAAA mappedProducts', mappedProducts);

    return { mappedProducts };
};