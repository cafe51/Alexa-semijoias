// src/app/search/[searchTerm]/page.tsx

import PageContainer from '@/app/components/PageContainer';
import ProductsListClient from '@/app/components/ProductList/ProductsListClient';

export default function Search({ params }: { params: { searchTerm: string } }) {
    return (
        <PageContainer>
            <>
                <h1 className="text-2xl font-semibold mb-6">Resultados para: { decodeURIComponent(params.searchTerm) }</h1>
                <ProductsListClient searchTerm={ decodeURIComponent(params.searchTerm) } />
            </>
        </PageContainer>
    );
}
