// src/app/section/[sectionSlugName]/[subsectionSlugName]/page.tsx
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsForSection, getSectionBySlug } from '@/app/firebase/admin-config';
import ProductsList from '@/app/components/ProductList/ProductsList';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';
import { SectionSlugType } from '@/app/utils/types';

type Props = {
  params: { 
    sectionSlugName: string;
    subsectionSlugName: string;
  }
};

function verifySubsectionSlugExistence(section: SectionSlugType, subsectionSlugName: string) {
    return section.subsections?.some((sub) => sub.subsectionSlugName === subsectionSlugName);
}

function getSubsectionName(section: SectionSlugType, subsectionSlugName: string) {
    return section.subsections?.find((sub) => sub.subsectionSlugName === subsectionSlugName)?.subsectionName;
}

export async function generateMetadata({ params: { sectionSlugName, subsectionSlugName } }: Props): Promise<Metadata> {
    const sectionData = await getSectionBySlug(sectionSlugName);

    if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
        return { title: 'Página não encontrada' };
    }

    const deslugedSection = sectionData.sectionName;
    const deslugedSubsection = getSubsectionName(sectionData, subsectionSlugName) || 'Subseção não encontrada';
    
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
    const sectionData = await getSectionBySlug(sectionSlugName);
    
    if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
        notFound();
    }

    const subsectionName = getSubsectionName(sectionData, subsectionSlugName);
    if (!subsectionName) {
        notFound();
    }

    // Busca inicial dos produtos filtrando também por subseção
    const { products, hasMore, lastVisible } = await getProductsForSection(
        sectionData.sectionName,
        10,
        { field: 'creationDate', direction: 'desc' },
        subsectionName,  // novo parâmetro para filtrar por subseção
    );

    return (
        <PageContainer>
            <ProductsList 
                sectionName={ sectionData.sectionName }
                subsection={ subsectionName }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
