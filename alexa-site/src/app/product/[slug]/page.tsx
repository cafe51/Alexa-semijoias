// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Product from '@/app/components/ProductPage/Product';
import toTitleCase from '@/app/utils/toTitleCase';
import { notFound } from 'next/navigation';
import { getGoogleProductCategory } from '@/app/utils/getGoogleProductCategory';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getProductBreadcrumbItems } from '@/app/utils/breadcrumbUtils';
import { filtrarResultadosValidos, getRandomProductsForSections, getSections } from '@/app/components/homePage/homePageUtilFunctions';
import { shortenText } from '@/app/utils/shortenText';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const product = await getProductBySlug(params.slug);
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        const mainImage = product.images[0]?.localUrl || '';
        const variation = product.productVariations[0];

        const subsectionName =
      product.subsections && product.subsections.length > 0
          ? product.subsections[0].split(':')[1]
          : '';

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
                canonical: `/product/${params.slug}`,
            },
            openGraph: {
                title: toTitleCase(product.name),
                description: shortenText(product.description, 155) ||
                `${toTitleCase(product.name)} - Semijoias de Verdade.`,
                url: `/product/${params.slug}`,
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
            description: 'Descubra nossa coleção exclusiva de semijoias.',
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
        };
    }
}

async function getProductBySlug(slug: string) {
    const productsRef = collection(projectFirestoreDataBase, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];

    if (!doc) return null;

    const data = doc.data();
    return {
        ...data,
        creationDate: data.creationDate
            ? { seconds: data.creationDate.seconds, nanoseconds: data.creationDate.nanoseconds }
            : null,
        updatingDate: data.updatingDate
            ? { seconds: data.updatingDate.seconds, nanoseconds: data.updatingDate.nanoseconds }
            : null,
        id: doc.id,
        exist: doc.exists(),
    } as ProductBundleType & FireBaseDocument;
}

export default async function ProductScreenPage({
    params: { slug },
    searchParams,
}: {
  params: { slug: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    const product = await getProductBySlug(slug);

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

    // Preparar os dados para o breadcrumb:
    // • Categoria: primeira entrada em product.sections
    // • Subcategoria: se existir, extrai a parte após o ':' em product.subsections[0]
    const category = product.sections && product.sections.length > 0 ? product.sections[0] : '';
    const subcategory =
    product.subsections && product.subsections.length > 0
        ? product.subsections[0].split(':')[1]
        : null;
    const breadcrumbItems = getProductBreadcrumbItems(category, subcategory, product.name);

    let recommendedProducts: ((ProductBundleType & FireBaseDocument)[] | []) = [];
    const BASE_URL = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR ? 'http://localhost:3000' : 'https://www.alexasemijoias.com.br';
    try {
        const productsFetch = await fetch(`${BASE_URL}/api/recommended-products?mainProductId=${product.id}`);
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
