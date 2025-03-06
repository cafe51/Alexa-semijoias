// src/app/admin/carrinhos/useProduct.ts
import { useState, useEffect } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';

// Cache simples para evitar buscas repetidas
export const productCache: { [key: string]: (ProductBundleType & FireBaseDocument) } = {};

export function useProduct(productId: string) {
    const [product, setProduct] = useState<ProductBundleType & FireBaseDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { getDocumentById } = useCollection<ProductBundleType>('products');

    useEffect(() => {
        let isMounted = true;
        const fetchProduct = async() => {
            if (productCache[productId]) {
                setProduct(productCache[productId]);
                setLoading(false);
            } else {
                setLoading(true);
                try {
                    const prod = await getDocumentById(productId);
                    if (isMounted) {
                        productCache[productId] = prod;
                        setProduct(prod);
                    }
                } catch (err) {
                    if (isMounted) setError(err as Error);
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
        };

        fetchProduct();
        return () => { isMounted = false; };
    }, [productId, getDocumentById]);

    return { product, loading, error };
}
