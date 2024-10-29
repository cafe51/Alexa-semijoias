'use client';
import { useMemo, useState } from 'react';
import { useSnapshotPag } from '../../hooks/useSnapshotPag';
import { FilterOptionForUseSnapshot, ProductBundleType } from '../../utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import ProductSorter, { SortOption } from './ProductSorter';

interface ProductsListProps {
    sectionName?: string;
    subsection?: string;
    searchTerm?: string;
}

export default function ProductsList({ sectionName, subsection, searchTerm }: ProductsListProps) {
    const [currentSort, setCurrentSort] = useState<SortOption>({ 
        value: 'newest', 
        label: 'Novidades', 
        orderBy: 'creationDate', 
        direction: 'desc', 
    });

    const pedidosFiltrados = useMemo<FilterOptionForUseSnapshot[]>(() => {
        const baseFilters: FilterOptionForUseSnapshot[] = [
            { field: 'showProduct', operator: '==', value: true },
            { field: 'estoqueTotal', operator: '>', value: 0 },
        ];

        if (searchTerm) {
            return [
                ...baseFilters,
                { field: 'name', operator: '>=', value: searchTerm.toLowerCase() },
                { field: 'name', operator: '<=', value: searchTerm.toLowerCase() + '\uf8ff' },
            ];
        }

        if (subsection) {
            return [
                ...baseFilters,
                { field: 'subsections', operator: 'array-contains', value: subsection },
            ];
        }

        if (sectionName) {
            return [
                ...baseFilters,
                { field: 'sections', operator: 'array-contains', value: sectionName },
            ];
        }

        return baseFilters;
    }, [sectionName, subsection, searchTerm]);

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

    if (documents && documents.length <= 0) {
        if (searchTerm) {
            return <h1 className="text-center mt-8">Nenhum produto encontrado para &ldquo;{ searchTerm }&rdquo;</h1>;
        }
        return <h1 className="text-center mt-8">Ainda não há produtos nessa categoria</h1>;
    }

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