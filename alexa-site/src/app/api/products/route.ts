// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/app/services/products';


export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sectionName = searchParams.get('section') || undefined;
        const subsection = searchParams.get('subsection') || undefined;
        const collectionName = searchParams.get('collection') || undefined;
        const lastVisibleId = searchParams.get('lastVisible') || undefined;
        const orderByField = searchParams.get('orderBy') || 'creationDate';
        const orderDirection = (searchParams.get('direction') || 'desc') as 'asc' | 'desc';
        const searchTerm = searchParams.get('searchTerm')?.trim() || undefined;
        const limit = parseInt(searchParams.get('limit') || '12', 10);

        const productsResponse = await fetchProducts({
            sectionName,
            subsection,
            collectionName,
            limit,
            orderBy: orderByField,
            direction: orderDirection,
            lastVisible: lastVisibleId,
            searchTerm,
        });

        return new NextResponse(JSON.stringify(productsResponse), {
            headers: {
                // Define cache compartilhado: 60 segundos e permite servir stale-while-revalidate
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return NextResponse.json(
            { error: 'Falha ao carregar produtos' },
            { status: 500 },
        );
    }
}
