import { useCallback, useEffect, useState } from 'react';
import { FireBaseDocument, ProductBundleType } from '../utils/types';
import { useCollection } from './useCollection';
import { orderBy, where, QueryConstraint, limit } from 'firebase/firestore';

const ITEMS_PER_PAGE = 6;

export const useRecommendedProducts = (mainProductId: string) => {
    const [recommendedProducts, setRecommendedProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getDocumentById, getDocumentsWithConstraints } = useCollection<ProductBundleType>('products');

    const getProductBySubsection = useCallback(async(
        mainProduct: ProductBundleType & FireBaseDocument,
        excludeIds: string[],
    ): Promise<(ProductBundleType & FireBaseDocument) | null> => {
        if (!mainProduct.subsections?.length) return null;

        for (const subsection of mainProduct.subsections) {
            const constraints: QueryConstraint[] = [
                where('subsections', 'array-contains', subsection),
                where('showProduct', '==', true),
                where('estoqueTotal', '>', 0),
                orderBy('creationDate', 'desc'),
                limit(1),
            ];

            if (excludeIds.length > 0) {
                constraints.unshift(where('__name__', 'not-in', excludeIds));
            }

            const products = await getDocumentsWithConstraints(constraints);
            if (products.length > 0) return products[0];
        }

        return null;
    }, [getDocumentsWithConstraints]);

    const getProductBySection = useCallback(async(
        mainProduct: ProductBundleType & FireBaseDocument,
        excludeIds: string[],
    ): Promise<(ProductBundleType & FireBaseDocument) | null> => {
        if (!mainProduct.sections?.length) return null;

        for (const section of mainProduct.sections) {
            const constraints: QueryConstraint[] = [
                where('sections', 'array-contains', section),
                where('showProduct', '==', true),
                where('estoqueTotal', '>', 0),
                orderBy('creationDate', 'desc'),
                limit(1),
            ];

            if (excludeIds.length > 0) {
                constraints.unshift(where('__name__', 'not-in', excludeIds));
            }

            const products = await getDocumentsWithConstraints(constraints);
            if (products.length > 0) return products[0];
        }

        return null;
    }, [getDocumentsWithConstraints]);

    const getProductsByCategories = useCallback(async(
        mainProduct: ProductBundleType & FireBaseDocument,
        excludeIds: string[],
        maxProducts: number,
    ): Promise<(ProductBundleType & FireBaseDocument)[]> => {
        const result: (ProductBundleType & FireBaseDocument)[] = [];

        if (!mainProduct.categories?.length) return result;

        for (const category of mainProduct.categories) {
            if (result.length >= maxProducts) break;

            const constraints: QueryConstraint[] = [
                where('categories', 'array-contains', category),
                where('showProduct', '==', true),
                where('estoqueTotal', '>', 0),
                orderBy('creationDate', 'desc'),
                limit(1),
            ];

            if (excludeIds.length > 0) {
                constraints.unshift(where('__name__', 'not-in', [...excludeIds, ...result.map(p => p.id)]));
            }

            const products = await getDocumentsWithConstraints(constraints);
            if (products.length > 0) {
                result.push(products[0]);
            }
        }

        return result;
    }, [getDocumentsWithConstraints]);

    const getRemainingProducts = useCallback(async(
        excludeIds: string[],
        count: number,
    ): Promise<(ProductBundleType & FireBaseDocument)[]> => {
        if (count <= 0) return [];

        const constraints: QueryConstraint[] = [
            where('showProduct', '==', true),
            where('estoqueTotal', '>', 0),
            orderBy('creationDate', 'desc'),
            limit(count),
        ];

        if (excludeIds.length > 0) {
            constraints.unshift(where('__name__', 'not-in', excludeIds));
        }

        return getDocumentsWithConstraints(constraints);
    }, [getDocumentsWithConstraints]);

    useEffect(() => {
        const fetchRecommendedProducts = async() => {
            try {
                setLoading(true);
                const excludeIds = [mainProductId];
                const recommendedList: (ProductBundleType & FireBaseDocument)[] = [];

                // Busca o produto principal
                const mainProduct = await getDocumentById(mainProductId);
                if (!mainProduct.exist) {
                    throw new Error('Produto principal não encontrado');
                }

                // 1. Tenta encontrar produto pela subseção
                const productBySubsection = await getProductBySubsection(mainProduct, excludeIds);
                if (productBySubsection) {
                    recommendedList.push(productBySubsection);
                    excludeIds.push(productBySubsection.id);
                }

                // 2. Se não encontrou pela subseção, tenta pela seção
                if (!productBySubsection) {
                    const productBySection = await getProductBySection(mainProduct, excludeIds);
                    if (productBySection) {
                        recommendedList.push(productBySection);
                        excludeIds.push(productBySection.id);
                    }
                }

                // 3. Busca produtos por categorias
                const remainingCount = ITEMS_PER_PAGE - recommendedList.length;
                const productsByCategories = await getProductsByCategories(
                    mainProduct,
                    excludeIds,
                    remainingCount,
                );
                
                recommendedList.push(...productsByCategories);
                excludeIds.push(...productsByCategories.map(p => p.id));

                // 4. Se ainda faltam produtos, busca os mais recentes
                const finalRemainingCount = ITEMS_PER_PAGE - recommendedList.length;
                if (finalRemainingCount > 0) {
                    const remainingProducts = await getRemainingProducts(
                        excludeIds,
                        finalRemainingCount,
                    );
                    recommendedList.push(...remainingProducts);
                }

                setRecommendedProducts(recommendedList);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar produtos recomendados:', err);
                setError('Falha ao carregar os produtos recomendados. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedProducts();
    }, [mainProductId, getDocumentById, getProductBySubsection, getProductBySection, getProductsByCategories, getRemainingProducts]);

    return { recommendedProducts, loading, error };
};
