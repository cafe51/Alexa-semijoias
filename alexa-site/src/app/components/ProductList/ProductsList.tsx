'use client';
import { useMemo } from 'react';
import { useSnapshotPag } from '../../hooks/useSnapshotPag';
import { FilterOptionForUseSnapshot, ProductBundleType } from '../../utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';

export default function ProductsList({ sectionName, subsection }: { sectionName: string, subsection?: string }) {
    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[]>(() => {
        if (subsection) {
            return [
                { field: 'subsections', operator: 'array-contains', value: subsection },
            ];
        } else {
            return [
                { field: 'sections', operator: 'array-contains', value: sectionName },
            ];
        }
    }, [sectionName, subsection]);

    const { documents, isLoading, hasMore, loadMore } = useSnapshotPag<ProductBundleType>(
        'products',
        pedidosFiltrados,
        4,
    );

    if (isLoading && !documents) return <LoadingIndicator />;

    if (documents && documents.length <= 0) return <h1 className="text-center mt-8">Ainda não há produtos nessa categoria</h1>;

    return (
        <main>
            { documents && documents.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        { documents.map((productData) => (
                            <ProductCard key={ productData.id } product={ productData } />
                        )) }
                    </div>
                    { hasMore && (
                        <ButtonPaginator loadMore={ loadMore } isLoading={ isLoading }>
                            Carregar mais
                        </ButtonPaginator>
                    ) }
                </>
            ) }
        </main>
    );
}
