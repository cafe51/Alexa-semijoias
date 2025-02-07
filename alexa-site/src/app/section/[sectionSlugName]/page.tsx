// src/app/section/[sectionSlugName]/page.tsx
export const revalidate = 60; // A cada 60 segundos a página é revalidada

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSectionBySlug, getProductsForSection } from '@/app/firebase/admin-config';
import ProductsList from '@/app/components/ProductList/ProductsList';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';

type Props = {
  params: { 
    sectionSlugName: string;
  }
};

async function fetchAndValidateSection(sectionSlugName: string) {
    const sectionData = await getSectionBySlug(sectionSlugName);
    if (!sectionData) {
        return null;
    }
    return sectionData;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const sectionData = await fetchAndValidateSection(params.sectionSlugName);
  
    if (!sectionData) {
        return { title: 'Página não encontrada' };
    }

    const deslugedSectionName = sectionData.sectionName;
  
    return {
        title: `${toTitleCase(deslugedSectionName)}`,
        description: `Explore ${toTitleCase(deslugedSectionName)}. Semijoias de verdade.`,
        openGraph: {
            title: `${deslugedSectionName} | Alexa Semijoias`,
            description: `Explore ${toTitleCase(deslugedSectionName)}. Semijoias de verdade.`,
        },
    };
}

export default async function Section({ params }: Props) {
    const sectionData = await fetchAndValidateSection(params.sectionSlugName);
  
    if (!sectionData) {
        notFound();
    }

    // Busca inicial dos produtos no servidor
    const { products, hasMore, lastVisible } = await getProductsForSection(
        sectionData.sectionName,
        10,
        { field: 'creationDate', direction: 'desc' },
    );
  
    return (
        <PageContainer>
            <ProductsList 
                sectionName={ sectionData.sectionName }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
