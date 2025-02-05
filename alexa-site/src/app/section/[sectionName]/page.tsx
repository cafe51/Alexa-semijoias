//app/section/[sectionName]/page.tsx
import ProductsList from '../../components/ProductList/ProductsList';
import { Metadata } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { SectionType } from '@/app/utils/types';
import { notFound } from 'next/navigation';
import toTitleCase from '@/app/utils/toTitleCase';

type Props = {
    params: { 
        subsectionName: string;
        sectionName: string;
    }
};

async function getSection(sectionName: string) {
    const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
    const q = query(sectionsRef, where('sectionName', '==', decodeURIComponent(sectionName)));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return null;
    }
    
    return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
    } as SectionType & { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const section = await getSection(params.sectionName);
    
    if (!section) {
        return {
            title: 'Página não encontrada',
        };
    }

    const decodedSection = decodeURIComponent(params.sectionName);
    
    return {
        title: `${toTitleCase(decodedSection)}`,
        description: `Explore ${toTitleCase(decodedSection)}. Semijoias de verdade.`,
        openGraph: {
            title: `${decodedSection} | Alexa Semijoias`,
            description: `Explore ${toTitleCase(decodedSection)}. Semijoias de verdade.`,
        },
    };
}

export default async function Section({ params: { sectionName } }: Props) {
    const section = await getSection(sectionName);
        
    if (!section) {
        notFound();
    }
    
    const decodedSection = decodeURIComponent(sectionName);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <ProductsList sectionName={ decodeURIComponent(decodedSection) } />
            </div>
        </div>
    );
}
