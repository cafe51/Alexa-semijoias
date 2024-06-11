import { useMemo } from 'react';
import { useCollection } from './useCollection';

export const useCart = (productIds : any, carrinho: any) => {
    const { documents: produtos } = useCollection(
        'produtos',
        [{ field: 'id', operator: 'in', value: productIds && productIds.length > 0 ? productIds : ['invalidId'] }],
    );

    const mappedProducts = useMemo(() => {
        if (produtos && carrinho) {
            return produtos.map((product, index) => ({ ...product, ...carrinho[index] }));
        }
        return null;
    }, [produtos, carrinho]);

    return { mappedProducts };
};