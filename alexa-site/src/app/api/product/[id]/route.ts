// src/app/api/product/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/firebase/admin-config';
import { serializeData } from '@/app/utils/serializeData';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const { id } = params;
    try {
        const doc = await adminDb.collection('products').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 },
            );
        }

        const product = {
            id: doc.id,
            exist: doc.exists,
            ...serializeData(doc.data()),
        } as ProductBundleType & FireBaseDocument;

        return NextResponse.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produto' },
            { status: 500 },
        );
    }
}
