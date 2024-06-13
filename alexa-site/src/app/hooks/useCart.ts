import { useEffect, useState } from 'react';
import { useCollection } from './useCollection';
import { ProductCartType, CartInfoType } from '../utils/types';

export const useCart = (productIds : string[], carrinho: CartInfoType[] | null) => {
    const { getAllDocuments } = useCollection<ProductCartType>('produtos', null);

    const [mappedProducts, setProdutos] = useState<ProductCartType[] | null>(null);

    useEffect(() => {
        const fetchProducts = async() => {
            const products = await getAllDocuments([{ field: 'id', operator: 'in', value: productIds && productIds.length > 0 ? productIds : ['invalidId'] }]);
            console.log('PRODUTOS', products);
            if (products && products.length > 0 && carrinho) {
                const productsCart = products
                    .map((productCart) => {
                        const cartInfo = carrinho.find((cart) => productCart.id === cart.productId); 
                        return cartInfo ? { ...productCart, ...cartInfo } : undefined;
                    
                    }).filter(Boolean) as ProductCartType[];
                    
                setProdutos(productsCart);
            }
        };
        fetchProducts();
    }, [carrinho, productIds]);

    return { mappedProducts };
};