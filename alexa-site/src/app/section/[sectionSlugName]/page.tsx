// src/app/section/[sectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSectionBySlug, getProductsForSection } from '@/app/firebase/admin-config';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';
import ProductsListClient from '@/app/components/ProductList/ProductsListClient';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';
import { getBreadcrumbItems, generateBreadcrumbJsonLD } from '@/app/utils/breadcrumbUtils';

const BASE_URL = 'https://www.alexasemijoias.com.br';

type Props = {
  params: { sectionSlugName: string };
};

async function fetchAndValidateSection(sectionSlugName: string) {
    const sectionData = await getSectionBySlug(sectionSlugName);
    return sectionData || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const sectionData = await fetchAndValidateSection(params.sectionSlugName);

    if (!sectionData) {
        return { title: 'Página não encontrada', robots: { index: false } };
    }

    const sectionName = sectionData.sectionName;
    const canonicalUrl = `${BASE_URL}/section/${params.sectionSlugName}`;
    const breadcrumbItems = getBreadcrumbItems(sectionName);
    const breadcrumbJsonLD = generateBreadcrumbJsonLD(breadcrumbItems);

    return {
        title: `${toTitleCase(sectionName)} | Alexa Semijoias`,
        description: `${toTitleCase(sectionName)}. Semijoias de verdade.`,
        keywords: [...new Set([sectionName, 'semijoias', 'ouro', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${toTitleCase(sectionName)} | Alexa Semijoias`,
            description: `${toTitleCase(sectionName)}. Semijoias de verdade.`,
            url: canonicalUrl,
        },
        other: {
            breadcrumb: breadcrumbJsonLD,
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
        ITEMS_PER_PAGE,
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
