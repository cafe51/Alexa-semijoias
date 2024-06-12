import { useEffect, useState } from 'react';
import { useCollection } from './useCollection';

export const useCart = (productIds : any, carrinho: any) => {
    const { getAllDocuments } = useCollection('produtos', null);

    const [mappedProducts, setProdutos] = useState<any>(null);

    useEffect(() => {
        const fetchProducts = async() => {
            const products = await getAllDocuments([{ field: 'id', operator: 'in', value: productIds && productIds.length > 0 ? productIds : ['invalidId'] }]);
            console.log('PRODUTOS', products);
            if (products && products.length > 0 && carrinho) {
                setProdutos(products.map((product: any) => {   
                    if(carrinho.find((cart: any) => product.id === cart.productId)) {
                        return {
                            ...product,
                            // ...carrinho[index],
                            ...carrinho.find((cart: any) => product.id === cart.productId),
                        };
                    } else {
                        return false;
                    }
                },
                ));
            }
        };
        fetchProducts();
    }, [carrinho, productIds]);

    return { mappedProducts };
};