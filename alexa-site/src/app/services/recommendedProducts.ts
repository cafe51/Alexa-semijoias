// src/app/server/recommendedProducts.ts
import { adminDb } from '@/app/firebase/admin-config';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { serializeData } from '../utils/serializeData';

const ITEMS_PER_PAGE = 6;

async function getProductById(id: string): Promise<(ProductBundleType & FireBaseDocument) | null> {
    const doc = await adminDb.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...serializeData(doc.data()), exist: doc.exists } as ProductBundleType & FireBaseDocument;
}

async function getProductBySubsection(
    mainProduct: ProductBundleType & FireBaseDocument,
    excludeIds: string[],
): Promise<(ProductBundleType & FireBaseDocument) | null> {
    if (!mainProduct.subsections || mainProduct.subsections.length === 0) return null;
    for (const subsection of mainProduct.subsections) {
        let queryRef = adminDb
            .collection('products')
            .where('subsections', 'array-contains', subsection)
            .where('showProduct', '==', true)
            .where('estoqueTotal', '>', 0)
            .orderBy('creationDate', 'desc')
            .limit(1);
        if (excludeIds.length > 0) {
            queryRef = queryRef.where('__name__', 'not-in', excludeIds);
        }
        const snapshot = await queryRef.get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...serializeData(doc.data()), exist: doc.exists } as ProductBundleType & FireBaseDocument;
        }
    }
    return null;
}

async function getProductBySection(
    mainProduct: ProductBundleType & FireBaseDocument,
    excludeIds: string[],
): Promise<(ProductBundleType & FireBaseDocument) | null> {
    if (!mainProduct.sections || mainProduct.sections.length === 0) return null;
    for (const section of mainProduct.sections) {
        let queryRef = adminDb
            .collection('products')
            .where('sections', 'array-contains', section)
            .where('showProduct', '==', true)
            .where('estoqueTotal', '>', 0)
            .orderBy('creationDate', 'desc')
            .limit(1);
        if (excludeIds.length > 0) {
            queryRef = queryRef.where('__name__', 'not-in', excludeIds);
        }
        const snapshot = await queryRef.get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...serializeData(doc.data()), exist: doc.exists } as ProductBundleType & FireBaseDocument;
        }
    }
    return null;
}

async function getProductsByCategories(
    mainProduct: ProductBundleType & FireBaseDocument,
    excludeIds: string[],
    maxProducts: number,
): Promise<(ProductBundleType & FireBaseDocument)[]> {
    const result: (ProductBundleType & FireBaseDocument)[] = [];
    if (!mainProduct.categories || mainProduct.categories.length === 0) return result;

    for (const category of mainProduct.categories) {
        if (result.length >= maxProducts) break;

        let queryRef = adminDb
            .collection('products')
            .where('categories', 'array-contains', category)
            .where('showProduct', '==', true)
            .where('estoqueTotal', '>', 0)
            .orderBy('creationDate', 'desc')
            .limit(1);
        if (excludeIds.length > 0) {
            // Combine os IDs excluídos com os já adicionados ao resultado
            const notInIds = excludeIds.concat(result.map((p) => p.id));
            queryRef = queryRef.where('__name__', 'not-in', notInIds);
        }
        const snapshot = await queryRef.get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            result.push({ id: doc.id, ...serializeData(doc.data()), exist: doc.exists } as ProductBundleType & FireBaseDocument);
        }
    }

    return result;
}

async function getRemainingProducts(
    excludeIds: string[],
    count: number,
): Promise<(ProductBundleType & FireBaseDocument)[]> {
    if (count <= 0) return [];
    let queryRef = adminDb
        .collection('products')
        .where('showProduct', '==', true)
        .where('estoqueTotal', '>', 0)
        .orderBy('creationDate', 'desc')
        .limit(count);
    if (excludeIds.length > 0) {
        queryRef = queryRef.where('__name__', 'not-in', excludeIds);
    }
    const snapshot = await queryRef.get();
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...serializeData(doc.data()),
        exist: doc.exists,
    })) as (ProductBundleType & FireBaseDocument)[];
}

export async function getRecommendedProducts(mainProductId: string): Promise<(ProductBundleType & FireBaseDocument)[]> {
    const recommendedList: (ProductBundleType & FireBaseDocument)[] = [];
    const excludeIds: string[] = [mainProductId];

    // Busca o produto principal
    const mainProduct = await getProductById(mainProductId);
    if (!mainProduct) {
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
    const productsByCategories = await getProductsByCategories(mainProduct, excludeIds, remainingCount);
    recommendedList.push(...productsByCategories);
    excludeIds.push(...productsByCategories.map(p => p.id));

    // 4. Se ainda faltam produtos, busca os mais recentes
    const finalRemainingCount = ITEMS_PER_PAGE - recommendedList.length;
    if (finalRemainingCount > 0) {
        const remainingProducts = await getRemainingProducts(excludeIds, finalRemainingCount);
        recommendedList.push(...remainingProducts);
    }

    return recommendedList;
}
