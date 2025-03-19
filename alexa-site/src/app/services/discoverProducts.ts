// src/app/services/discoverProducts.ts
import { adminDb } from '@/app/firebase/admin-config';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import { serializeData } from '@/app/utils/serializeData';
import { FieldPath } from 'firebase-admin/firestore';

export async function fetchDiscoverProductsForSection(
    section: string,
    exclusionIds: string[],
): Promise<(ProductBundleType & FireBaseDocument)[]> {
    const limit = 6;
    // Gera um valor aleatório de 00 a 98
    const randomSelectorValue = Math.floor(Math.random() * 99)
        .toString()
        .padStart(2, '0');
  
    let products: (ProductBundleType & FireBaseDocument)[] = [];
    const baseQuery = adminDb
        .collection('products')
        .where('sections', 'array-contains', section)
        .where('showProduct', '==', true)
        .where('estoqueTotal', '>', 0);
        

    // Aplica filtro de exclusão se houver e se o array tiver no máximo 10 itens (limitação do Firestore)
    let queryWithExclude = baseQuery;
    if (exclusionIds.length > 0 && exclusionIds.length <= 10) {
        queryWithExclude = queryWithExclude.where(FieldPath.documentId(), 'not-in', exclusionIds);
    }

    // Tenta buscar produtos com randomIndex >= randomSelectorValue
    const query1 = queryWithExclude
        .where('randomIndex', '>=', randomSelectorValue)
        .orderBy('randomIndex')
        .limit(limit);
    const snapshot1 = await query1.get();
    products.push(
        ...snapshot1.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists,
            ...serializeData(doc.data()),
        })),
    );

    // Se não atingiu a meta, tenta buscar com randomIndex < randomSelectorValue
    if (products.length < limit) {
        const query2 = queryWithExclude
            .where('randomIndex', '<', randomSelectorValue)
            .orderBy('randomIndex')
            .limit(limit - products.length);
        const snapshot2 = await query2.get();
        products.push(
            ...snapshot2.docs.map((doc) => ({
                id: doc.id,
                exist: doc.exists,
                ...serializeData(doc.data()),
            })),
        );
    }

    // Se mesmo assim não houver produtos suficientes, faz um fallback sem filtro de exclusão
    if (products.length < limit) {
        const queryNoExclude = baseQuery;
        const query3 = queryNoExclude
            .where('randomIndex', '>=', randomSelectorValue)
            .orderBy('randomIndex')
            .limit(limit);
        const snapshot3 = await query3.get();
        products = snapshot3.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists,
            ...serializeData(doc.data()),
        }));
        if (products.length < limit) {
            const query4 = queryNoExclude
                .where('randomIndex', '<', randomSelectorValue)
                .orderBy('randomIndex')
                .limit(limit - products.length);
            const snapshot4 = await query4.get();
            products.push(
                ...snapshot4.docs.map((doc) => ({
                    id: doc.id,
                    exist: doc.exists,
                    ...serializeData(doc.data()),
                })),
            );
        }
    }

    // Remove duplicatas, se houver, com base no id
    const uniqueProducts = Array.from(
        new Map(products.map((p) => [p.id, p])).values(),
    );
    // Anexa a informação da seção para uso no componente cliente
    return uniqueProducts.map((p) => ({ ...p, section }));
}
