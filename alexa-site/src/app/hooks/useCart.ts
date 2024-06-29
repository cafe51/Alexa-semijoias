// app/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useCollection } from './useCollection';
import { ProductCartType, CartInfoType, ProductType } from '../utils/types';
import { DocumentData } from 'firebase/firestore';

export const useCart = (productIds : string[], carrinho: (CartInfoType & DocumentData)[] | null) => {
    const { updateDocumentField } = useCollection(
        'carrinhos',
    );
    const { getAllDocuments } = useCollection<ProductType>('produtos');

    const [mappedProducts, setProdutos] = useState<ProductCartType[] | null>(null);

    useEffect(() => {
        const fetchProducts = async() => {
            if (productIds && carrinho) { // Verifica se productIds e carrinho são truthy
                const products = await getAllDocuments([{ field: 'id', operator: 'in', value: productIds && productIds.length > 0 ? productIds : ['invalidId'] }]);

                if (products && products.length > 0) {
                    const productsCart = products
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .map(({ categoria, desconto, descricao, image, lancamento, ...restProduct }) => {
                            const cartInfo = carrinho.find((cart) => restProduct.id === cart.productId); 

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
                            // return cartInfo ? { ...restProduct, image: image[0], ...cartInfo } : undefined;
                        
                        }).filter(Boolean) as ProductCartType[];
                        
                    setProdutos(productsCart);
                }
            }
        };

        fetchProducts();
    }, [carrinho, productIds]); // Mantém as dependências para garantir que o efeito seja executado quando necessário

    console.log('AAAAA mappedProducts', mappedProducts);

    return { mappedProducts };
};