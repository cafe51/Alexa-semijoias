import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';

export async function GET() {
    try {
        // Primeiro, buscar todas as seções
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);
        const sections = sectionsSnapshot.docs.map(doc => doc.data().sectionName);

        // Buscar produtos em destaque para cada seção em paralelo
        const productsPromises = sections.map(async(section) => {
            const productsRef = collection(projectFirestoreDataBase, 'products');
            const q = query(
                productsRef,
                where('estoqueTotal', '>=', 1),
                where('showProduct', '==', true),
                where('sections', 'array-contains', section),
                orderBy('creationDate', 'desc'),
                limit(1),
            );

            const productsSnapshot = await getDocs(q);
            return productsSnapshot.docs[0]?.data();
        });

        const products = await Promise.all(productsPromises);
        const featuredProducts = products.filter(Boolean);

        return NextResponse.json(featuredProducts);
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produtos em destaque' },
            { status: 500 },
        );
    }
}
