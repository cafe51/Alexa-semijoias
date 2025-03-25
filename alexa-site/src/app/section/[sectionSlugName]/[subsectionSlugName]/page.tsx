// src/app/section/[sectionSlugName]/[subsectionSlugName]/page.tsx
export const revalidate = 60; // Revalidação a cada 60 segundos

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsForSection, getSectionBySlug, getSectionMedia } from '@/app/firebase/admin-config';
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

async function fetchSectionMedia(sectionSlugName: string) {
    const sectionMedia = await getSectionMedia(sectionSlugName);
    return sectionMedia || null;
}

export async function generateMetadata({ params: { sectionSlugName, subsectionSlugName } }: Props): Promise<Metadata> {
    try {

        const sectionData = await getSectionBySlug(sectionSlugName);
  
        if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
            return { title: 'Página não encontrada', robots: { index: false } };
        }
  
        const deslugedSection = sectionData.sectionName;
        const deslugedSubsection = getSubsectionName(sectionData, subsectionSlugName) || 'Subseção não encontrada';
        const canonicalUrl = `${BASE_URL}/section/${sectionSlugName}/${subsectionSlugName}`;
  
        const breadcrumbItems = getBreadcrumbItems(deslugedSection, deslugedSubsection);
        const breadcrumbJsonLD = generateBreadcrumbJsonLD(breadcrumbItems);

        const { products } = await getProductsForSection(
            sectionData.sectionName,
            1,
            { field: 'creationDate', direction: 'desc' },
            deslugedSubsection,
        );

        const mainImage = products[0]?.images[0]?.localUrl || '';
  
        return {
            title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
            description: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
            keywords: [...new Set([deslugedSection, deslugedSubsection, 'semijoias', 'ouro', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
            alternates: {
                canonical: canonicalUrl,
            },
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            openGraph: {
                title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
                description: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
                url: canonicalUrl,
                images: {
                    url: mainImage || '',
                    width: 800,
                    height: 600,
                    alt: `${deslugedSubsection} - ${mainImage || ''}`,
                },
                type: 'website',
                siteName: 'Alexa Semijoias',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)} | Alexa Semijoias`,
                description: `${toTitleCase(deslugedSubsection)} em ${toTitleCase(deslugedSection)}. Semijoias de verdade.`,
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
  
export default async function SubSection({ params: { sectionSlugName, subsectionSlugName } }: Props) {
    const sectionData = await getSectionBySlug(sectionSlugName);
  
    if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
        notFound();
    }
  
    const subsectionName = getSubsectionName(sectionData, subsectionSlugName);
    if (!subsectionName) {
        notFound();
    }

    const sectionMedia = await fetchSectionMedia(sectionData.sectionName);

    const subsectionDescription = sectionMedia?.imagesAndDescriptions?.subsectionImagesAndDescriptions?.find(
        (s) => s.subsectionName === subsectionName,
    )?.subsectionDescription;

    const subsectionImage = sectionMedia?.imagesAndDescriptions?.subsectionImagesAndDescriptions?.find(
        (s) => s.subsectionName === subsectionName,
    )?.subsectionImage;

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
                bannerDescription={ subsectionDescription }
                bannerImage={ subsectionImage }
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
