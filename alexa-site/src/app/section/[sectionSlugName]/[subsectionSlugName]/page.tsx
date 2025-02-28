// src/app/section/[sectionSlugName]/[subsectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsForSection, getSectionBySlug } from '@/app/firebase/admin-config';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';
import ProductsListClient from '@/app/components/ProductList/ProductsListClient';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';
import { getBreadcrumbItems, generateBreadcrumbJsonLD } from '@/app/utils/breadcrumbUtils';

const BASE_URL = 'https://www.alexasemijoias.com.br';

type Props = {
  params: {
    sectionSlugName: string;
    subsectionSlugName: string;
  };
};

function verifySubsectionSlugExistence(section: any, subsectionSlugName: string) {
    return section.subsections?.some((sub: any) => sub.subsectionSlugName === subsectionSlugName);
}

function getSubsectionName(section: any, subsectionSlugName: string) {
    return section.subsections?.find((sub: any) => sub.subsectionSlugName === subsectionSlugName)?.subsectionName;
}

export async function generateMetadata({ params: { sectionSlugName, subsectionSlugName } }: Props): Promise<Metadata> {
    const sectionData = await getSectionBySlug(sectionSlugName);
  
    if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
        return { title: 'Página não encontrada', robots: { index: false } };
    }
  
    const deslugedSection = sectionData.sectionName;
    const deslugedSubsection = getSubsectionName(sectionData, subsectionSlugName) || 'Subseção não encontrada';
    const canonicalUrl = `${BASE_URL}/section/${sectionSlugName}/${subsectionSlugName}`;
  
    const breadcrumbItems = getBreadcrumbItems(deslugedSection, deslugedSubsection);
    const breadcrumbJsonLD = generateBreadcrumbJsonLD(breadcrumbItems);
  
    return {
        title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
        description: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
        keywords: [...new Set([deslugedSection, deslugedSubsection, 'semijoias', 'ouro', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
            description: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
            url: canonicalUrl,
        },
        other: {
            breadcrumb: breadcrumbJsonLD,
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
        ITEMS_PER_PAGE,
        { field: 'creationDate', direction: 'desc' },
        subsectionName,
    );
  
    return (
        <PageContainer>
            <ProductsListClient
                sectionName={ sectionData.sectionName }
                subsection={ subsectionName }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
