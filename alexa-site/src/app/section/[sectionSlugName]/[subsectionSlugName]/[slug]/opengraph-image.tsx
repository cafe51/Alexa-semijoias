import { ImageResponse } from 'next/og';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
 
export const runtime = 'edge';
export const alt = 'Produto Alexa Semijoias';
export const size = {
    width: 1200,
    height: 630,
};
 
export default async function Image({ params }: { params: { productId: string } }) {
    try {
        const docRef = doc(projectFirestoreDataBase, 'products', params.productId);
        const docSnap = await getDoc(docRef);
        const productData = {
            ...docSnap.data(),
            id: docSnap.id,
            exist: docSnap.exists(),
        } as ProductBundleType & FireBaseDocument;
        
        return new ImageResponse(
            (
                <div
                    style={ {
                        background: '#FAF9F6',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                    } }
                >
                    <div
                        style={ {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px',
                        } }
                    >
                        <h1 style={ { fontSize: '48px', color: '#333333' } }>
                            { productData.name }
                        </h1>
                        <p style={ { fontSize: '24px', color: '#666666' } }>
                            { productData.description }
                        </p>
                        <p style={ { fontSize: '32px', color: '#C48B9F' } }>
                            R$ { productData.value.price.toFixed(2) }
                        </p>
                    </div>
                </div>
            ),
            {
                ...size,
            },
        );
    } catch (error) {
        return new ImageResponse(
            (
                <div
                    style={ {
                        background: '#FAF9F6',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    } }
                >
                    <h1 style={ { fontSize: '48px', color: '#333333' } }>
                        Alexa Semijoias
                    </h1>
                </div>
            ),
            {
                ...size,
            },
        );
    }
}
