// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Product from '@/app/components/ProductPage/Product';
import toTitleCase from '@/app/utils/toTitleCase';
import { notFound } from 'next/navigation';
import { getGoogleProductCategory } from '@/app/utils/getGoogleProductCategory';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getProductBreadcrumbItems } from '@/app/utils/breadcrumbUtils';
import { filtrarResultadosValidos, getRandomProductsForSections, getSections } from '@/app/components/homePage/homePageUtilFunctions';
import { shortenText } from '@/app/utils/shortenText';
import { SITE_URL } from '@/app/utils/constants';
import { fetchProductsData } from '@/app/section/utils';
import { getSectionBySlug } from '@/app/firebase/admin-config';

type Props = {
    params: {
      sectionSlugName: string;
      subsectionSlugName: string;
      slug: string;
    };
};

function verifySubsectionSlugExistence(section: any, subsectionSlugName: string) {
    return section.subsections?.some((sub: any) => sub.subsectionSlugName === subsectionSlugName);
}

function getSubsectionName(section: any, subsectionSlugName: string) {
    return section.subsections?.find((sub: any) => sub.subsectionSlugName === subsectionSlugName)?.subsectionName;
}

export async function generateMetadata({ params: { sectionSlugName, subsectionSlugName, slug } }: Props): Promise<Metadata> {
    try {
        const sectionData = await getSectionBySlug(sectionSlugName);

        if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
            throw new Error('Seção não encontrada');
        }
    
        const subsectionName = getSubsectionName(sectionData, subsectionSlugName);
        if (!subsectionName) {
            throw new Error('Subseção não encontrada');
        }

        const product = await fetchProductsData(sectionData.sectionName, subsectionName, slug);
    
        if (!product || !product.exist) {
            throw new Error('Produto não encontrado');
        }

        const mainImage = product.images[0]?.localUrl || '';
        const variation = product.productVariations[0];

        return {
            title: `${toTitleCase(product.name)}`,
            description:
        shortenText(product.description, 155) ||
        `${toTitleCase(product.name)} - Semijoias de Verdade.`,
            keywords: [...new Set([product.sections[0], subsectionName, ...(product.categories || []), 'semijoias', 'joias', 'acessórios', 'folheados', 'presentes'])]
                .filter((keyword) => keyword)
                .join(', '),
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            alternates: {
                canonical: `/product/${slug}`,
            },
            openGraph: {
                title: toTitleCase(product.name),
                description: shortenText(product.description, 155) ||
                `${toTitleCase(product.name)} - Semijoias de Verdade.`,
                url: `/product/${slug}`,
                images: {
                    url: mainImage,
                    width: 800,
                    height: 600,
                    alt: `${product.name} - ${mainImage}`,
                },
                type: 'website',
                siteName: 'Alexa Semijoias',
            },
            twitter: {
                card: 'summary_large_image',
                title: toTitleCase(product.name),
                description: product.description,
                images: [mainImage],
            },
            other: {
                'og:type': 'product',
                'og:brand': 'Alexa Semijoias',
                'og:availability': variation.estoque > 0 ? 'in stock' : 'out of stock',
                'og:condition': 'new',
                'og:price:amount': variation.value.price.toString(),
                'og:price:currency': 'BRL',
                'og:retailer_item_id': variation.sku,
                'og:content_id': variation.sku,
                'content_id': variation.sku,
                'product:brand': 'Alexa Semijoias',
                'product:availability': variation.estoque > 0 ? 'in stock' : 'out of stock',
                'product:condition': 'new',
                'product:price:amount': variation.value.price.toString(),
                'product:price:currency': 'BRL',
                'product:retailer_item_id': variation.sku,
                'product:category': [...new Set([product.sections[0], subsectionName, ...(product.categories || []), 'semijoias', 'joias', 'acessórios'])].join(', '),
                'google_product_category': getGoogleProductCategory(product).toString(),
            },
        };
    } catch (error) {
        console.log('Erro ao gerar metadata:', error);
        return {
            title: 'Produto - Alexa Semijoias',
            description: 'Descubra nossas semijoias exclusivas.',
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
        };
    }
}

export default async function ProductScreenPage({
    params: { sectionSlugName, subsectionSlugName, slug },
    searchParams,
}: {
  params: { sectionSlugName: string, subsectionSlugName: string, slug: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    const sectionData = await getSectionBySlug(sectionSlugName);

    if (!sectionData || !verifySubsectionSlugExistence(sectionData, subsectionSlugName)) {
        notFound();
    }

    const subsectionName = getSubsectionName(sectionData, subsectionSlugName);
    if (!subsectionName) {
        notFound();
    }
    const product = await fetchProductsData(sectionData.sectionName, subsectionName, slug);

    if (!product || !product.exist) {
        notFound();
    }

    const sections = await getSections();

    const exclusionMapForCarousel: { [sectionName: string]: string[] } = {};
    if (product && product.sections) {
        product.sections.forEach((sec) => {
            exclusionMapForCarousel[sec] = exclusionMapForCarousel[sec]
                ? [...exclusionMapForCarousel[sec], product.id]
                : [product.id];
        });
    }

    const randomProductsForSections = sections && sections.length > 0 
        ? await getRandomProductsForSections(sections, exclusionMapForCarousel)
        : [];

    if (!product || !product.exist) {
        notFound();
    }

    const sectionProducts = filtrarResultadosValidos<ProductBundleType & FireBaseDocument>(randomProductsForSections.map(({ product }) => product));

    // Converte searchParams para um objeto simples
    const initialSelectedOptions: { [key: string]: string } = {};
    Object.keys(searchParams).forEach((key) => {
        const value = searchParams[key];
        if (typeof value === 'string') {
            initialSelectedOptions[key] = value;
        }
    });

    const breadcrumbItems = getProductBreadcrumbItems(sectionData.sectionName, subsectionName, product.name);

    let recommendedProducts: ((ProductBundleType & FireBaseDocument)[] | []) = [];

    try {
        const productsFetch = await fetch(`${SITE_URL}/api/recommended-products?mainProductId=${product.id}`);
        const fetchDataOfProducts = await productsFetch.json();
        if (!productsFetch.ok) {
            recommendedProducts = [];
        } else {
            recommendedProducts = fetchDataOfProducts.recommendedProducts;
        }
    } catch(err) {
        console.error(err);
    }

    return (
        <main className="min-h-screen md:px-8 lg:px-10 md:pt-6 lg:pt-8 bg-white">
            <Breadcrumbs items={ breadcrumbItems } />
            <Product
                id={ product.id }
                initialProduct={ product }
                recommendedProducts={ recommendedProducts }
                initialSelectedOptions={ initialSelectedOptions }
                sectionProducts={ sectionProducts }
            />
        </main>
    );
}
