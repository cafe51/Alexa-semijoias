'use client';
import { useMemo, useState } from 'react';
import { useSnapshotPag } from '../../hooks/useSnapshotPag';
import { FilterOptionForUseSnapshot, ProductBundleType } from '../../utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import ProductSorter, { SortOption } from './ProductSorter';

export default function ProductsList({ sectionName, subsection }: { sectionName: string, subsection?: string }) {
    const [currentSort, setCurrentSort] = useState<SortOption>({ 
        value: 'newest', 
        label: 'Novidades', 
        orderBy: 'creationDate', 
        direction: 'desc', 
    });

    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[]>(() => {
        if (subsection) {
            return [
                { field: 'subsections', operator: 'array-contains', value: subsection },
                { field: 'estoqueTotal', operator: '>', value: 0 },
            ];
        } else {
            return [
                { field: 'sections', operator: 'array-contains', value: sectionName },
                { field: 'estoqueTotal', operator: '>', value: 0 },
            ];
        }
    }, [sectionName, subsection]);

    const orderByOption = useMemo(() => ({
        field: currentSort.orderBy,
        direction: currentSort.direction,
    }), [currentSort.orderBy, currentSort.direction]);

    const { documents, isLoading, hasMore, loadMore } = useSnapshotPag<ProductBundleType>(
        'products',
        pedidosFiltrados,
        10,
        orderByOption,
    );

    if (isLoading && !documents) return <LoadingIndicator />;

    if (documents && documents.length <= 0) return <h1 className="text-center mt-8">Ainda não há produtos nessa categoria</h1>;

    return (
        <main>
            { documents && documents.length > 0 && (
                <>
                    <ProductSorter 
                        currentSort={ currentSort.value }
                        onSortChange={ (option) => setCurrentSort(option) }
                    />
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
