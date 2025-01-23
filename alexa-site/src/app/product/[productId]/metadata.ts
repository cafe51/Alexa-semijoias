import { Metadata } from 'next';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

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
            openGraph: {
                title: productData.name,
                description: productData.description,
                url: `https://alexasemijoias.com.br/product/${params.productId}`,
                images: [
                    {
                        url: mainImage,
                        width: 800,
                        height: 600,
                        alt: productData.name,
                    },
                ],
                type: 'website',
                siteName: 'Alexa Semijoias',
            },
            other: {
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
        };
    }
}
