// src/app/section/[sectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSectionBySlug, getProductsForSection, getSectionMedia } from '@/app/firebase/admin-config';
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

async function fetchSectionMedia(sectionSlugName: string) {
    const sectionMedia = await getSectionMedia(sectionSlugName);
    return sectionMedia || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {

        const sectionData = await fetchAndValidateSection(params.sectionSlugName);

        if (!sectionData) {
            return { title: 'Página não encontrada', robots: { index: false } };
        }

        const sectionName = sectionData.sectionName;
        const canonicalUrl = `${BASE_URL}/section/${params.sectionSlugName}`;
        const breadcrumbItems = getBreadcrumbItems(sectionName);
        const breadcrumbJsonLD = generateBreadcrumbJsonLD(breadcrumbItems);

        const { products } = await getProductsForSection(
            sectionData.sectionName,
            1,
            { field: 'creationDate', direction: 'desc' },
        );

        const mainImage = products[0]?.images[0]?.localUrl || '';

        return {
            title: `${toTitleCase(sectionName)} | Alexa Semijoias`,
            description: `${toTitleCase(sectionName)}. Semijoias de verdade.`,
            keywords: [...new Set([sectionName, 'semijoias', 'ouro', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
            alternates: { canonical: canonicalUrl },
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            openGraph: {
                title: `${toTitleCase(sectionName)} | Alexa Semijoias`,
                description: `${toTitleCase(sectionName)}. Semijoias de verdade.`,
                url: canonicalUrl,
                images: {
                    url: mainImage || '',
                    width: 800,
                    height: 600,
                    alt: `${sectionName} - ${mainImage || ''}`,
                },
                type: 'website',
                siteName: 'Alexa Semijoias',
            },
            twitter: {
                card: 'summary_large_image',
                title: toTitleCase(sectionName),
                description: sectionName,
                images: [mainImage],
            },
            other: {
                breadcrumb: breadcrumbJsonLD,
            },
        };
    } catch (error) {
        console.error('Erro ao gerar metadata:', error);
        return {
            title: 'Produtos - Alexa Semijoias',
            description: 'Descubra nossas semijoias exclusivas.',
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
        };
    }
}

export default async function Section({ params }: Props) {
    const sectionData = await fetchAndValidateSection(params.sectionSlugName);

    if (!sectionData) {
        notFound();
    }

    const sectionMedia = await fetchSectionMedia(sectionData.sectionName);


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
                bannerDescription={ sectionMedia?.imagesAndDescriptions?.sectionDescription }
                bannerImage={ sectionMedia?.imagesAndDescriptions?.sectionImage }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
