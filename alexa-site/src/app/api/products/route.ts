// src/app/api/products/route.ts
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/app/services/products';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sectionName = searchParams.get('section') || undefined;
        const subsection = searchParams.get('subsection') || undefined;
        const lastVisibleId = searchParams.get('lastVisible') || undefined;
        const orderByField = searchParams.get('orderBy') || 'creationDate';
        const orderDirection = (searchParams.get('direction') || 'desc') as 'asc' | 'desc';
        const searchTerm = searchParams.get('searchTerm')?.trim() || undefined;

        const productsResponse = await fetchProducts({
            sectionName,
            subsection,
            limit: ITEMS_PER_PAGE,
            orderBy: orderByField,
            direction: orderDirection,
            lastVisible: lastVisibleId,
            searchTerm,
        });

        return NextResponse.json(productsResponse);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return NextResponse.json(
            { error: 'Falha ao carregar produtos' },
            { status: 500 },
        );
    }
}
