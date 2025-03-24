// src/app/section/[collectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollectionBySlug, getProductsForCollection } from '@/app/firebase/admin-config';
import toTitleCase from '@/app/utils/toTitleCase';
import PageContainer from '@/app/components/PageContainer';
import ProductsListClient from '@/app/components/ProductList/ProductsListClient';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';
import { generateBreadcrumbJsonLD, getCollectionBreadcrumbItems } from '@/app/utils/breadcrumbUtils';

const BASE_URL = 'https://www.alexasemijoias.com.br';

type Props = {
  params: { collectionSlugName: string };
};

async function fetchAndValidateCollection(collectionSlugName: string) {
    const collectionData = await getCollectionBySlug(collectionSlugName);
    return collectionData || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {

        const collectionData = await fetchAndValidateCollection(params.collectionSlugName);

        if (!collectionData) {
            return { title: 'Página não encontrada', robots: { index: false } };
        }

        const collectionName = collectionData.name;
        const canonicalUrl = `${BASE_URL}/collection/${params.collectionSlugName}`;
        const breadcrumbItems = getCollectionBreadcrumbItems(collectionName);
        const breadcrumbJsonLD = generateBreadcrumbJsonLD(breadcrumbItems);

        const { products } = await getProductsForCollection(
            collectionName,
            1,
            { field: 'creationDate', direction: 'desc' },
        );

        const mainImage = collectionData.image ? collectionData.image : products[0]?.images[0]?.localUrl || '';
        // const collectionDescription = collectionData.description ? collectionData.description : products[0]?.description || '';
        const collectionMetadataDescription = collectionData.description ? collectionData.description :`Coleção ${toTitleCase(collectionName)}. Semijoias de verdade.`;
        const title =  `Coleção ${toTitleCase(collectionName)} | Alexa Semijoias`;

        return {
            title: `${toTitleCase(collectionName)} | Alexa Semijoias`,
            description: `${toTitleCase(collectionName)}. Semijoias de verdade.`,
            keywords: [...new Set([collectionName, 'semijoias', 'ouro', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
            alternates: { canonical: canonicalUrl },
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            openGraph: {
                title,
                description: collectionMetadataDescription,
                url: canonicalUrl,
                images: {
                    url: mainImage || '',
                    width: 800,
                    height: 600,
                    alt: `Coleção ${collectionName} - ${mainImage || ''}`,
                },
                type: 'website',
                siteName: 'Alexa Semijoias',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: collectionName,
                images: [mainImage],
            },
            other: {
                breadcrumb: breadcrumbJsonLD,
            },
        };
    } catch (error) {
        console.error('Erro ao gerar metadata:', error);
        return {
            title: 'Coleção - Alexa Semijoias',
            description: 'Descubra nossas semijoias.',
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
        };
    }
}

export default async function Section({ params }: Props) {
    const collectionData = await fetchAndValidateCollection(params.collectionSlugName);

    if (!collectionData) {
        notFound();
    }

    // Busca inicial dos produtos no servidor
    const { products, hasMore, lastVisible } = await getProductsForCollection(
        collectionData.name,
        ITEMS_PER_PAGE,
        { field: 'creationDate', direction: 'desc' },
    );

    return (
        <PageContainer>
            <ProductsListClient
                bannerDescription={ collectionData.description ? collectionData.description : undefined }
                bannerImage={ collectionData.image ? collectionData.image : undefined }
                collectionName={ collectionData.name }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
