//app/section/[sectionName]/page.tsx
import ProductsList from '../../components/ProductList/ProductsList';
import { Metadata } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { FireBaseDocument, SectionSlugType } from '@/app/utils/types';
import { notFound } from 'next/navigation';
import toTitleCase from '@/app/utils/toTitleCase';

type Props = {
    params: { 
        sectionSlugName: string;
        subsectionSlugName: string;
    }
};

async function getSectionWithSlugName(sectionSlugName: string) {
    const sectionsRef = collection(projectFirestoreDataBase, 'siteSectionsWithSlugName');
    const q = query(sectionsRef, where('sectionSlugName', '==', sectionSlugName));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return null;
    }
    
    return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
    } as SectionSlugType & FireBaseDocument;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const sectionWithSlugName = await getSectionWithSlugName(params.sectionSlugName);
    
    if (!sectionWithSlugName) {
        return {
            title: 'Página não encontrada',
        };
    }

    const deslugedSectionName = (sectionWithSlugName.sectionName);
    
    return {
        title: `${toTitleCase(deslugedSectionName)}`,
        description: `Explore ${toTitleCase(deslugedSectionName)}. Semijoias de verdade.`,
        openGraph: {
            title: `${deslugedSectionName} | Alexa Semijoias`,
            description: `Explore ${toTitleCase(deslugedSectionName)}. Semijoias de verdade.`,
        },
    };
}

export default async function Section({ params: { sectionSlugName } }: Props) {
    const sectionWithSlugName = await getSectionWithSlugName(sectionSlugName);
        
    if (!sectionWithSlugName) {
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <ProductsList sectionName={ sectionWithSlugName.sectionName } />
            </div>
        </div>
    );
}
