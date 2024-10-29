'use client';

import ProductsList from '@/app/components/ProductList/ProductsList';

export default function Search({ params }: { params: { searchTerm: string } }) {
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Resultados para: { decodeURIComponent(params.searchTerm) }</h1>
                <ProductsList searchTerm={ decodeURIComponent(params.searchTerm) } />
            </div>
        </div>
    );
}
