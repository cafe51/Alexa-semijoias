'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSnapshotPag } from '../../hooks/useSnapshotPag';
import { FilterOptionForUseSnapshot, ProductBundleType } from '../../utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import ProductSorter, { SortOption } from './ProductSorter';
import removeAccents from '@/app/utils/removeAccents';
import SectionPageTitle from '@/app/section/SectionPageTitle';

interface ProductsListProps {
    sectionName?: string;
    subsection?: string;
    searchTerm?: string;
}

export default function ProductsList({ sectionName, subsection, searchTerm }: ProductsListProps) {
    useEffect(() => console.log('searchTerm', searchTerm), [searchTerm]);

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

        // Se existe um termo de busca, verifica no campo keyWords
        if (searchTerm) {
            const normalizedTerm = removeAccents(searchTerm.toLowerCase());
            return [
                ...baseFilters,
                { field: 'keyWords', operator: 'array-contains', value: normalizedTerm },
            ];
        }

        // Filtro por subseção, se especificado
        if (subsection) {
            return [
                ...baseFilters,
                { field: 'subsections', operator: 'array-contains', value: subsection },
            ];
        }

        // Filtro por seção, se especificado
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

    useEffect(() => {
        console.log('Filtros aplicados:', pedidosFiltrados);
    }, [pedidosFiltrados]);

    if ((isLoading && !documents)) return <LoadingIndicator />;

    if (documents && documents.length <= 0) {
        if (searchTerm) {
            return <h1 className="text-center mt-8">Nenhum produto encontrado para &ldquo;{ searchTerm }&rdquo;</h1>;
        }
        return <h1 className="text-center mt-8">Ainda não há produtos nessa seção</h1>;
    }

    return (
        <main>
            
            { documents && documents.length > 0 && (
                <>
                    {
                        (subsection
                            ? 
                            sectionName && subsection && <SectionPageTitle section={ sectionName } subsection={ subsection.split(':')[1] } />
                            :
                            sectionName && <SectionPageTitle section={ sectionName } />)

                    }
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
