//app/section/[sectionName]/[subsectionName]/page.tsx
import { Metadata } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import ProductsList from '../../../components/ProductList/ProductsList';
import { SectionSlugType } from '@/app/utils/types';
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
    } as SectionSlugType & { id: string };
}

function verifySubsectionSlugNameExistence(section: SectionSlugType, subsectionSlugName: string) {
    return section.subsections?.some((subsection) => subsection.subsectionSlugName === subsectionSlugName);
}

function findSubsectionName(section: SectionSlugType, subsectionSlugName: string) {
    return section.subsections?.find((subsection) => subsection.subsectionSlugName === subsectionSlugName)?.subsectionName;
}

export async function generateMetadata({ params: { sectionSlugName, subsectionSlugName } }: Props): Promise<Metadata> {
    const sectionWithSlugName = await getSectionWithSlugName(sectionSlugName);

    if (!sectionWithSlugName || !verifySubsectionSlugNameExistence(sectionWithSlugName, subsectionSlugName)) {
        return {
            title: 'Página não encontrada',
        };
    }

    const deslugedSection = (sectionWithSlugName.sectionName);
    const deslugedSubsection = findSubsectionName(sectionWithSlugName, subsectionSlugName) || 'Subseção não encontrada';
    
    return {
        title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}`,
        description: `Explore ${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
        openGraph: {
            title: `${deslugedSubsection} em ${deslugedSection}`,
            description: `Explore ${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
        },
    };
}

export default async function SubSection({ params: { sectionSlugName, subsectionSlugName } }: Props) {
    const sectionWithSlugName = await getSectionWithSlugName(sectionSlugName);
    
    if (!sectionWithSlugName || !verifySubsectionSlugNameExistence(sectionWithSlugName, subsectionSlugName)) {
        notFound();
    }

    const sectionName = sectionWithSlugName.sectionName;

    const subsectionName = findSubsectionName(sectionWithSlugName, subsectionSlugName) || 'Subseção não encontrada';

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <ProductsList sectionName={ sectionName } subsection={ `${sectionName}:${subsectionName}` }/>
            </div>
        </div>
    );
}
