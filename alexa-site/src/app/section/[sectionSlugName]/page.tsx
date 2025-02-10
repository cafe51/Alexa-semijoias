// src/app/section/[sectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSectionBySlug, getProductsForSection } from '@/app/firebase/admin-config';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';
import ProductsListClient from '@/app/components/ProductList/ProductsListClient';

const BASE_URL = 'https://www.alexasemijoias.com.br';

type Props = {
  params: { sectionSlugName: string };
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
        return { title: 'Página não encontrada', robots: { index: false } };
    }
  
    const deslugedSectionName = sectionData.sectionName;
    const canonicalUrl = `${BASE_URL}/section/${params.sectionSlugName}`;
  
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
                name: toTitleCase(deslugedSectionName),
                item: canonicalUrl,
            },
        ],
    };
  
    return {
        title: `${toTitleCase(deslugedSectionName)} | Alexa Semijoias`,
        description: `Explore ${toTitleCase(deslugedSectionName)}. Semijoias de verdade.`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${toTitleCase(deslugedSectionName)} | Alexa Semijoias`,
            description: `Explore ${toTitleCase(deslugedSectionName)}. Semijoias de verdade.`,
            url: canonicalUrl,
        },
        other: {
            breadcrumb: JSON.stringify(breadcrumbList),
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
            <ProductsListClient
                sectionName={ sectionData.sectionName }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
