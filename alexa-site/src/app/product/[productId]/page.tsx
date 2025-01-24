// src/app/product/[productId]/page.tsx

import { Metadata } from 'next';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Product from '@/app/components/ProductPage/Product';

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    try {
        const docRef = doc(projectFirestoreDataBase, 'products', params.productId);
        const docSnap = await getDoc(docRef);
        const productData = {
            ...docSnap.data(),
            id: docSnap.id,
            exist: docSnap.exists(),
        } as ProductBundleType & FireBaseDocument;

        const mainImage = productData.images[0]?.localUrl || '';
        const variation = productData.productVariations[0];

        return {
            title: productData.name,
            description: productData.description,
            metadataBase: new URL('https://www.alexasemijoias.com.br'),
            openGraph: {
                title: productData.name,
                description: productData.description,
                url: `/product/${params.productId}`,
                images: [
                    {
                        url: mainImage,
                        width: 800,
                        height: 600,
                        alt: productData.name,
                    },
                ],
                // a tipagem não reconhece o type 'product' por isso tive que usar 'website'
                type: 'website',
                siteName: 'Alexa Semijoias',
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

export default function ProductScreenPage({ params: { productId } }: { params: { productId: string } }) {
    return (
        <Product id={ productId } />
    );
}
