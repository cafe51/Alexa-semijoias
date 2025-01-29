// src/app/product/[productId]/page.tsx

import { Metadata } from 'next';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Product from '@/app/components/ProductPage/Product';
import toTitleCase from '@/app/utils/toTitleCase';

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    try {
        const docRef = doc(projectFirestoreDataBase, 'products', params.productId);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        const productData = {
            ...data,
            creationDate: data?.creationDate ? {
                seconds: data.creationDate.seconds,
                nanoseconds: data.creationDate.nanoseconds,
            } : null,
            updatingDate: data?.updatingDate ? {
                seconds: data.updatingDate.seconds,
                nanoseconds: data.updatingDate.nanoseconds,
            } : null,
            id: docSnap.id,
            exist: docSnap.exists(),
        } as ProductBundleType & FireBaseDocument;

        const mainImage = productData.images[0]?.localUrl || '';
        const variation = productData.productVariations[0];

        return {
            title: `${toTitleCase(productData.name)} | Alexa Semijoias`,
            description: productData.description || `${toTitleCase(productData.name)} - Compre em até 6x sem juros com frete grátis. Semijoias exclusivas com qualidade e elegância.`,
            keywords: [...new Set([...(productData.categories || []), ...productData.categories, 'semijoias', 'joias', 'acessórios', 'folheados', 'presentes', productData.name])].join(', '),
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            alternates: {
                canonical: `/product/${params.productId}`,
            },
            openGraph: {
                title: toTitleCase(productData.name),
                description: productData.description,
                url: `/product/${params.productId}`,
                images: productData.images.map(img => ({
                    url: img.localUrl,
                    width: 800,
                    height: 600,
                    alt: `${productData.name} - ${img.index + 1}`,
                })),
                type: 'website', // Mantendo 'website' pois é o tipo aceito pelo Next.js
                siteName: 'Alexa Semijoias',
            },
            twitter: {
                card: 'summary_large_image',
                title: toTitleCase(productData.name),
                description: productData.description,
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
                'product:brand': 'Alexa Semijoias',
                'product:availability': variation.estoque > 0 ? 'in stock' : 'out of stock',
                'product:condition': 'new',
                'product:price:amount': variation.value.price.toString(),
                'product:price:currency': 'BRL',
                'product:retailer_item_id': variation.sku,
                'product:category': productData.categories.join(','),
                'product:weight': `${variation.peso}g`,
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

async function getProduct(productId: string) {
    const docRef = doc(projectFirestoreDataBase, 'products', productId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    // Convertendo os campos de data para objetos simples
    const processedData = {
        ...data,
        creationDate: data?.creationDate ? {
            seconds: data.creationDate.seconds,
            nanoseconds: data.creationDate.nanoseconds,
        } : null,
        updatingDate: data?.updatingDate ? {
            seconds: data.updatingDate.seconds,
            nanoseconds: data.updatingDate.nanoseconds,
        } : null,
        id: docSnap.id,
        exist: docSnap.exists(),
    } as ProductBundleType & FireBaseDocument;

    return processedData;
}

export default async function ProductScreenPage({ params: { productId } }: { params: { productId: string } }) {
    const initialProduct = await getProduct(productId);
    
    return (
        <Product id={ productId } initialProduct={ initialProduct } />
    );
}
