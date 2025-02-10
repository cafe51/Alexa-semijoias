// src/app/section/[sectionSlugName]/[subsectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsForSection, getSectionBySlug } from '@/app/firebase/admin-config';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';
import { SectionSlugType } from '@/app/utils/types';
import ProductsListClient from '@/app/components/ProductList/ProductsListClient';

const BASE_URL = 'https://www.alexasemijoias.com.br';

type Props = {
  params: {
    sectionSlugName: string;
    subsectionSlugName: string;
  };
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
        return { title: 'Página não encontrada', robots: { index: false } };
    }
  
    const deslugedSection = sectionData.sectionName;
    const deslugedSubsection = getSubsectionName(sectionData, subsectionSlugName) || 'Subseção não encontrada';
    const canonicalUrl = `${BASE_URL}/section/${sectionSlugName}/${subsectionSlugName}`;
  
    // JSON‑LD para Breadcrumbs
    const breadcrumbList = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: BASE_URL,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: toTitleCase(deslugedSection),
                item: `${BASE_URL}/section/${sectionSlugName}`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: toTitleCase(deslugedSubsection),
                item: canonicalUrl,
            },
        ],
    };
  
    return {
        title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
        description: `Explore ${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
            description: `Explore ${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
            url: canonicalUrl,
        },
        other: {
            breadcrumb: JSON.stringify(breadcrumbList),
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
        subsectionName, // novo parâmetro para filtrar por subseção
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
