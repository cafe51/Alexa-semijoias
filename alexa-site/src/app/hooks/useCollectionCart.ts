// app/hooks/useCollections.ts

import { useCollection } from './useCollection';
import { useState, useEffect } from 'react';


export const useCollectionCart = (cartInfos: { productId: string, quantidade: number }[] | null | any) => {
    const [produtos, setProdutos] = useState<any[]>([]);
    // const cartInfosRef = useRef(cartInfos);
  
    const { documents } = useCollection(
        'produtos',
        [{ field: 'id', operator: 'in', value: cartInfos && cartInfos.length > 0 ? cartInfos : ['invalidId'] }],

    );
  
    useEffect(() => {
        if (documents) {
            setProdutos(documents);
        }
  
    }, [cartInfos, documents]);
 
    return {  produtos };

};