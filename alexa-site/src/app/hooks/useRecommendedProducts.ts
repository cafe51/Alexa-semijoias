// src/app/hooks/useRecommendedProducts.ts
import { useState, useEffect } from 'react';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';

export const useRecommendedProducts = (mainProductId: string) => {
    const [recommendedProducts, setRecommendedProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecommendedProducts() {
            try {
                const res = await fetch(`/api/recommended-products?mainProductId=${mainProductId}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Error fetching recommended products');
                } else {
                    setRecommendedProducts(data.recommendedProducts);
                }
            } catch (err) {
                console.error(err);
                setError('Error fetching recommended products');
            } finally {
                setLoading(false);
            }
        }
        fetchRecommendedProducts();
    }, [mainProductId]);

    return { recommendedProducts, loading, error };
};
