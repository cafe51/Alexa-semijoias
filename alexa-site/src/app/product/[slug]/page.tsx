// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Product from '@/app/components/ProductPage/Product';
import toTitleCase from '@/app/utils/toTitleCase';
import { notFound } from 'next/navigation';
import { getGoogleProductCategory } from '@/app/utils/getGoogleProductCategory';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const product = await getProductBySlug(params.slug);
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        const mainImage = product.images[0]?.localUrl || '';
        const variation = product.productVariations[0];

        return {
            title: `${toTitleCase(product.name)} | Alexa Semijoias`,
            description: product.description || `${toTitleCase(product.name)} - Semijoias de Verdade.`,
            keywords: [...new Set([...(product.categories || []), ...product.categories, 'semijoias', 'joias', 'acessórios', 'folheados', 'presentes', product.name])].join(', '),
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
                description: product.description,
                url: `/product/${params.slug}`,
                images: {
                    url: product.images[0]?.localUrl || '',
                    width: 800,
                    height: 600,
                    alt: `${product.name} - ${product.images[0]?.localUrl || '' }`,
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
                'product:category': product.categories.join(','),
                'google_product_category': getGoogleProductCategory(product).toString(),
            },
        };
    } catch (error) {
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
        creationDate: data.creationDate ? {
            seconds: data.creationDate.seconds,
            nanoseconds: data.creationDate.nanoseconds,
        } : null,
        updatingDate: data.updatingDate ? {
            seconds: data.updatingDate.seconds,
            nanoseconds: data.updatingDate.nanoseconds,
        } : null,
        id: doc.id,
        exist: doc.exists(),
    } as ProductBundleType & FireBaseDocument;
}

export default async function ProductScreenPage({ params: { slug } }: { params: { slug: string } }) {
    const product = await getProductBySlug(slug);
    
    if (!product || !product.exist) {
        notFound();
    }
    
    return (
        <Product id={ product.id } initialProduct={ product } />
    );
}
