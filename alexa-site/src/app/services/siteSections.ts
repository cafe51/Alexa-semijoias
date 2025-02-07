// app/utils/getSiteSections.server.ts
import { adminDb } from '@/app/firebase/admin-config';
import { FireBaseDocument, SectionType } from '@/app/utils/types';
import { serializeData } from '@/app/utils/serializeData';

export async function getSiteSections(): Promise<(SectionType & FireBaseDocument)[]> {
    const snapshot = await adminDb.collection('siteSections').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        exist: doc.exists,
        ...serializeData(doc.data()),
    })) as (SectionType & FireBaseDocument)[];
}
