// src/app/section/page.tsx
export const revalidate = 60; // A cada 60 segundos a página é revalidada
import { Metadata } from 'next';
import PageContainer from '@/app/components/PageContainer';
import ProductsListClient from '../components/ProductList/ProductsListClient';
import { getProductsForSection } from '@/app/firebase/admin-config';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';
import { generateBreadcrumbJsonLD, getBreadcrumbItems } from '../utils/breadcrumbUtils';

const BASE_URL = 'https://www.alexasemijoias.com.br';

export async function generateMetadata(): Promise<Metadata> {

    const canonicalUrl = `${BASE_URL}/section`;
    try {
        const breadcrumbItems = getBreadcrumbItems();
        const breadcrumbJsonLD = generateBreadcrumbJsonLD(breadcrumbItems);

        const { products } = await getProductsForSection(
            undefined,
            1,
            { field: 'creationDate', direction: 'desc' },
        );

        const mainImage = products[0]?.images[0]?.localUrl || '';

        const title = 'Alexa Semijoias | Semijoias de Verdade';
        const description = 'Semijoias banhadas à ouro 18k.';

        return {
            title,
            description,
            keywords: [...new Set(['semijoias', 'ouro', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
            alternates: { canonical: canonicalUrl },
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                images: {
                    url: mainImage || '',
                    width: 800,
                    height: 600,
                    alt: title,
                },
                type: 'website',
                siteName: 'Alexa Semijoias',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
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
            description: 'Descubra nossa coleção exclusiva de semijoias.',
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
        };
    }
}

export default async function Section() {
    // Busca inicial dos produtos no servidor
    const { products, hasMore, lastVisible } = await getProductsForSection(
        undefined,
        ITEMS_PER_PAGE,
        { field: 'creationDate', direction: 'desc' },
    );
  
    return (
        <PageContainer>
            <ProductsListClient
                initialData={ { products, hasMore, lastVisible } }
            />
        </PageContainer>
    );
}
