// app/utils/getSiteCollections.server.ts
import { adminDb } from '@/app/firebase/admin-config';
import { CollectionType, FireBaseDocument } from '@/app/utils/types';
import { serializeData } from '@/app/utils/serializeData';

export async function getSiteCollections(): Promise<(CollectionType & FireBaseDocument)[]> {
    const snapshot = await adminDb.collection('colecoes').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        exist: doc.exists,
        ...serializeData(doc.data()),
    })) as (CollectionType & FireBaseDocument)[];
}
