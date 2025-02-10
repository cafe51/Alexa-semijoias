// src/app/api/recommended-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedProducts } from '@/app/services/recommendedProducts';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const mainProductId = searchParams.get('mainProductId');

    if (!mainProductId) {
        return NextResponse.json({ error: 'Missing mainProductId' }, { status: 400 });
    }

    try {
        const recommendedProducts = await getRecommendedProducts(mainProductId);
        return NextResponse.json({ recommendedProducts });
    } catch (error) {
        console.error('Error fetching recommended products:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
