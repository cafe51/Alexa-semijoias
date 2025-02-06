// src/app/firebase/admin-config.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { FireBaseDocument, SectionSlugType } from '@/app/utils/types';
import { fetchProducts, ProductsResponse } from '@/app/services/products';
import { serializeData } from '../utils/serializeData';

let adminDb: Firestore;

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    console.log('Usando emuladores do Firebase Admin');
  
    const apps = getApps();
    if (apps.length === 0) {
        const adminApp = initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        adminDb = getFirestore(adminApp);
        adminDb.settings({
            host: 'localhost:8080',
            ssl: false,
        });
    } else {
        adminDb = getFirestore(apps[0]);
    }
} else {
    const firebaseAdminConfig = {
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            
        }),
    };

    const apps = getApps();
    const adminApp = apps.length === 0 ? initializeApp(firebaseAdminConfig) : apps[0];
    adminDb = getFirestore(adminApp);
}

export async function getProductsForSection(
    sectionName?: string,
    limit: number = 10,
    orderBy: { field: string; direction: 'asc' | 'desc' } = { field: 'creationDate', direction: 'desc' },
    subsection?: string, // novo parâmetro opcional
): Promise<ProductsResponse> {
    return fetchProducts({
        sectionName,
        subsection,
        limit,
        orderBy: orderBy.field,
        direction: orderBy.direction,
    });
}

export async function getSectionBySlug(sectionSlugName: string): Promise<(SectionSlugType & FireBaseDocument) | null> {
    try {
        const snapshot = await adminDb
            .collection('siteSectionsWithSlugName')
            .where('sectionSlugName', '==', sectionSlugName)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            exist: doc.exists,
            ...serializeData(doc.data()),
        } as SectionSlugType & FireBaseDocument;
    } catch (error) {
        console.error('Erro ao buscar seção:', error);
        throw new Error('Falha ao carregar seção');
    }
}

export { adminDb };
