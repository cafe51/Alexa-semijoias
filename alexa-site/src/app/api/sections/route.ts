import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';

export async function GET() {
    try {
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);
        const sections = sectionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(sections);
    } catch (error) {
        console.error('Erro ao buscar seções:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar seções' },
            { status: 500 },
        );
    }
}
