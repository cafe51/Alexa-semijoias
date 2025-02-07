// src/app/services/products.ts
import { adminDb } from '@/app/firebase/admin-config';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import { serializeData } from '@/app/utils/serializeData';
import removeAccents from '@/app/utils/removeAccents';

export type ProductsQueryParams = {
  sectionName?: string;
  subsection?: string; // novo parâmetro
  limit?: number;
  orderBy?: string;
  direction?: 'asc' | 'desc';
  lastVisible?: string | null;
  searchTerm?: string;
};

export type ProductsResponse = {
  products: (ProductBundleType & FireBaseDocument)[];
  hasMore: boolean;
  lastVisible: string | null;
};

function buildProductsQuery({
    sectionName,
    subsection,
    searchTerm,
}: ProductsQueryParams) {
    let query = adminDb.collection('products')
        .where('showProduct', '==', true);
        // .where('estoqueTotal', '>', 0);

    if (searchTerm) {
        const processedTerm = removeAccents(searchTerm.toLowerCase());
        query = query.where('keyWords', 'array-contains', processedTerm);
    } else if (subsection && sectionName) {
        query = query.where('subsections', 'array-contains', `${sectionName}:${subsection}`);
    } else if (sectionName) {
        query = query.where('sections', 'array-contains', sectionName);
    }
    return query;
}

export async function fetchProducts({
    sectionName,
    subsection,
    limit = ITEMS_PER_PAGE,
    orderBy = 'creationDate',
    direction = 'desc',
    lastVisible,
    searchTerm,
}: ProductsQueryParams): Promise<ProductsResponse> {
    try {
        let query = buildProductsQuery({ sectionName, subsection, searchTerm });
        query = query.orderBy(orderBy, direction);

        if (lastVisible) {
            const lastDoc = await adminDb.collection('products').doc(lastVisible).get();
            if (lastDoc.exists) {
                query = query.startAfter(lastDoc);
            }
        }

        query = query.limit(limit);
        const snapshot = await query.get();

        const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists,
            ...serializeData(doc.data()),
        })) as (ProductBundleType & FireBaseDocument)[];

        const hasMore = products.length === limit;
        const lastVisibleNew = snapshot.docs[snapshot.docs.length - 1]?.id || null;

        return { products, hasMore, lastVisible: lastVisibleNew };
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw new Error('Falha ao carregar produtos');
    }
}

export async function fetchRandomProductForSection(
    section: string,
): Promise<(ProductBundleType & FireBaseDocument) | null> {
    try {
        // Gera um valor aleatório de 00 a 98 (como string com 2 dígitos)
        const randomSelectorValue = Math.floor(Math.random() * 99)
            .toString()
            .padStart(2, '0');
  
        // Primeira tentativa: produtos com randomIndex >= randomSelectorValue
        let queryRef = adminDb
            .collection('products')
            .where('sections', 'array-contains', section)
            .where('randomIndex', '>=', randomSelectorValue)
            .orderBy('randomIndex')
            .limit(4);
        let snapshot = await queryRef.get();
  
        // Se não houver resultados, tenta com randomIndex < randomSelectorValue
        if (snapshot.empty) {
            queryRef = adminDb
                .collection('products')
                .where('sections', 'array-contains', section)
                .where('randomIndex', '<', randomSelectorValue)
                .orderBy('randomIndex')
                .limit(4);
            snapshot = await queryRef.get();
        }
  
        if (snapshot.empty) {
            return null;
        }
  
        const docs = snapshot.docs;
        const randomIdx = Math.floor(Math.random() * docs.length);
        const doc = docs[randomIdx];
  
        return {
            id: doc.id,
            exist: doc.exists,
            ...serializeData(doc.data()),
        } as ProductBundleType & FireBaseDocument;
    } catch (error) {
        console.error('Erro ao buscar produto aleatório para a seção:', error);
        return null;
    }
}
  