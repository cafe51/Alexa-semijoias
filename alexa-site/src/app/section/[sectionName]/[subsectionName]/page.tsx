import { Metadata } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import ProductsList from '../../../components/ProductList/ProductsList';
import SectionPageTitle from '../../SectionPageTitle';
import { SectionType } from '@/app/utils/types';
import { notFound } from 'next/navigation';

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
    
    if (!section || !section.subsections?.includes(decodeURIComponent(params.subsectionName))) {
        return {
            title: 'Página não encontrada | Alexa Semijoias',
        };
    }

    const decodedSection = decodeURIComponent(params.sectionName);
    const decodedSubsection = decodeURIComponent(params.subsectionName);
    
    return {
        title: `${decodedSubsection} em ${decodedSection} | Alexa Semijoias`,
        description: `Explore nossa coleção de ${decodedSubsection.toLowerCase()} em ${decodedSection.toLowerCase()}. Semijoias exclusivas com qualidade e elegância para todos os momentos.`,
        openGraph: {
            title: `${decodedSubsection} em ${decodedSection} | Alexa Semijoias`,
            description: `Explore nossa coleção de ${decodedSubsection.toLowerCase()} em ${decodedSection.toLowerCase()}. Semijoias exclusivas com qualidade e elegância.`,
        },
    };
}

export default async function SubSection({ params: { sectionName, subsectionName } }: Props) {
    const section = await getSection(sectionName);
    
    if (!section || !section.subsections?.includes(decodeURIComponent(subsectionName))) {
        notFound();
    }

    const decodedSection = decodeURIComponent(sectionName);
    const decodedSubsection = decodeURIComponent(subsectionName);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <SectionPageTitle section={ decodedSection } subsection={ decodedSubsection } />
                <ProductsList sectionName={ decodedSection } subsection={ `${decodedSection}:${decodedSubsection}` }/>
            </div>
        </div>
    );
}
